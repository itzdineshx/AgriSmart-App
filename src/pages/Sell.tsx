import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Plus,
  Star, 
  MapPin, 
  Truck,
  Apple,
  Wheat,
  Zap,
  Minus,
  Heart,
  SortAsc,
  Package,
  Recycle,
  Leaf,
  TreePine,
  X,
  SlidersHorizontal,
  Edit,
  Trash2,
  Eye,
  DollarSign
} from "lucide-react";
import marketplaceImage from "@/assets/marketplace.jpg";

const categories = [
  { name: "All", icon: Package, count: 18 },
  { name: "Fruits", icon: Apple, count: 2 },
  { name: "Vegetables", icon: Wheat, count: 2 },
  { name: "Fertilizers", icon: Zap, count: 2 },
  { name: "Seeds", icon: Wheat, count: 2 },
  { name: "Equipment", icon: Package, count: 2 },
  { name: "Crop Residue", icon: Wheat, count: 2, category: "recycle" },
  { name: "Animal Waste", icon: TreePine, count: 2, category: "recycle" },
  { name: "Food Waste", icon: Apple, count: 2, category: "recycle" },
  { name: "Other Biomass", icon: Leaf, count: 2, category: "recycle" },
];

const myListings = [
  // Fruits
  {
    id: 1,
    name: "Premium Apples",
    category: "Fruits",
    price: 120,
    unit: "kg",
    rating: 4.8,
    seller: "My Farm",
    location: "Kashmir",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Fresh red apples from Kashmir valleys",
    discount: 10,
    views: 234,
    orders: 45,
  },
  {
    id: 2,
    name: "Alphonso Mangoes",
    category: "Fruits",
    price: 280,
    unit: "kg",
    rating: 4.9,
    seller: "My Farm",
    location: "Maharashtra",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "King of mangoes - Premium Alphonso variety",
    discount: 0,
    views: 567,
    orders: 89,
  },
  
  // Vegetables
  {
    id: 3,
    name: "Premium Tomatoes",
    category: "Vegetables",
    price: 45,
    unit: "kg",
    rating: 4.7,
    seller: "My Farm",
    location: "Punjab",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Vine-ripened organic tomatoes",
    discount: 0,
    views: 345,
    orders: 67,
  },
  {
    id: 4,
    name: "Organic Carrots",
    category: "Vegetables",
    price: 55,
    unit: "kg",
    rating: 4.6,
    seller: "My Farm",
    location: "Haryana",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Sweet and crunchy organic carrots",
    discount: 0,
    views: 198,
    orders: 34,
  },
  
  // Fertilizers
  {
    id: 5,
    name: "NPK Fertilizer 19:19:19",
    category: "Fertilizers",
    price: 850,
    unit: "50kg bag",
    rating: 4.6,
    seller: "My Farm",
    location: "Haryana",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "Balanced NPK fertilizer for all crops",
    discount: 8,
    views: 456,
    orders: 78,
  },
  {
    id: 6,
    name: "Organic Compost",
    category: "Fertilizers",
    price: 450,
    unit: "50kg bag",
    rating: 4.8,
    seller: "My Farm",
    location: "Karnataka",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Rich organic compost made from cow dung",
    discount: 12,
    views: 389,
    orders: 56,
  },
  
  // Seeds
  {
    id: 7,
    name: "Wheat Seeds (HD-3086)",
    category: "Seeds",
    price: 1200,
    unit: "quintal",
    rating: 4.9,
    seller: "My Farm",
    location: "Rajasthan",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "High yielding drought resistant wheat variety",
    discount: 5,
    views: 678,
    orders: 123,
  },
  {
    id: 8,
    name: "Tomato Seeds (Hybrid)",
    category: "Seeds",
    price: 450,
    unit: "100g packet",
    rating: 4.5,
    seller: "My Farm",
    location: "Karnataka",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "Disease resistant hybrid tomato seeds",
    discount: 10,
    views: 234,
    orders: 45,
  },
  
  // Equipment
  {
    id: 9,
    name: "Garden Hose 50ft",
    category: "Equipment",
    price: 1250,
    unit: "piece",
    rating: 4.4,
    seller: "My Farm",
    location: "Delhi",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "Heavy duty garden hose with spray nozzle",
    discount: 20,
    views: 156,
    orders: 23,
  },
  {
    id: 10,
    name: "Hand Pruning Shears",
    category: "Equipment",
    price: 350,
    unit: "piece",
    rating: 4.6,
    seller: "My Farm",
    location: "Punjab",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "Sharp steel pruning shears for garden use",
    discount: 0,
    views: 267,
    orders: 41,
  },
  
  // Recycle & Reuse - Crop Residue
  {
    id: 11,
    name: "Rice Straw Bales",
    category: "Crop Residue",
    price: 25,
    unit: "quintal",
    rating: 4.6,
    seller: "My Farm",
    location: "Punjab",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Clean rice straw bales perfect for biogas production",
    discount: 0,
    recyclable: true,
    views: 145,
    orders: 28,
  },
  {
    id: 12,
    name: "Wheat Stubble",
    category: "Crop Residue",
    price: 20,
    unit: "quintal",
    rating: 4.4,
    seller: "My Farm",
    location: "Haryana",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Fresh wheat stubble available for biogas companies",
    discount: 5,
    recyclable: true,
    views: 198,
    orders: 34,
  },
  
  // Animal Waste
  {
    id: 13,
    name: "Dairy Cow Manure",
    category: "Animal Waste",
    price: 15,
    unit: "quintal",
    rating: 4.8,
    seller: "My Farm",
    location: "Gujarat",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Fresh cow dung from 500+ dairy cows, high methane potential",
    discount: 0,
    recyclable: true,
    views: 289,
    orders: 52,
  },
  {
    id: 14,
    name: "Poultry Litter",
    category: "Animal Waste",
    price: 35,
    unit: "quintal",
    rating: 4.5,
    seller: "My Farm",
    location: "Andhra Pradesh",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Nitrogen-rich poultry waste for biogas and fertilizer",
    discount: 10,
    recyclable: true,
    views: 345,
    orders: 67,
  },
  
  // Food Waste
  {
    id: 15,
    name: "Vegetable Market Waste",
    category: "Food Waste",
    price: 10,
    unit: "quintal",
    rating: 4.3,
    seller: "My Farm",
    location: "Maharashtra",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Daily fresh vegetable waste from wholesale market",
    discount: 0,
    recyclable: true,
    views: 123,
    orders: 19,
  },
  {
    id: 16,
    name: "Fruit Processing Waste",
    category: "Food Waste",
    price: 12,
    unit: "quintal",
    rating: 4.6,
    seller: "My Farm",
    location: "Punjab",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Fruit peels and pulp waste from juice processing",
    discount: 15,
    recyclable: true,
    views: 234,
    orders: 45,
  },
  
  // Other Biomass
  {
    id: 17,
    name: "Water Hyacinth",
    category: "Other Biomass",
    price: 8,
    unit: "quintal",
    rating: 4.4,
    seller: "My Farm",
    location: "Kerala",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Harvested water hyacinth for biogas production",
    discount: 0,
    recyclable: true,
    views: 167,
    orders: 31,
  },
  {
    id: 18,
    name: "Sugarcane Bagasse",
    category: "Other Biomass",
    price: 18,
    unit: "quintal",
    rating: 4.7,
    seller: "My Farm",
    location: "Uttar Pradesh",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "High energy bagasse waste from sugar processing",
    discount: 0,
    recyclable: true,
    views: 456,
    orders: 78,
  },
];

