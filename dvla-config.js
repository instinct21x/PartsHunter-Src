// DVLA API Configuration
// Get your API key from: https://developer-portal.driver-vehicle-licensing.api.gov.uk/

export const DVLA_CONFIG = {
  // Replace 'YOUR_API_KEY_HERE' with your actual DVLA API key
  API_KEY: 'p3n1E3SfPM2j2jZJ1fPlQJpKxAvLs1E5Nfjiq5if',
  
  // DVLA API endpoint
  API_URL: 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
  
  // Rate limiting info
  RATE_LIMIT: {
    requests_per_minute: 600, // DVLA allows 600 requests per minute
    requests_per_day: 10000   // DVLA allows 10,000 requests per day
  }
};

// Example API key format: 'live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
// Test API key format: 'test_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'