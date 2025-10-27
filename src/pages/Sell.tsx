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
  DollarSign,
  Factory,
  Sprout,
  Store,
  TrendingUp,
  ShoppingCart
} from "lucide-react";
import marketplaceImage from "@/assets/marketplace.jpg";
import { Product } from "@/types/marketplace";

const categories = [
  { name: "All", icon: Package, count: 4 },
  { name: "Vegetables", icon: Wheat, count: 1 },
  { name: "Fruits", icon: Apple, count: 1 },
  { name: "Seeds", icon: Sprout, count: 1 },
  { name: "Crops", icon: TreePine, count: 1 }
];

const myListings: Product[] = [
  // Chennai Vegetable Buyers Demand
  {
    id: "1",
    name: "Chennai Vegetable Market Demand",
    category: "Vegetables",
    price: 0, // Market-driven pricing
    unit: "kg",
    rating: 4.8,
    seller: "Chennai Wholesale Buyers",
    location: "Koyambedu Market, Chennai",
    image: marketplaceImage,
    inStock: false, // This represents buyer demand, not supply
    organic: false,
    description: "High demand for: Drumstick, Yam, Snake Gourd, Bottle Gourd, Capsicum, Corns, Cucumber, Ridge Gourd, Broccoli, Red Cabbage, Onion, Potato, Bangalore Morris, Carrot, Beet Root, Knol-Khol, Chow Chow. Buyers: PANDIA TRADER (044-24798444), S.RAM MOHAN (044-24796555), K.R.ILLAYARAJA (9962997023)",
    discount: 0,
    stock: 0, // Represents buyer demand, not actual stock
  },

  // Chennai Fruit Buyers Demand
  {
    id: "2",
    name: "Chennai Fruit Market Demand",
    category: "Fruits",
    price: 0, // Market-driven pricing
    unit: "kg",
    rating: 4.9,
    seller: "Chennai Retail Chains",
    location: "Multiple locations, Chennai",
    image: marketplaceImage,
    inStock: false, // This represents buyer demand, not supply
    organic: false,
    description: "Strong demand from major chains: Reliance Fresh (50+ stores), Spencer's Retail (15+ stores), D-Mart (8+ stores), Metro Wholesale. High volume purchases of fresh fruits, premium varieties. Hotels like Taj Coromandel and ITC Grand Central require premium quality produce.",
    discount: 0,
    stock: 0, // Represents buyer demand, not actual stock
  },

  // Chennai Seed Buyers Demand
  {
    id: "3",
    name: "Chennai Seed Market Demand",
    category: "seeds",
    price: 0, // Market-driven pricing
    unit: "kg",
    rating: 4.7,
    seller: "Chennai Agricultural Buyers",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: false, // This represents buyer demand, not supply
    organic: false,
    description: "Growing demand for quality seeds from Chennai farmers and cooperatives. Focus on high-yielding varieties suitable for Tamil Nadu climate. Buyers include agricultural cooperatives and individual farmers looking for certified, disease-resistant seeds.",
    discount: 0,
    stock: 0, // Represents buyer demand, not actual stock
  },

  // Chennai Crop Buyers Demand
  {
    id: "4",
    name: "Chennai Crop Market Demand",
    category: "Crop Residue",
    price: 0, // Market-driven pricing
    unit: "quintal",
    rating: 4.6,
    seller: "Chennai Biogas Companies",
    location: "Chennai region",
    image: marketplaceImage,
    inStock: false, // This represents buyer demand, not supply
    organic: false,
    description: "Demand for crop residues from biogas companies and organic fertilizer producers. Rice straw, wheat stubble, and other agricultural waste needed for sustainable energy production. Buyers include biogas plants and organic compost manufacturers across Chennai.",
    discount: 0,
    stock: 0, // Represents buyer demand, not actual stock
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
          return (b.rating || 0) - (a.rating || 0);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getTotalRevenue = () => {
    return myListings.reduce((total, product) => {
      const price = product.price * (1 - product.discount / 100);
      return total + price; // Simplified calculation since orders property doesn't exist
    }, 0);
  };

  const getTotalOrders = () => {
    return myListings.length; // Return total number of listings as a proxy for orders
  };

  const getTotalViews = () => {
    return myListings.length * 100; // Return estimated views based on number of listings
  };

  const handleEditListing = (productId: string) => {
    console.log("Edit listing:", productId);
    // TODO: Implement edit functionality
  };

  const handleDeleteListing = (productId: string) => {
    console.log("Delete listing:", productId);
    // TODO: Implement delete functionality
  };

  const handleToggleStock = (productId: string) => {
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

        {/* Chennai Buyer Demand Section */}
        <div className="space-y-6 mt-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">📊 Chennai Buyer Demand</h2>
            <p className="text-gray-600">Discover what Chennai's wholesale buyers and retail chains are looking for in agricultural products</p>
          </div>

          {/* Buyer Demand Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vegetables Demand */}
            <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">🥕 Vegetables</CardTitle>
                  <Badge className="bg-primary">High Demand</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Koyambedu Traders</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-primary">Top Requested:</div>
                  <div className="space-y-1 text-sm">
                    <div>• Drumstick (2-3ft length)</div>
                    <div>• Yam (fresh tubers)</div>
                    <div>• Snake gourd (long variety)</div>
                    <div>• Bitter gourd (medium size)</div>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span>Daily Volume:</span>
                    <span className="font-medium">50-100 tons</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price Range:</span>
                    <span className="font-medium">₹20-80/kg</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Fresh vegetables needed by wholesale traders and retail chains across Chennai.
                  </p>
                  <Button className="w-full" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    List Your Produce
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fruits Demand */}
            <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 border-success/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">🍎 Fruits</CardTitle>
                  <Badge className="bg-success">Premium</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Store className="h-4 w-4" />
                  <span>Retail Chains</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-success">Major Buyers:</div>
                  <div className="space-y-1 text-sm">
                    <div>• Reliance Fresh</div>
                    <div>• Nilgiris Supermarket</div>
                    <div>• Heritage Foods</div>
                    <div>• Local Fruit Vendors</div>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span>Daily Volume:</span>
                    <span className="font-medium">30-80 tons</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quality:</span>
                    <span className="font-medium">Grade A</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Fresh seasonal fruits required by major retail chains and supermarkets.
                  </p>
                  <Button className="w-full" size="sm" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    View Requirements
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seeds Demand */}
            <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 border-warning/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">🌱 Seeds</CardTitle>
                  <Badge className="bg-warning">Quality Focus</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sprout className="h-4 w-4" />
                  <span>TN Climate Adapted</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-warning">Seed Varieties:</div>
                  <div className="space-y-1 text-sm">
                    <div>• Paddy seeds (CO-43, ADT-43)</div>
                    <div>• Groundnut seeds (TMV-2)</div>
                    <div>• Cotton seeds (MCU-5)</div>
                    <div>• Vegetable seeds (hybrid)</div>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span>Certification:</span>
                    <span className="font-medium">Required</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Germination:</span>
                    <span className="font-medium">95%+</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Certified, high-germination seeds adapted for Tamil Nadu climate conditions.
                  </p>
                  <Button className="w-full" size="sm" variant="outline">
                    <Sprout className="h-4 w-4 mr-2" />
                    List Seed Stock
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Crops Demand */}
            <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 border-info/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">🌾 Crops</CardTitle>
                  <Badge className="bg-info">Industrial</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Factory className="h-4 w-4" />
                  <span>Processing Companies</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-info">Industrial Crops:</div>
                  <div className="space-y-1 text-sm">
                    <div>• Sugarcane (for jaggery)</div>
                    <div>• Maize (animal feed)</div>
                    <div>• Cotton (ginning)</div>
                    <div>• Rice (milling)</div>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span>Volume:</span>
                    <span className="font-medium">Bulk orders</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing:</span>
                    <span className="font-medium">Ready</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Industrial crops needed by processing companies and biogas plants in Chennai region.
                  </p>
                  <Button className="w-full" size="sm" variant="outline">
                    <Truck className="h-4 w-4 mr-2" />
                    Connect with Buyers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Insights */}
          <Card className="shadow-elegant bg-gradient-to-r from-primary/5 to-success/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">📊 Chennai Market Insights</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">2,500+</div>
                    <p className="text-sm text-muted-foreground">Daily Transactions</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">₹50Cr+</div>
                    <p className="text-sm text-muted-foreground">Monthly Trade Value</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">15,000+</div>
                    <p className="text-sm text-muted-foreground">Active Buyers</p>
                  </div>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Chennai's agricultural markets are among the most active in South India, offering excellent opportunities
                  for farmers to connect with premium buyers and achieve better price realization for their produce.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