export default function Sell() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("name");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = myListings
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "views":
          return b.views - a.views;
        case "orders":
          return b.orders - a.orders;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getTotalRevenue = () => {
    return myListings.reduce((total, product) => {
      const price = product.price * (1 - product.discount / 100);
      return total + (price * product.orders);
    }, 0);
  };

  const getTotalOrders = () => {
    return myListings.reduce((sum, product) => sum + product.orders, 0);
  };

  const getTotalViews = () => {
    return myListings.reduce((sum, product) => sum + product.views, 0);
  };

  const handleEditListing = (productId: number) => {
    console.log("Edit listing:", productId);
    // TODO: Implement edit functionality
  };

  const handleDeleteListing = (productId: number) => {
    console.log("Delete listing:", productId);
    // TODO: Implement delete functionality
  };

  const handleToggleStock = (productId: number) => {
    console.log("Toggle stock:", productId);
    // TODO: Implement stock toggle functionality
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-secondary text-secondary-foreground p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sell to Marketplace</h1>
          <p className="text-secondary-foreground/90">List your produce, fertilizers, seeds & farming equipment for sale</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-elegant">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                  <p className="text-2xl font-bold">{myListings.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{getTotalRevenue().toFixed(0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{getTotalOrders()}</p>
                </div>
                <Truck className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{getTotalViews()}</p>
                </div>
                <Eye className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Desktop Sort Dropdown */}
              <div className="hidden md:block">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="orders">Most Orders</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filter Button */}
              <div className="md:hidden">
                <Button
                  variant="outline"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="w-full"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters & Sort
                  {(selectedCategory || sortBy !== "name") && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {(selectedCategory ? 1 : 0) + (sortBy !== "name" ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Add New Listing Button */}
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-background shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Filters & Sort</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Sort Options */}
                  <div>
                    <h3 className="font-medium mb-3">Sort By</h3>
                    <div className="space-y-2">
                      {[
                        { value: "name", label: "Name (A-Z)" },
                        { value: "price-low", label: "Price: Low to High" },
                        { value: "price-high", label: "Price: High to Low" },
                        { value: "rating", label: "Highest Rated" },
                        { value: "views", label: "Most Viewed" },
                        { value: "orders", label: "Most Orders" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            sortBy === option.value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          !selectedCategory
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5" />
                          <div>
                            <div className="font-medium">All Categories</div>
                            <div className="text-sm text-muted-foreground">18 items</div>
                          </div>
                        </div>
                      </button>

                      {categories.slice(1, 7).map((category) => (
                        <button
                          key={category.name}
                          onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedCategory === category.name
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <category.icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-muted-foreground">{category.count} items</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recycle & Reuse */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Recycle className="h-4 w-4 text-success" />
                      Recycle & Reuse
                    </h3>
                    <div className="space-y-2">
                      {categories.slice(7).map((category) => (
                        <button
                          key={category.name}
                          onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedCategory === category.name
                              ? "border-success bg-success/5 text-success"
                              : "border-border hover:border-success/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <category.icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-muted-foreground">{category.count} items</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-3">
                  <Button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSortBy("name");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                  <Button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories - Hidden on Mobile */}
        <div className="hidden md:block space-y-6">
          {/* Regular Marketplace */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Marketplace Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.slice(0, 6).map((category) => (
                <Card
                  key={category.name}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-primary ${
                    selectedCategory === category.name
                      ? "border-primary shadow-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.name ? null : category.name
                    )
                  }
                >
                  <CardContent className="p-4 text-center">
                    <category.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} items</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recycle & Reuse Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Recycle className="h-6 w-6 text-success" />
              <h3 className="text-lg font-semibold">Recycle & Reuse ♻️</h3>
            </div>
            <div className="bg-success/5 border border-success/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                Sell your agricultural waste for biogas production! List your biodegradable waste, 
                and biogas companies can purchase materials for sustainable energy production.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(6).map((category) => (
                <Card
                  key={category.name}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-success border-success/20 ${
                    selectedCategory === category.name
                      ? "border-success shadow-success bg-success/5"
                      : "hover:border-success/50"
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.name ? null : category.name
                    )
                  }
                >
                  <CardContent className="p-4 text-center">
                    <category.icon className="h-8 w-8 mx-auto mb-2 text-success" />
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} items</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Category Selector */}
        <div className="md:hidden">
          <Card className="shadow-elegant">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {selectedCategory || "All Categories"}
                  </span>
                  {selectedCategory && (
                    <Badge variant="secondary" className="text-xs">
                      {categories.find(c => c.name === selectedCategory)?.count} items
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {selectedCategory ? `My ${selectedCategory} Listings` : "My Listings"}
            </h2>
            <p className="text-muted-foreground">{filteredProducts.length} listings found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-elegant hover:shadow-glow transition-all duration-300">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.organic && (
                    <Badge className="absolute top-2 left-2 bg-success text-success-foreground">
                      Organic
                    </Badge>
                  )}
                  {product.recyclable && (
                    <Badge className="absolute top-2 right-2 bg-success/10 text-success border border-success/30">
                      <Recycle className="h-3 w-3 mr-1" />
                      Recyclable
                    </Badge>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                  {/* Product Info */}
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-muted-foreground text-sm">{product.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                  </div>

                  {/* Price & Stats */}
                  <div className="flex justify-between items-center">
                    <div>
                      {product.discount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg line-through text-muted-foreground">₹{product.price}</span>
                          <Badge variant="destructive" className="text-xs">-{product.discount}%</Badge>
                        </div>
                      )}
                      <span className="text-2xl font-bold text-primary">
                        ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/{product.unit}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>{product.views} views</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Truck className="h-3 w-3" />
                      <span>{product.orders} orders</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{product.location}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditListing(product.id)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={product.inStock ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleStock(product.id)}
                      className="flex-1"
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteListing(product.id)}
                      className="p-2"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
