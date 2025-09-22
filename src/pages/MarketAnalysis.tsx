import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Database,
  AlertCircle,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Settings,
  Target,
  Globe,
  Wifi,
  WifiOff,
  X,
  Clock,
  AlertTriangle,
  Table as TableIcon,
  BarChart3
} from 'lucide-react';
import { 
  fetchMandiPrices, 
  MandiPrice, 
  findNearestMandis,
  MANDI_LOCATIONS,
  FilterOptions,
  isChennaiAreaUser,
  getChennaiMarketAlternatives
} from '@/services/mandiService';
import { 
  getPreferredLocation, 
  UserLocation,
  getStateFromLocation 
} from '@/services/locationService';
import MandiFilters from '@/components/market/MandiFilters';
import MandiTable from '@/components/market/MandiTable';
import MandiVisualizations from '@/components/market/MandiVisualizations';
import { EnhancedLoading } from '@/components/common/EnhancedLoading';
import { format, isToday, parseISO } from 'date-fns';

export default function MarketAnalysis() {
  const [data, setData] = useState<MandiPrice[]>([]);
  const [filteredData, setFilteredData] = useState<MandiPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearestMandis, setNearestMandis] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({ onlyRecentData: true });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get user location on mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        setLoadingStage('Detecting your location...');
        const { location } = await getPreferredLocation();
        setUserLocation(location);
        
        // Find nearest mandis
        setLoadingStage('Finding nearby markets...');
        const nearest = findNearestMandis(location.lat, location.lng, 5);
        setNearestMandis(nearest);
        
        // Set default filters based on location
        const userState = getStateFromLocation(location);
        setFilters(prev => ({ ...prev, state: userState }));
      } catch (error) {
        console.warn('Failed to get user location:', error);
        setLoadingStage('Using default location...');
      }
    };

    getUserLocation();
  }, []);

  // Fetch data function with Chennai prioritization
  const fetchData = useCallback(async (showLoading = true) => {
    if (!isOnline) {
      setError('No internet connection. Using cached data.');
      return;
    }

    if (showLoading) {
      setIsLoading(true);
      setShowSidePanel(false); // Close side panel during loading
      setLoadingStage('Connecting to market data API...');
    }
    setError(null);

    try {
      setLoadingStage('Fetching latest market prices...');
      console.log('Fetching data with filters:', {
        commodity: filters.commodity,
        state: filters.state,
        district: filters.district,
        date: filters.dateFrom?.toISOString().split('T')[0],
        limit: 500,
        onlyRecentData: filters.onlyRecentData,
        prioritizeChennai: true,
        userLocation: userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined,
        searchTerm: filters.search,
      });
      
      const result = await fetchMandiPrices({
        commodity: filters.commodity,
        state: filters.state,
        district: filters.district,
        date: filters.dateFrom?.toISOString().split('T')[0],
        limit: 500,
        onlyRecentData: filters.onlyRecentData,
        prioritizeChennai: true,
        userLocation: userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined,
        searchTerm: filters.search,
      });

      setLoadingStage('Processing market data...');
      console.log('Received data from API:', result.data.length, 'records');
      if (result.data.length > 0) {
        console.log('First record from API:', result.data[0]);
      }
      
      setData(result.data);
      setLastUpdated(new Date());
      setLoadingStage('');
    } catch (err) {
      console.error('Failed to fetch mandi data:', err);
      setError('Failed to fetch latest data. Showing cached data.');
      setLoadingStage('');
    } finally {
      setIsLoading(false);
    }
  }, [filters, isOnline, userLocation]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh && isOnline) {
      const interval = setInterval(() => {
        fetchData(false);
      }, 5 * 60 * 1000); // 5 minutes

      setRefreshInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, isOnline, fetchData]);

  // Apply filters to data
  useEffect(() => {
    let filtered = [...data];
    console.log('Applying filters to data - starting with', data.length, 'records');

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.commodity.toLowerCase().includes(search) ||
        item.market.toLowerCase().includes(search) ||
        (item.state || '').toLowerCase().includes(search) ||
        (item.district || '').toLowerCase().includes(search)
      );
    }

    // Commodity category filter
    if (filters.commodityCategory) {
      const { COMMODITY_CATEGORIES, getCommodityCategory } = require('@/services/mandiService');
      filtered = filtered.filter(item =>
        getCommodityCategory(item.commodity) === filters.commodityCategory
      );
    }

    // Specific commodity filter
    if (filters.commodity) {
      filtered = filtered.filter(item => item.commodity === filters.commodity);
    }

    // Location filters
    if (filters.state) {
      filtered = filtered.filter(item => item.state === filters.state);
    }
    if (filters.district) {
      filtered = filtered.filter(item => item.district === filters.district);
    }
    if (filters.market) {
      filtered = filtered.filter(item => item.market === filters.market);
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.price_date) >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(item => 
        new Date(item.price_date) <= filters.dateTo!
      );
    }

    // Price range filters
    if (filters.priceMin) {
      filtered = filtered.filter(item => item.modal_price_per_kg >= filters.priceMin!);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(item => item.modal_price_per_kg <= filters.priceMax!);
    }

    // Sort data
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'commodity':
            return a.commodity.localeCompare(b.commodity);
          case 'price_asc':
            return a.modal_price_per_kg - b.modal_price_per_kg;
          case 'price_desc':
            return b.modal_price_per_kg - a.modal_price_per_kg;
          case 'date':
            return new Date(b.price_date).getTime() - new Date(a.price_date).getTime();
          case 'market':
            return a.market.localeCompare(b.market);
          default:
            return 0;
        }
      });
    }

    console.log('After applying filters - filtered to', filtered.length, 'records');
    if (filtered.length > 0) {
      console.log('Sample record:', filtered[0]);
    }

    setFilteredData(filtered);
  }, [data, filters]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Get nearest mandi summary
  const getNearestMandiSummary = () => {
    if (!userLocation || !filters.commodity) return null;

    const nearestMandiData = filteredData.filter(item =>
      nearestMandis.some(mandi => 
        item.market.toLowerCase().includes(mandi.name.toLowerCase()) ||
        mandi.name.toLowerCase().includes(item.market.toLowerCase())
      )
    );

    if (nearestMandiData.length === 0) return null;

    const avgPrice = nearestMandiData.reduce((sum, item) => sum + item.modal_price_per_kg, 0) / nearestMandiData.length;
    const bestPrice = Math.min(...nearestMandiData.map(item => item.modal_price_per_kg));
    const bestMarket = nearestMandiData.find(item => item.modal_price_per_kg === bestPrice);

    return {
      avgPrice,
      bestPrice,
      bestMarket,
      totalMarkets: nearestMandiData.length,
    };
  };

  const nearestSummary = getNearestMandiSummary();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 relative">
      {/* Enhanced Loading Overlay */}
      {isLoading && <EnhancedLoading />}

      {/* Side Panel Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSidePanel(!showSidePanel)}
        className="fixed top-4 right-4 z-40 bg-background/95 backdrop-blur-md border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        disabled={isLoading}
      >
        {showSidePanel ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
        <span className="ml-2 hidden sm:inline">
          {showSidePanel ? 'Close' : 'Filters'}
        </span>
      </Button>

      {/* Collapsible Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 lg:w-96 bg-background/98 backdrop-blur-xl border-l border-border shadow-2xl z-30 transform transition-transform duration-500 ease-in-out ${
        showSidePanel ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between mb-6 pt-12">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Market Filters
            </h2>
          </div>
          
          <MandiFilters
            data={data}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
            className="border-0 shadow-none bg-transparent"
          />
        </div>
      </div>

      {/* Main Content with overlay when panel is open */}
      <div className={`transition-all duration-500 ${showSidePanel ? 'mr-80 lg:mr-96' : ''}`}>
        {/* Overlay when side panel is open */}
        {showSidePanel && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setShowSidePanel(false)}
          />
        )}
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-primary text-primary-foreground p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  Market Analysis
                </h1>
                <p className="text-primary-foreground/90 text-sm md:text-base">
                  Real-time mandi prices from across India
                </p>
                {userLocation && (
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs md:text-sm">
                      {userLocation.city || userLocation.state || 'Your Location'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Mobile-friendly controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-green-400" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-400" />
                  )}
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                
                {lastUpdated && (
                  <div className="flex items-center gap-1 text-xs md:text-sm text-primary-foreground/70">
                    <Clock className="h-4 w-4" />
                    <span className="truncate">
                      Updated {format(lastUpdated, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                )}
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} mr-2 sm:mr-0`} />
                  <span className="sm:hidden">Refresh</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Enhanced Chennai Markets Notice */}
        {(filters.state === 'Tamil Nadu' && 
          (filters.district === 'Chennai' || filters.search?.toLowerCase().includes('chennai'))) && (
          <Alert className="border-blue-200 bg-blue-50">
            <MapPin className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="space-y-2">
                <div>
                  <strong>Chennai Markets Notice:</strong> Koyambedu and other Chennai metropolitan markets are not available in the government API.
                </div>
                <div className="text-sm">
                  <strong>Nearby alternatives shown:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><strong>Chengalpattu Uzhavar Sandhai</strong> - 45km from Chennai (government registered)</li>
                    <li><strong>Guduvancheri Uzhavar Sandhai</strong> - 30km from Chennai (suburban market)</li>
                    <li><strong>Kundrathur Uzhavar Sandhai</strong> - 25km from Chennai (closest option)</li>
                  </ul>
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  <strong>For Koyambedu wholesale prices:</strong> Contact local traders, check market bulletins, or visit the market directly.
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* No Recent Data Warning */}
        {filters.onlyRecentData !== false && filteredData.length === 0 && data.length > 0 && !isLoading && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No data found from the last 2 days. The API contains historical data only. 
              Turn off "Show only last 2 days data" to see all available data, or check back when fresh data is available.
            </AlertDescription>
          </Alert>
        )}

        {/* Nearest Mandi Summary - Mobile Optimized */}
        {nearestSummary && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base md:text-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Nearest Markets</span>
                </div>
                <Badge variant="secondary" className="w-fit">{filters.commodity}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-xs md:text-sm text-muted-foreground">Average Price</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">
                    ₹{nearestSummary.avgPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs md:text-sm text-muted-foreground">Best Price</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">
                    ₹{nearestSummary.bestPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-center sm:text-left col-span-2 lg:col-span-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Best Market</p>
                  <p className="font-semibold text-sm md:text-base truncate">
                    {nearestSummary.bestMarket?.market}
                  </p>
                </div>
                <div className="text-center sm:text-left col-span-2 lg:col-span-1">
                  <p className="text-xs md:text-sm text-muted-foreground">Available Markets</p>
                  <p className="text-lg md:text-2xl font-bold">
                    {nearestSummary.totalMarkets}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setShowSidePanel(true)}
            className="w-full justify-center gap-2"
            disabled={isLoading}
          >
            <Filter className="h-4 w-4" />
            Open Filters Panel
          </Button>
        </div>

        {/* Desktop Filters (always visible on large screens) */}
        <div className="hidden lg:block">
          <MandiFilters
            data={data}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
          />
        </div>

        {/* Main Content - Data Table and Charts */}
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Market Table</span>
              <span className="sm:hidden">Table</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Visualizations</span>
              <span className="sm:hidden">Charts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <MandiTable
              data={filteredData}
              isLoading={isLoading}
              className="overflow-hidden"
            />
            
            {/* Chennai Market Recommendations when data is limited */}
            {filteredData.length < 10 && filters.state === 'Tamil Nadu' && !isLoading && (
              <Card className="mt-4 border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-amber-800 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Chennai Area Market Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-amber-700 text-sm">
                      Limited data available? Chennai users can access these priority markets:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border">
                        <h4 className="font-medium text-amber-800">🥬 Koyambedu Market Complex</h4>
                        <p className="text-xs text-amber-600 mt-1">Asia's largest perishable goods market</p>
                        <p className="text-xs">Contact: Local traders • Live prices via market bulletins</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <h4 className="font-medium text-amber-800">🌾 Chengalpattu Uzhavar Sandhai</h4>
                        <p className="text-xs text-amber-600 mt-1">Government registered • 45km from Chennai</p>
                        <p className="text-xs">Available in this system • Real-time pricing</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setFilters({ state: 'Tamil Nadu', district: 'Chengalpattu' });
                      }}
                      className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      View Chengalpattu Markets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="charts" className="mt-4">
            <MandiVisualizations
              data={filteredData}
              isLoading={isLoading}
              selectedCommodity={filters.commodity}
              className="overflow-hidden"
            />
          </TabsContent>
        </Tabs>

        {/* Auto-refresh Controls - Mobile Optimized */}
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auto-refresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="auto-refresh" className="text-xs md:text-sm font-medium">
                    Auto-refresh every 5 minutes
                  </label>
                </div>
                
                {isToday(lastUpdated || new Date()) && (
                  <Badge variant="outline" className="text-green-600 w-fit">
                    Data is current
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <span className="text-center sm:text-left">
                  Total: {data.length} | Filtered: {filteredData.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}