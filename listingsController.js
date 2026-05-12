import { searchEbayListings } from '../services/ebayService.js';
import { searchGumtreeListings } from '../services/gumtreeService.js';
import { searchFacebookListings } from '../services/facebookService.js';

/**
 * GET /api/listings/nearby
 *
 * Query params:
 *   keywords, make, model, maxPrice, minPrice, fuelType, gearbox,
 *   lat, lon, radius, sources (comma-separated), page, limit
 */
export async function getNearbyListings(req, res) {
  try {
    const {
      keywords = '',
      make = '',
      model = '',
      maxPrice,
      minPrice,
      fuelType,
      gearbox,
      lat,
      lon,
      radius = 50,
      sources = 'ebay,gumtree,facebook',
      page = 1,
      limit = 20,
    } = req.query;

    const sourceList = sources.split(',').map((s) => s.trim().toLowerCase());
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

    // Build combined search term
    const searchTerm = [make, model, keywords].filter(Boolean).join(' ').trim() || 'used car';
    const location = lat && lon ? { lat: parseFloat(lat), lon: parseFloat(lon) } : null;

    const commonParams = {
      keywords: searchTerm,
      make,
      model,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      fuelType,
      gearbox,
      location,
      radius: parseFloat(radius),
      limit: limitNum,
      page: pageNum,
    };

    // Fire all enabled sources in parallel; failures are isolated
    const [ebayResults, gumtreeResults, facebookResults] = await Promise.all([
      sourceList.includes('ebay')
        ? searchEbayListings(commonParams).catch((err) => {
            console.error('[eBay] Error:', err.message);
            return [];
          })
        : [],

      sourceList.includes('gumtree')
        ? searchGumtreeListings(commonParams).catch((err) => {
            console.error('[Gumtree] Error:', err.message);
            return [];
          })
        : [],

      sourceList.includes('facebook')
        ? searchFacebookListings(commonParams).catch((err) => {
            console.error('[Facebook] Error:', err.message);
            return [];
          })
        : [],
    ]);

    // Interleave results so no single source dominates the top of the feed
    const allListings = interleave(ebayResults, gumtreeResults, facebookResults);

    res.json({
      success: true,
      page: pageNum,
      count: allListings.length,
      sources: {
        ebay: ebayResults.length,
        gumtree: gumtreeResults.length,
        facebook: facebookResults.length,
      },
      results: allListings,
    });
  } catch (error) {
    console.error('[Listings Controller] Unhandled error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch listings' });
  }
}

/**
 * Round-robin interleave multiple arrays so results from different sources
 * are evenly distributed in the response list.
 */
function interleave(...arrays) {
  const result = [];
  const maxLen = Math.max(...arrays.map((a) => a.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (arr[i] !== undefined) result.push(arr[i]);
    }
  }
  return result;
}
