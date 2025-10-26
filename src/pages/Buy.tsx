import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  MapPin,
  Truck,
  Apple,
  Wheat,
  Zap,
  Minus,
  Plus,
  Heart,
  SortAsc,
  Package,
  Recycle,
  Leaf,
  TreePine,
  X,
  SlidersHorizontal
} from "lucide-react";
import marketplaceImage from "@/assets/marketplace.jpg";
import { ProductCard } from "@/components/marketplace/ProductCard";

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

const products = [
  // Fruits
  {
    id: "1",
    name: "Premium Apples",
    category: "Fruits",
    price: 120,
    unit: "kg",
    rating: 4.8,
    seller: "Namma Chennai Farms",
    location: "Multiple locations around Chennai",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Fresh red apples from Chennai region farms",
    discount: 10,
    stock: 100,
  },
  {
    id: "2",
    name: "Alphonso Mangoes",
    category: "Fruits",
    price: 280,
    unit: "kg",
    rating: 4.9,
    seller: "Kokilammal Mango Farms",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "King of mangoes - Premium Alphonso variety from Chennai farms",
    discount: 0,
    stock: 50,
  },

  // Vegetables
  {
    id: "3",
    name: "Premium Tomatoes",
    category: "Vegetables",
    price: 45,
    unit: "kg",
    rating: 4.7,
    seller: "Sunantha Organic Farms",
    location: "Melkothakuppam Village, Ambur (Retail: Ramapuram, Chennai)",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Vine-ripened organic tomatoes from certified chemical-free farms",
    discount: 0,
    stock: 200,
  },
  {
    id: "4",
    name: "Organic Carrots",
    category: "Vegetables",
    price: 55,
    unit: "kg",
    rating: 4.6,
    seller: "GetFarms",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Sweet and crunchy organic carrots from Chennai farms",
    discount: 0,
    stock: 150,
  },
  
  // Fertilizers
  {
    id: "5",
    name: "NPK Fertilizer 19:19:19",
    category: "fertilizers",
    price: 850,
    unit: "50kg bag",
    rating: 4.6,
    seller: "AgriCorp Chennai",
    location: "Chennai",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "Balanced NPK fertilizer for all crops - Chennai distribution",
    discount: 8,
    stock: 75,
  },
  {
    id: "6",
    name: "Organic Compost",
    category: "fertilizers",
    price: 450,
    unit: "50kg bag",
    rating: 4.8,
    seller: "Green Chennai Farms",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Rich organic compost made from cow dung - Chennai certified",
    discount: 12,
    stock: 60,
  },
  
  // Seeds
  {
    id: "7",
    name: "Wheat Seeds (HD-3086)",
    category: "seeds",
    price: 1200,
    unit: "quintal",
    rating: 4.9,
    seller: "Chennai Seed Hub",
    location: "Chennai",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "High yielding drought resistant wheat variety - Chennai distribution",
    discount: 5,
    stock: 25,
  },
  {
    id: "8",
    name: "Tomato Seeds (Hybrid)",
    category: "seeds",
    price: 450,
    unit: "100g packet",
    rating: 4.5,
    seller: "Tamil Nadu Seeds",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "Disease resistant hybrid tomato seeds - Tamil Nadu variety",
    discount: 10,
    stock: 200,
  },
  
  // Equipment
  {
    id: "9",
    name: "Garden Hose 50ft",
    category: "equipment",
    price: 1250,
    unit: "piece",
    rating: 4.4,
    seller: "Chennai AgriTools",
    location: "Chennai",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "Heavy duty garden hose with spray nozzle - Chennai delivery",
    discount: 20,
    stock: 30,
  },
  {
    id: "10",
    name: "Hand Pruning Shears",
    category: "equipment",
    price: 350,
    unit: "piece",
    rating: 4.6,
    seller: "Chennai Garden Tools",
    location: "Chennai",
    image: marketplaceImage,
    inStock: true,
    organic: false,
    description: "Sharp steel pruning shears for garden use - Chennai supplier",
    discount: 0,
    stock: 45,
  },
  
  // Recycle & Reuse - Crop Residue
  {
    id: "11",
    name: "Rice Straw Bales",
    category: "Crop Residue",
    price: 25,
    unit: "quintal",
    rating: 4.6,
    seller: "Chennai Rice Mills",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Clean rice straw bales perfect for biogas production - Chennai farms",
    discount: 0,
    recyclable: true,
    stock: 500,
  },
  {
    id: "12",
    name: "Wheat Stubble",
    category: "Crop Residue",
    price: 20,
    unit: "quintal",
    rating: 4.4,
    seller: "Tamil Nadu Agri Co-op",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Fresh wheat stubble available for biogas companies - Chennai region",
    discount: 5,
    recyclable: true,
    stock: 300,
  },
  
  // Animal Waste
  {
    id: "13",
    name: "Dairy Cow Manure",
    category: "Animal Waste",
    price: 15,
    unit: "quintal",
    rating: 4.8,
    seller: "Chennai Dairy Farms",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Fresh cow dung from Chennai dairy farms, high methane potential",
    discount: 0,
    recyclable: true,
    stock: 800,
  },
  {
    id: "14",
    name: "Poultry Litter",
    category: "Animal Waste",
    price: 35,
    unit: "quintal",
    rating: 4.5,
    seller: "Tamil Nadu Poultry",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Nitrogen-rich poultry waste for biogas and fertilizer - Chennai farms",
    discount: 10,
    recyclable: true,
    stock: 400,
  },
  
  // Food Waste
  {
    id: "15",
    name: "Vegetable Market Waste",
    category: "Food Waste",
    price: 10,
    unit: "quintal",
    rating: 4.3,
    seller: "Chennai Veg Market",
    location: "Chennai wholesale markets",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Daily fresh vegetable waste from Chennai wholesale markets",
    discount: 0,
    recyclable: true,
    stock: 1000,
  },
  {
    id: "16",
    name: "Fruit Processing Waste",
    category: "Food Waste",
    price: 12,
    unit: "quintal",
    rating: 4.6,
    seller: "Chennai Fruit Processors",
    location: "Chennai",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Fruit peels and pulp waste from juice processing - Chennai facilities",
    discount: 15,
    recyclable: true,
    stock: 600,
  },
  
  // Other Biomass
  {
    id: "17",
    name: "Water Hyacinth",
    category: "Other Biomass",
    price: 8,
    unit: "quintal",
    rating: 4.4,
    seller: "Chennai Water Management",
    location: "Chennai waterways",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Harvested water hyacinth for biogas production - Chennai region",
    discount: 0,
    recyclable: true,
    stock: 200,
  },
  {
    id: "18",
    name: "Sugarcane Bagasse",
    category: "Other Biomass",
    price: 18,
    unit: "quintal",
    rating: 4.7,
    seller: "Tamil Nadu Sugar Mills",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "High energy bagasse waste from sugar processing - Chennai mills",
    discount: 0,
    recyclable: true,
    stock: 350,
  },

  // ⭐ FEATURED PRODUCT: Complete Payment & Blockchain Integration Demo
  {
    id: "19",
    name: "Premium Organic Tomatoes - Blockchain Verified",
    category: "Vegetables",
    price: 500,
    unit: "kg",
    rating: 4.9,
    seller: "Chennai Organic Farms (Verified)",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: true,
    organic: true,
    description: "Fresh organic tomatoes with complete payment protection, escrow security, and blockchain transparency. Experience the future of agricultural trading.",
    discount: 10,
    stock: 100,
    // Enhanced payment and blockchain features
    paymentFeatures: {
      razorpayEnabled: true,
      escrowProtection: true,
      blockchainRecording: true,
      fraudDetection: true,
      autoRelease: true,
      disputeResolution: true
    },
    blockchainInfo: {
      transactionCount: 1247,
      lastTransactionHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      network: "Ethereum Mainnet",
      verificationStatus: "verified"
    },
    securityFeatures: {
      buyerProtection: true,
      sellerVerification: true,
      paymentGuarantee: true,
      transparentPricing: true
    },
    analytics: {
      totalSales: 2847,
      successRate: 98.5,
      averageRating: 4.8,
      customerSatisfaction: 96.2
    }
  },
];

export default function Buy() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("name");
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = products
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
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = (productId: number) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      const price = product ? product.price * (1 - product.discount / 100) : 0;
      return total + (price * quantity);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-secondary text-secondary-foreground p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-secondary-foreground/90">Buy fresh produce, fertilizers, seeds & farming equipment</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Search & Filters */}
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for crops, fertilizers, seeds, equipment..."
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

              {/* Cart Summary */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingCart className="h-4 w-4" />
                <span>{getTotalCartItems()} items • ₹{getCartTotal().toFixed(2)}</span>
              </div>
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
                        { value: "rating", label: "Highest Rated" }
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
            <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
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
                Transform agricultural waste into biogas! Farmers can list their biodegradable waste, 
                and biogas companies can source materials for sustainable energy production.
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
              {selectedCategory ? `${selectedCategory}` : "All Products"}
            </h2>
            <p className="text-muted-foreground">{filteredProducts.length} products found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}