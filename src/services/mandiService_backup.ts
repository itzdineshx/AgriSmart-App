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
}

// Mock mandi location mapping (in real app, this would be from a database)
export const MANDI_LOCATIONS: MandiLocation[] = [
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
  
  // Tamil Nadu
  { name: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  
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

// Convert quintal price to per kg price
export const convertQuintalToKg = (quintalPrice: number): number => {
  return Number((quintalPrice / 100).toFixed(2));
};

// Transform API response to our format
// Transform API data to our MandiPrice format
export const transformMandiData = (apiData: any[]): MandiPrice[] => {
  return apiData.map(item => ({
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
  }));
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

// Fetch mandi price data from real-time API
export const fetchMandiPrices = async (
  filters: {
    commodity?: string;
    state?: string;
    district?: string;
    date?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ data: MandiPrice[]; total: number }> => {
  console.log('Fetching real-time mandi prices with filters:', filters);
  
  try {
    const params = new URLSearchParams({
      'api-key': API_KEY,
      format: 'json',
      limit: (filters.limit || 100).toString(),
      offset: (filters.offset || 0).toString(),
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
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API Response:', result);
    
    // Check if we got valid data
    if (result.status === 'error') {
      throw new Error(`API Error: ${result.message}`);
    }
    
    if (result.records && Array.isArray(result.records)) {
      console.log(`Successfully fetched ${result.records.length} real-time records`);
      return {
        data: transformMandiData(result.records),
        total: result.total || result.records.length,
      };
    } else {
      throw new Error('No records found in API response');
    }
  } catch (error) {
    console.error('Error fetching real-time mandi prices:', error);
    throw error; // Re-throw error instead of falling back to mock data
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
    {
      commodity: 'Tomato',
      variety: 'Local',
      min_price: 1600,
      max_price: 2350,
      modal_price: 1975,
      price_date: currentDate,
      market: 'Patiala Mandi',
      district: 'Patiala',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 16.00,
      max_price_per_kg: 23.50,
      modal_price_per_kg: 19.75,
    },
    {
      commodity: 'Onion',
      variety: 'Red',
      min_price: 1500,
      max_price: 2200,
      modal_price: 1850,
      price_date: currentDate,
      market: 'Amritsar Mandi',
      district: 'Amritsar',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 15.00,
      max_price_per_kg: 22.00,
      modal_price_per_kg: 18.50,
    },
    {
      commodity: 'Onion',
      variety: 'White',
      min_price: 1750,
      max_price: 2400,
      modal_price: 2075,
      price_date: currentDate,
      market: 'Jalandhar Mandi',
      district: 'Jalandhar',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 17.50,
      max_price_per_kg: 24.00,
      modal_price_per_kg: 20.75,
    },
    {
      commodity: 'Potato',
      variety: 'Jyoti',
      min_price: 1200,
      max_price: 1850,
      modal_price: 1525,
      price_date: currentDate,
      market: 'Bathinda Mandi',
      district: 'Bathinda',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 12.00,
      max_price_per_kg: 18.50,
      modal_price_per_kg: 15.25,
    },
    {
      commodity: 'Potato',
      variety: 'Kufri Pukhraj',
      min_price: 1350,
      max_price: 1900,
      modal_price: 1625,
      price_date: currentDate,
      market: 'Hisar Mandi',
      district: 'Hisar',
      state: 'Haryana',
      arrival_date: currentDate,
      min_price_per_kg: 13.50,
      max_price_per_kg: 19.00,
      modal_price_per_kg: 16.25,
    },
    {
      commodity: 'Cauliflower',
      variety: 'Snowball',
      min_price: 1400,
      max_price: 2150,
      modal_price: 1775,
      price_date: currentDate,
      market: 'Kapurthala Mandi',
      district: 'Kapurthala',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 14.00,
      max_price_per_kg: 21.50,
      modal_price_per_kg: 17.75,
    },
    {
      commodity: 'Cabbage',
      variety: 'Golden Acre',
      min_price: 850,
      max_price: 1375,
      modal_price: 1113,
      price_date: currentDate,
      market: 'Gurdaspur Vegetable Market',
      district: 'Gurdaspur',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 8.50,
      max_price_per_kg: 13.75,
      modal_price_per_kg: 11.13,
    },
    {
      commodity: 'Carrot',
      variety: 'Nantes',
      min_price: 1100,
      max_price: 1650,
      modal_price: 1375,
      price_date: currentDate,
      market: 'Ambala Vegetable Market',
      district: 'Ambala',
      state: 'Haryana',
      arrival_date: currentDate,
      min_price_per_kg: 11.00,
      max_price_per_kg: 16.50,
      modal_price_per_kg: 13.75,
    },
    
    // Grains
    {
      commodity: 'Wheat',
      variety: 'PBW-343',
      min_price: 2125,
      max_price: 2450,
      modal_price: 2288,
      price_date: currentDate,
      market: 'Ludhiana Grain Market',
      district: 'Ludhiana',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 21.25,
      max_price_per_kg: 24.50,
      modal_price_per_kg: 22.88,
    },
    {
      commodity: 'Wheat',
      variety: 'HD-2967',
      min_price: 2075,
      max_price: 2380,
      modal_price: 2228,
      price_date: currentDate,
      market: 'Karnal Grain Market',
      district: 'Karnal',
      state: 'Haryana',
      arrival_date: currentDate,
      min_price_per_kg: 20.75,
      max_price_per_kg: 23.80,
      modal_price_per_kg: 22.28,
    },
    {
      commodity: 'Rice',
      variety: 'Basmati 1121',
      min_price: 3500,
      max_price: 4250,
      modal_price: 3875,
      price_date: currentDate,
      market: 'Amritsar Rice Market',
      district: 'Amritsar',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 35.00,
      max_price_per_kg: 42.50,
      modal_price_per_kg: 38.75,
    },
    {
      commodity: 'Rice',
      variety: 'PR-126',
      min_price: 2850,
      max_price: 3400,
      modal_price: 3125,
      price_date: currentDate,
      market: 'Patiala Rice Market',
      district: 'Patiala',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 28.50,
      max_price_per_kg: 34.00,
      modal_price_per_kg: 31.25,
    },
    {
      commodity: 'Maize',
      variety: 'Hybrid',
      min_price: 1680,
      max_price: 2120,
      modal_price: 1900,
      price_date: currentDate,
      market: 'Hoshiarpur Mandi',
      district: 'Hoshiarpur',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 16.80,
      max_price_per_kg: 21.20,
      modal_price_per_kg: 19.00,
    },
    
    // Cash Crops
    {
      commodity: 'Mustard',
      variety: 'Laha-101',
      min_price: 4800,
      max_price: 5450,
      modal_price: 5125,
      price_date: currentDate,
      market: 'Faridkot Mandi',
      district: 'Faridkot',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 48.00,
      max_price_per_kg: 54.50,
      modal_price_per_kg: 51.25,
    },
    {
      commodity: 'Cotton',
      variety: 'Bt Cotton',
      min_price: 5500,
      max_price: 6250,
      modal_price: 5875,
      price_date: currentDate,
      market: 'Bathinda Cotton Market',
      district: 'Bathinda',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 55.00,
      max_price_per_kg: 62.50,
      modal_price_per_kg: 58.75,
    },
    {
      commodity: 'Sugarcane',
      variety: 'Co-238',
      min_price: 320,
      max_price: 385,
      modal_price: 353,
      price_date: currentDate,
      market: 'Jalandhar Sugar Mill',
      district: 'Jalandhar',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 3.20,
      max_price_per_kg: 3.85,
      modal_price_per_kg: 3.53,
    },
    
    // Fruits
    {
      commodity: 'Apple',
      variety: 'Royal Delicious',
      min_price: 8500,
      max_price: 12000,
      modal_price: 10250,
      price_date: currentDate,
      market: 'Shimla Fruit Market',
      district: 'Shimla',
      state: 'Himachal Pradesh',
      arrival_date: currentDate,
      min_price_per_kg: 85.00,
      max_price_per_kg: 120.00,
      modal_price_per_kg: 102.50,
    },
    {
      commodity: 'Banana',
      variety: 'Robusta',
      min_price: 2500,
      max_price: 3500,
      modal_price: 3000,
      price_date: currentDate,
      market: 'Moga Fruit Market',
      district: 'Moga',
      state: 'Punjab',
      arrival_date: currentDate,
      min_price_per_kg: 25.00,
      max_price_per_kg: 35.00,
      modal_price_per_kg: 30.00,
    },
    
    // Week old data for trend analysis
    {
      commodity: 'Tomato',
      variety: 'Hybrid',
      min_price: 2000,
      max_price: 2750,
      modal_price: 2425,
      price_date: lastWeek,
      market: 'Kurukshetra Mandi',
// Commodity categories for filtering
export const COMMODITY_CATEGORIES = {
  fruits: ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes', 'Pomegranate', 'Papaya', 'Watermelon', 'Guava'],
  vegetables: ['Tomato', 'Onion', 'Potato', 'Cabbage', 'Cauliflower', 'Carrot', 'Brinjal', 'Okra', 'Peas'],
  cereals: ['Wheat', 'Rice', 'Maize', 'Barley', 'Bajra', 'Jowar'],
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