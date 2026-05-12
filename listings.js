import { Router } from 'express';
import { getNearbyListings } from '../controllers/listingsController.js';

const router = Router();

/**
 * GET /api/listings/nearby
 * Aggregate nearby car listings from eBay, Gumtree, and Facebook Marketplace.
 *
 * Query params:
 *   keywords      string   — free-text search (e.g. "Ford Focus")
 *   make          string   — vehicle make filter
 *   model         string   — vehicle model filter
 *   maxPrice      number   — maximum price in GBP
 *   minPrice      number   — minimum price in GBP
 *   fuelType      string   — petrol | diesel | hybrid | electric
 *   gearbox       string   — manual | automatic
 *   lat           number   — user latitude (from expo-location)
 *   lon           number   — user longitude
 *   radius        number   — search radius in miles (default 50)
 *   sources       string   — comma-separated list: ebay,gumtree,facebook
 *   page          number   — page number (default 1)
 *   limit         number   — results per page (max 50, default 20)
 */
router.get('/nearby', getNearbyListings);

export default router;
