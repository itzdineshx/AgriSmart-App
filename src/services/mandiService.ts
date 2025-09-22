// Mandi Price Service for Data.gov.in API
export const API_KEY = '579b464db66ec23bdd00000155389df796544a8c7e34f05e167005a7';
export const BASE_URL = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';

// Working API endpoint for real-time mandi data
// Source: Variety-wise Daily Market Prices Data of Commodity
// Organization: Ministry of Agriculture and Farmers Welfare - Directorate of Marketing and Inspection (DMI)

export interface MandiPrice {
  commodity: string;
  variety?: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_date: string;
  market: string;
  district?: string;
  state?: string;
  arrival_date?: string;
  grade?: string;
  // Calculated fields
  min_price_per_kg: number;
  max_price_per_kg: number;
  modal_price_per_kg: number;
}

export interface MandiLocation {
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

export interface FilterOptions {
  commodity?: string;
  commodityCategory?: string;
  state?: string;
  district?: string;
  market?: string;
  dateFrom?: Date;
  dateTo?: Date;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'commodity' | 'price_asc' | 'price_desc' | 'date' | 'market';
  search?: string;
  onlyRecentData?: boolean;
}

// Chennai Metropolitan Area Markets with Priority Mapping
export const CHENNAI_AREA_MARKETS = {
  // Primary Chennai markets (highest priority)
  primary: [
    { name: 'Koyambedu Market', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0644, lng: 80.1982, priority: 1 },
    { name: 'Chennai Central Market', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, priority: 1 },
    { name: 'Tambaram Market', district: 'Chennai', state: 'Tamil Nadu', lat: 12.9249, lng: 80.1000, priority: 1 },
  ],
  // Secondary nearby markets (medium priority)
  secondary: [
    { name: 'Chengalpattu Market', district: 'Chengalpattu', state: 'Tamil Nadu', lat: 12.6921, lng: 79.9755, priority: 2 },
    { name: 'Guduvancheri Market', district: 'Chengalpattu', state: 'Tamil Nadu', lat: 12.8480, lng: 80.0597, priority: 2 },
    { name: 'Chromepet Market', district: 'Chennai', state: 'Tamil Nadu', lat: 12.9516, lng: 80.1462, priority: 2 },
    { name: 'Kundrathur Market', district: 'Kancheepuram', state: 'Tamil Nadu', lat: 12.9985, lng: 80.1050, priority: 2 },
  ],
  // Regional markets (lower priority but relevant)
  regional: [
    { name: 'Thiruninravur Market', district: 'Thiruvallur', state: 'Tamil Nadu', lat: 13.2126, lng: 79.9991, priority: 3 },
    { name: 'Poonamallee Market', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0500, lng: 80.0972, priority: 3 },
    { name: 'Avadi Market', district: 'Chennai', state: 'Tamil Nadu', lat: 13.1147, lng: 80.1000, priority: 3 },
    { name: 'Sriperumbudur Market', district: 'Kancheepuram', state: 'Tamil Nadu', lat: 12.9675, lng: 79.9430, priority: 3 },
  ]
};

// Function to check if user is in Chennai area
export const isChennaiAreaUser = (userLat?: number, userLng?: number, searchTerm?: string, selectedState?: string, selectedDistrict?: string): boolean => {
  // Check by search terms
  if (searchTerm) {
    const chennaiTerms = ['chennai', 'koyambedu', 'tambaram', 'chromepet', 'chengalpattu'];
    if (chennaiTerms.some(term => searchTerm.toLowerCase().includes(term))) {
      return true;
    }
  }

  // Check by location selection
  if (selectedState === 'Tamil Nadu' && (selectedDistrict === 'Chennai' || selectedDistrict === 'Chengalpattu')) {
    return true;
  }

  // Check by GPS coordinates (if available)
  if (userLat && userLng) {
    // Chennai area bounding box (approximate)
    const chennaiArea = {
      north: 13.3,
      south: 12.7,
      east: 80.4,
      west: 79.8
    };
    
    return userLat >= chennaiArea.south && userLat <= chennaiArea.north &&
           userLng >= chennaiArea.west && userLng <= chennaiArea.east;
  }

  return false;
};

// Get Chennai area market suggestions with priority
export const getChennaiAreaMarkets = (): MandiLocation[] => {
  const allChennaiMarkets = [
    ...CHENNAI_AREA_MARKETS.primary,
    ...CHENNAI_AREA_MARKETS.secondary,
    ...CHENNAI_AREA_MARKETS.regional
  ];
  
  return allChennaiMarkets.sort((a, b) => a.priority - b.priority);
};

// Enhanced function to get relevant markets for Chennai users
export const getRelevantMarketsForChennai = (data: MandiPrice[]): MandiPrice[] => {
  // Priority mapping for Chennai area markets
  const chennaiMarketNames = [
    // Exact matches from API data
    'Chengalpattu(Uzhavar Sandhai )',
    'Guduvancheri(Uzhavar Sandhai )',
    'Kundrathur(Uzhavar Sandhai )',
    'Jameenrayapettai(Uzhavar Sandhai )',
    'Madhuranthagam(Uzhavar Sandhai )',
    'Thirukalukundram(Uzhavar Sandhai )',
    // Any market containing Chennai-related terms
    'Koyambedu',
    'Chennai',
    'Tambaram',
    'Chromepet',
  ];

  // Filter for Tamil Nadu markets with Chennai area priority
  const tamilNaduData = data.filter(item => item.state === 'Tamil Nadu');
  
  // Separate Chennai area markets and other TN markets
  const chennaiAreaData = tamilNaduData.filter(item => 
    chennaiMarketNames.some(marketName => 
      item.market.toLowerCase().includes(marketName.toLowerCase()) ||
      item.district?.toLowerCase().includes('chennai') ||
      item.district?.toLowerCase().includes('chengalpattu') ||
      item.district?.toLowerCase().includes('kancheepuram')
    )
  );

  const otherTNData = tamilNaduData.filter(item => 
    !chennaiMarketNames.some(marketName => 
      item.market.toLowerCase().includes(marketName.toLowerCase()) ||
      item.district?.toLowerCase().includes('chennai') ||
      item.district?.toLowerCase().includes('chengalpattu') ||
      item.district?.toLowerCase().includes('kancheepuram')
    )
  );

  // Return Chennai area markets first, then other TN markets
  return [...chennaiAreaData, ...otherTNData.slice(0, 50)]; // Limit other markets
};

// Mock mandi location mapping (in real app, this would be from a database)
export const MANDI_LOCATIONS: MandiLocation[] = [
  // Tamil Nadu - Chennai Metropolitan Area (prioritized)
  { name: 'Koyambedu Market', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0644, lng: 80.1982 },
  { name: 'Chengalpattu Market', district: 'Chengalpattu', state: 'Tamil Nadu', lat: 12.6921, lng: 79.9755 },
  { name: 'Guduvancheri Market', district: 'Chengalpattu', state: 'Tamil Nadu', lat: 12.8480, lng: 80.0597 },
  { name: 'Tambaram Market', district: 'Chennai', state: 'Tamil Nadu', lat: 12.9249, lng: 80.1000 },
  { name: 'Chromepet Market', district: 'Chennai', state: 'Tamil Nadu', lat: 12.9516, lng: 80.1462 },
  // Punjab
  // Punjab
  { name: 'Amritsar', district: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  { name: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  { name: 'Jalandhar', district: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762 },
  { name: 'Patiala', district: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869 },
  { name: 'Bathinda', district: 'Bathinda', state: 'Punjab', lat: 30.2118, lng: 74.9455 },
  
  // Haryana
  { name: 'Karnal', district: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905 },
  { name: 'Hisar', district: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217 },
  { name: 'Sirsa', district: 'Sirsa', state: 'Haryana', lat: 29.5353, lng: 75.0270 },
  
  // Uttar Pradesh
  { name: 'Meerut', district: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
  { name: 'Agra', district: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  
  // Maharashtra
  { name: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Nashik', district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Aurangabad', district: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
  
  // Rajasthan
  { name: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Jodhpur', district: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { name: 'Bikaner', district: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
  
  // Gujarat
  { name: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Rajkot', district: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
  { name: 'Vadodara', district: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  
  // Madhya Pradesh
  { name: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Indore', district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Ujjain', district: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },
  
  // Karnataka
  { name: 'Bangalore', district: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Mysore', district: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { name: 'Hubli', district: 'Dharwad', state: 'Karnataka', lat: 15.3647, lng: 75.1240 },
  
  // Tamil Nadu (Enhanced with more markets)
  { name: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Koyambedu Market', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0644, lng: 80.1982 },
  { name: 'Thiruninravur', district: 'Thiruvallur', state: 'Tamil Nadu', lat: 13.2126, lng: 79.9991 },
  { name: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { name: 'Salem', district: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
  { name: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
  { name: 'Tirunelveli', district: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567 },
  { name: 'Vellore', district: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325 },
  { name: 'Erode', district: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lng: 77.7172 },
  { name: 'Dindigul', district: 'Dindigul', state: 'Tamil Nadu', lat: 10.3673, lng: 77.9803 },
  
  // West Bengal
  { name: 'Kolkata', district: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Siliguri', district: 'Darjeeling', state: 'West Bengal', lat: 26.7271, lng: 88.3953 },
  
  // Andhra Pradesh
  { name: 'Hyderabad', district: 'Hyderabad', state: 'Andhra Pradesh', lat: 17.3850, lng: 78.4867 },
  { name: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  
  // Kerala
  { name: 'Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
  
  // Odisha
  { name: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { name: 'Cuttack', district: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8828 },
  
  // Delhi
  { name: 'Delhi', district: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
];

// Complete list of Indian States and Union Territories
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Convert quintal price to per kg price
export const convertQuintalToKg = (quintalPrice: number): number => {
  return Number((quintalPrice / 100).toFixed(2));
};

// Format API date from DD/MM/YYYY to YYYY-MM-DD
const formatApiDate = (apiDate: string): string => {
  if (!apiDate) return '';
  const parts = apiDate.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return apiDate;
};

// Transform API data to our MandiPrice format
export const transformMandiData = (apiData: any[]): MandiPrice[] => {
  if (!Array.isArray(apiData)) {
    console.warn('transformMandiData: Input is not an array', apiData);
    return [];
  }

  const transformed = apiData.map((item, index) => {
    try {
      // Debug a sample of the raw data
      if (index === 0 || index === apiData.length - 1 || Math.random() < 0.005) {
        console.log(`Sample raw API item (index ${index}):`, {
          Commodity: item.Commodity, 
          Market: item.Market,
          State: item.State,
          Price: item.Modal_Price,
          Date: item.Arrival_Date
        });
      }

      const transformedItem: MandiPrice = {
        commodity: item.Commodity || '',
        variety: item.Variety || '',
        min_price: Number(item.Min_Price) || 0,
        max_price: Number(item.Max_Price) || 0,
        modal_price: Number(item.Modal_Price) || 0,
        price_date: item.Arrival_Date ? formatApiDate(item.Arrival_Date) : '',
        market: item.Market || '',
        district: item.District || '',
        state: item.State || '',
        arrival_date: item.Arrival_Date ? formatApiDate(item.Arrival_Date) : '',
        grade: item.Grade || '',
        // Convert to per kg prices (API prices are in Rs per quintal)
        min_price_per_kg: convertQuintalToKg(Number(item.Min_Price) || 0),
        max_price_per_kg: convertQuintalToKg(Number(item.Max_Price) || 0),
        modal_price_per_kg: convertQuintalToKg(Number(item.Modal_Price) || 0),
      };

      // Debug the transformation for a few items
      if (index === 0 || index === apiData.length - 1 || Math.random() < 0.005) {
        console.log(`Transformed item (index ${index}):`, {
          commodity: transformedItem.commodity,
          market: transformedItem.market,
          state: transformedItem.state,
          price: transformedItem.modal_price_per_kg,
          apiDate: item.Arrival_Date,
          formattedDate: transformedItem.price_date
        });
      }

      // Validate that essential fields are present
      if (!transformedItem.commodity || !transformedItem.market || transformedItem.modal_price_per_kg <= 0) {
        console.warn(`Skipping invalid item at index ${index}:`, transformedItem);
        return null;
      }

      return transformedItem;
    } catch (error) {
      console.error(`Error transforming item at index ${index}:`, error, item);
      return null;
    }
  }).filter((item): item is MandiPrice => item !== null);

  console.log(`Successfully transformed ${transformed.length} out of ${apiData.length} items`);
  return transformed;
};

// Fetch mandi price data from real-time API with Chennai prioritization
export const fetchMandiPrices = async (
  filters: {
    commodity?: string;
    state?: string;
    district?: string;
    date?: string;
    limit?: number;
    offset?: number;
    onlyRecentData?: boolean;
    prioritizeChennai?: boolean;
    userLocation?: { lat: number; lng: number };
    searchTerm?: string;
  } = {}
): Promise<{ data: MandiPrice[]; total: number }> => {
  console.log('Fetching real-time mandi prices with filters:', filters);
  
  try {
    const params = new URLSearchParams({
      'api-key': API_KEY,
      format: 'json',
      limit: (filters.limit || 500).toString(),
      offset: (filters.offset || 0).toString(),
      // Sort by arrival date in descending order to get most recent data first
      'sort[Arrival_Date]': 'desc',
    });

    // Add filters if provided
    if (filters.state) {
      params.append('filters[State]', filters.state);
    }
    if (filters.district) {
      params.append('filters[District]', filters.district);
    }
    if (filters.commodity) {
      params.append('filters[Commodity]', filters.commodity);
    }
    
    // Handle date filtering
    if (filters.onlyRecentData !== false && !filters.date) {
      // For recent data, we'll fetch all data and filter on the client side
      // since the API doesn't support date range operators like >=
      console.log('Fetching recent data - will filter client-side');
    }
    
    if (filters.date) {
      // Convert YYYY-MM-DD to DD-MM-YYYY format for API
      const dateParts = filters.date.split('-');
      if (dateParts.length === 3) {
        const apiDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        params.append('filters[Arrival_Date]', apiDate);
      }
    }

    console.log('API Request URL:', `${BASE_URL}?${params.toString()}`);

    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Add these options to handle CORS and network issues
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API Response:', result);
    
    // Check if we got valid data
    if (result.status === 'error') {
      throw new Error(`API Error: ${result.message || JSON.stringify(result)}`);
    }
    
    if (result.records && Array.isArray(result.records)) {
      console.log(`Successfully fetched ${result.records.length} real-time records`);
      
      let transformedData = transformMandiData(result.records);
      
      // Apply Chennai prioritization if requested
      if (filters.prioritizeChennai || isChennaiAreaUser(
        filters.userLocation?.lat, 
        filters.userLocation?.lng, 
        filters.searchTerm, 
        filters.state, 
        filters.district
      )) {
        console.log('Applying Chennai area market prioritization');
        transformedData = getRelevantMarketsForChennai(transformedData);
      }
      
      // Apply client-side filtering for recent data if needed
      if (filters.onlyRecentData !== false && !filters.date) {
        // Since we're sorting by date desc, the API gives us recent data first
        // Filter to show data from the last 3 days to ensure good coverage
        const today = new Date();
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        console.log('Today:', today.toISOString().split('T')[0]);
        console.log('Filtering for data from:', threeDaysAgo.toISOString().split('T')[0], 'onwards');
        
        // First, let's see what date ranges we have in the data
        const dates = transformedData
          .map(item => item.arrival_date)
          .filter(date => date)
          .map(date => new Date(date))
          .filter(date => !isNaN(date.getTime()))
          .sort((a, b) => b.getTime() - a.getTime());
        
        if (dates.length > 0) {
          console.log('Date range in API data:', 
            dates[dates.length - 1].toISOString().split('T')[0], 
            'to', 
            dates[0].toISOString().split('T')[0]
          );
        }
        
        // Filter for recent data (last 3 days from today for better coverage)
        const filteredForRecent = transformedData.filter(item => {
          if (!item.arrival_date) return false; // Don't keep items without dates for recent filter
          
          try {
            const itemDate = new Date(item.arrival_date);
            return itemDate >= threeDaysAgo;
          } catch (error) {
            console.warn('Error parsing date:', item.arrival_date, error);
            return false;
          }
        });
        
        console.log(`Found ${filteredForRecent.length} records from last 3 days (since ${threeDaysAgo.toISOString().split('T')[0]})`);
        
        // If no recent data found, inform user and keep all data
        if (filteredForRecent.length === 0) {
          console.log('No data found from last 3 days. API may contain only historical data.');
          console.log('Keeping all data. To see recent data, the API needs to be updated with current dates.');
          // Don't filter - keep all data so user sees something
        } else {
          transformedData = filteredForRecent;
        }
      }
      
      return {
        data: transformedData,
        total: transformedData.length,
      };
    } else {
      throw new Error('No records found in API response');
    }
  } catch (error) {
    console.error('Error fetching real-time mandi prices:', error);
    
    // If it's a network error, try with a simpler request
    if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('parsing_exception'))) {
      console.log('Network/parsing error detected, retrying with simpler request...');
      
      try {
        // Retry with minimal filters and basic URL
        const simpleParams = new URLSearchParams({
          'api-key': API_KEY,
          format: 'json',
          limit: '500', // Larger limit for better data coverage
          offset: '0',
          // Always sort by date to get recent data
          'sort[Arrival_Date]': 'desc',
        });
        
        console.log('Retry API Request URL:', `${BASE_URL}?${simpleParams.toString()}`);
        
        const retryResponse = await fetch(`${BASE_URL}?${simpleParams.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
          cache: 'no-cache',
        });
        
        if (retryResponse.ok) {
          const retryResult = await retryResponse.json();
          if (retryResult.records && Array.isArray(retryResult.records)) {
            console.log(`Retry successful: ${retryResult.records.length} records`);
            
            let transformedData = transformMandiData(retryResult.records);
            
            // Apply client-side filtering
            if (filters.onlyRecentData !== false) {
              const twoDaysAgo = new Date();
              twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
              
              transformedData = transformedData.filter(item => {
                if (!item.arrival_date) return true;
                try {
                  const itemDate = new Date(item.arrival_date);
                  return itemDate >= twoDaysAgo;
                } catch {
                  return true;
                }
              });
            }
            
            return {
              data: transformedData,
              total: transformedData.length,
            };
          }
        }
      } catch (retryError) {
        console.error('Retry also failed:', retryError);
      }
    }
    
    throw error; // Re-throw original error if retry fails
  }
};

// Find mandi location by name
export const findMandiLocation = (mandiName: string): MandiLocation | null => {
  const location = MANDI_LOCATIONS.find(
    loc => loc.name.toLowerCase().includes(mandiName.toLowerCase()) ||
           mandiName.toLowerCase().includes(loc.name.toLowerCase())
  );
  return location || null;
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Find nearest mandis to user location
export const findNearestMandis = (
  userLat: number, 
  userLng: number, 
  limit: number = 5
): MandiLocation[] => {
  return MANDI_LOCATIONS
    .map(mandi => ({
      ...mandi,
      distance: calculateDistance(userLat, userLng, mandi.lat, mandi.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};

// Get unique commodities from data
export const getUniqueCommodities = (data: MandiPrice[]): string[] => {
  const commodities = [...new Set(data.map(item => item.commodity))];
  return commodities.filter(c => c).sort();
};

// Get unique states from data
export const getUniqueStates = (data: MandiPrice[]): string[] => {
  const states = [...new Set(data.map(item => item.state))];
  return states.filter(s => s).sort();
};

// Get unique markets from data
export const getUniqueMarkets = (data: MandiPrice[]): string[] => {
  const markets = [...new Set(data.map(item => item.market))];
  return markets.filter(m => m).sort();
};

// Get markets by state
export const getMarketsByState = (data: MandiPrice[], state: string): string[] => {
  const markets = [...new Set(data.filter(item => item.state === state).map(item => item.market))];
  return markets.filter(m => m).sort();
};

// Get districts by state
export const getDistrictsByState = (data: MandiPrice[], state: string): string[] => {
  const districts = [...new Set(data.filter(item => item.state === state).map(item => item.district))];
  return districts.filter(d => d).sort();
};

// Commodity categories for filtering
export const COMMODITY_CATEGORIES = {
  fruits: ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes', 'Pomegranate', 'Papaya', 'Watermelon', 'Guava', 'Pineapple'],
  vegetables: ['Tomato', 'Onion', 'Potato', 'Cabbage', 'Cauliflower', 'Carrot', 'Brinjal', 'Okra', 'Peas', 'Garlic'],
  cereals: ['Wheat', 'Rice', 'Maize', 'Barley', 'Bajra', 'Jowar', 'Paddy(Dhan)(Common)', 'Paddy(Dhan)(Basmati)'],
  pulses: ['Arhar', 'Masoor', 'Moong', 'Urad', 'Gram', 'Rajma'],
  oilseeds: ['Groundnut', 'Mustard', 'Sunflower', 'Soybean', 'Sesame'],
  spices: ['Turmeric', 'Coriander', 'Cumin', 'Fenugreek', 'Red Chilli', 'Black Pepper'],
};

export const getCommodityCategory = (commodity: string): string => {
  for (const [category, items] of Object.entries(COMMODITY_CATEGORIES)) {
    if (items.some(item => commodity.toLowerCase().includes(item.toLowerCase()))) {
      return category;
    }
  }
  return 'other';
};

// Get Chennai market alternatives with detailed information
export const getChennaiMarketAlternatives = () => {
  return {
    message: "Chennai metropolitan markets like Koyambedu aren't in the government API, but here are nearby alternatives:",
    alternatives: [
      {
        name: "Chengalpattu Uzhavar Sandhai",
        distance: "45 km from Chennai",
        description: "Major agricultural market serving Chennai metro area",
        commodities: "Vegetables, fruits, grains"
      },
      {
        name: "Guduvancheri Uzhavar Sandhai", 
        distance: "30 km from Chennai",
        description: "Suburban market with good connectivity to Chennai",
        commodities: "Fresh vegetables, dairy products"
      },
      {
        name: "Kundrathur Uzhavar Sandhai",
        distance: "25 km from Chennai", 
        description: "Closest government-registered market to Chennai",
        commodities: "Local produce, organic vegetables"
      }
    ],
    note: "These are government-registered markets. For Koyambedu wholesale prices, check local market reports or contact traders directly."
  };
};

// Enhanced market search with Chennai-specific suggestions
export const searchMarketsWithChennaiSupport = (searchTerm: string, allMarkets: string[]): string[] => {
  const normalizedSearch = searchTerm.toLowerCase();
  
  // If searching for Chennai-related terms, provide alternatives
  if (normalizedSearch.includes('chennai') || normalizedSearch.includes('koyambedu')) {
    const chennaiAlternatives = [
      'Chengalpattu(Uzhavar Sandhai )',
      'Guduvancheri(Uzhavar Sandhai )',
      'Kundrathur(Uzhavar Sandhai )',
      'Jameenrayapettai(Uzhavar Sandhai )'
    ];
    
    // Return Chennai alternatives first, then other matching markets
    const otherMatches = allMarkets.filter(market => 
      market.toLowerCase().includes(normalizedSearch) &&
      !chennaiAlternatives.includes(market)
    ).slice(0, 5);
    
    return [...chennaiAlternatives, ...otherMatches];
  }
  
  // Normal search for other terms
  return allMarkets.filter(market => 
    market.toLowerCase().includes(normalizedSearch)
  ).slice(0, 10);
};
export const debugApiData = (data: MandiPrice[]) => {
  const states = [...new Set(data.map(item => item.state))].sort();
  const markets = [...new Set(data.map(item => item.market))].sort();
  const tamilNaduMarkets = data.filter(item => item.state === 'Tamil Nadu')
    .map(item => item.market)
    .filter((market, index, arr) => arr.indexOf(market) === index)
    .sort();
  
  console.log('Available states:', states);
  console.log('Total markets:', markets.length);
  console.log('Tamil Nadu markets:', tamilNaduMarkets);
  
  return {
    states,
    totalMarkets: markets.length,
    tamilNaduMarkets,
    chennaiData: data.filter(item => 
      item.state === 'Tamil Nadu' && 
      (item.market?.toLowerCase().includes('chennai') || 
       item.district?.toLowerCase().includes('chennai'))
    )
  };
};