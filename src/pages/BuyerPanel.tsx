import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Package,
  TrendingUp,
  ShoppingCart,
  Star,
  Camera,
  CheckCircle,
  AlertCircle,
  Users,
  Target
} from "lucide-react";

export default function BuyerPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddDemand, setShowAddDemand] = useState(false);

  const buyerStats = [
    { label: "Active Demands", value: "12", icon: Target, color: "primary" },
    { label: "Total Spent", value: "₹8.5L", icon: DollarSign, color: "success" },
    { label: "Suppliers Found", value: "45", icon: Users, color: "secondary" },
    { label: "Avg. Rating", value: "4.7", icon: Star, color: "warning" },
  ];

  // CRUD state for demands
  const [demands, setDemands] = useState([
    {
      id: 1,
      product: "Fresh Tomatoes",
      category: "Vegetables",
      quantity: 500,
      unit: "kg",
      maxPrice: 50,
      urgency: "high",
      status: "active",
      suppliers: 8,
      description: "Need fresh, organic tomatoes for retail chain. Grade A quality required."
    },
    {
      id: 2,
      product: "Hybrid Rice Seeds",
      category: "Seeds",
      quantity: 200,
      unit: "kg",
      maxPrice: 1500,
      urgency: "medium",
      status: "active",
      suppliers: 3,
      description: "High-yield hybrid rice seeds for Tamil Nadu climate. Must be certified."
    },
    {
      id: 3,
      product: "Sugarcane",
      category: "Crops",
      quantity: 1000,
      unit: "tons",
      maxPrice: 3500,
      urgency: "low",
      status: "fulfilled",
      suppliers: 12,
      description: "Fresh sugarcane for jaggery production. Organic preferred."
    }
  ]);

  // Add/Edit/Delete state
  const [editDemandId, setEditDemandId] = useState<number|null>(null);
  const [formData, setFormData] = useState({
    product: "",
    category: "",
    quantity: "",
    unit: "",
    maxPrice: "",
    urgency: "",
    description: ""
  });

  // Add demand handler
  const handleAddDemand = () => {
    if (!formData.product || !formData.category || !formData.quantity || !formData.unit || !formData.maxPrice) return;
    const newDemand = {
      id: demands.length ? Math.max(...demands.map(d => d.id)) + 1 : 1,
      product: formData.product,
      category: formData.category,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      maxPrice: Number(formData.maxPrice),
      urgency: formData.urgency || "medium",
      status: "active",
      suppliers: 0,
      description: formData.description || ""
    };
    setDemands([...demands, newDemand]);
    setShowAddDemand(false);
    setFormData({ product: "", category: "", quantity: "", unit: "", maxPrice: "", urgency: "", description: "" });
  };

  // Edit demand handler
  const handleEditDemand = (id: number) => {
    const demand = demands.find(d => d.id === id);
    if (demand) {
      setEditDemandId(id);
      setFormData({
        product: demand.product,
        category: demand.category,
        quantity: String(demand.quantity),
        unit: demand.unit,
        maxPrice: String(demand.maxPrice),
        urgency: demand.urgency,
        description: demand.description || ""
      });
      setShowAddDemand(true);
    }
  };

  // Update demand handler
  const handleUpdateDemand = () => {
    setDemands(demands.map(d => d.id === editDemandId ? {
      ...d,
      product: formData.product,
      category: formData.category,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      maxPrice: Number(formData.maxPrice),
      urgency: formData.urgency,
      description: formData.description
    } : d));
    setEditDemandId(null);
    setShowAddDemand(false);
    setFormData({ product: "", category: "", quantity: "", unit: "", maxPrice: "", urgency: "", description: "" });
  };

  // Delete demand handler
  const handleDeleteDemand = (id: number) => {
    setDemands(demands.filter(d => d.id !== id));
  };

  // Form change handler
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id || e.target.name]: e.target.value });
  };

  const recentMatches = [
    {
      id: "MTCH-001",
      demand: "Fresh Tomatoes",
      supplier: "Rajesh Farms",
      quantity: "200 kg",
      price: 48,
      status: "negotiating",
      date: "2 hours ago"
    },
    {
      id: "MTCH-002",
      demand: "Hybrid Rice Seeds",
      supplier: "Green Valley Seeds",
      quantity: "50 kg",
      price: 1450,
      status: "confirmed",
      date: "5 hours ago"
    }
  ];

  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "success" | "warning" => {
    switch (status) {
      case "active": return "success";
      case "fulfilled": return "secondary";
      case "expired": return "destructive";
      case "negotiating": return "warning";
      case "confirmed": return "success";
      default: return "secondary";
    }
  };

  const getUrgencyColor = (urgency: string): "default" | "secondary" | "destructive" | "success" | "warning" => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Dashboard Metrics */}
      <DashboardMetrics userType="buyer" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Spending Chart */}
          <RevenueChart userType="buyer" />

          {/* Recent Matches */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Supplier Matches
                <Badge variant="secondary">{recentMatches.length} matches</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{match.demand}</h4>
                      <p className="text-sm text-muted-foreground">
                        {match.supplier} • {match.quantity} • {match.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{match.price}</p>
                      <Badge variant={getStatusColor(match.status)}>
                        {match.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <QuickActions userType="buyer" />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Activity Feed */}
          <ActivityFeed userType="buyer" limit={6} />

          {/* Notification Center */}
          <NotificationCenter userType="buyer" />
        </div>
      </div>
    </div>
  );

  const renderDemands = () => (
    <div className="space-y-6">
      {/* Add Demand Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Demands</h2>
        <Button onClick={() => setShowAddDemand(true)} variant="hero">
          <Plus className="mr-2 h-4 w-4" />
          Post Demand
        </Button>
      </div>

      {/* Demands Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demands.map((demand) => (
          <Card key={demand.id} className="shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{demand.product}</h3>
                    <p className="text-sm text-muted-foreground">{demand.category}</p>
                  </div>
                  <Badge variant={getUrgencyColor(demand.urgency)}>
                    {demand.urgency}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    {demand.quantity} {demand.unit}
                  </span>
                  <Badge variant={getStatusColor(demand.status)}>
                    {demand.status}
                  </Badge>
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Max Price:</span>
                    <span className="font-medium">₹{demand.maxPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suppliers:</span>
                    <span>{demand.suppliers} found</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {demand.description}
                </p>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditDemand(demand.id)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteDemand(demand.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAddDemand = () => (
    <Card className="shadow-elegant max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Post New Demand</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="product">Product Name</Label>
            <Input id="product" value={formData.product} onChange={handleFormChange} placeholder="e.g., Fresh Tomatoes" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select id="category" value={formData.category} onChange={handleFormChange} className="w-full p-2 border rounded-md" title="Select product category">
              <option value="">Select category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Seeds">Seeds</option>
              <option value="Crops">Crops</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" value={formData.quantity} onChange={handleFormChange} placeholder="Enter quantity" />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <select id="unit" value={formData.unit} onChange={handleFormChange} className="w-full p-2 border rounded-md" title="Select quantity unit">
              <option value="">Select unit</option>
              <option value="kg">kg</option>
              <option value="tons">tons</option>
              <option value="pieces">pieces</option>
              <option value="bags">bags</option>
            </select>
          </div>
          <div>
            <Label htmlFor="urgency">Urgency</Label>
            <select id="urgency" value={formData.urgency} onChange={handleFormChange} className="w-full p-2 border rounded-md" title="Select demand urgency level">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="maxPrice">Maximum Price (₹)</Label>
          <Input id="maxPrice" type="number" value={formData.maxPrice} onChange={handleFormChange} placeholder="Enter maximum price per unit" />
        </div>

        <div>
          <Label htmlFor="description">Requirements</Label>
          <Textarea id="description" value={formData.description} onChange={handleFormChange} placeholder="Describe your requirements, quality standards, delivery preferences..." />
        </div>

        <div className="flex gap-4">
          {editDemandId ? (
            <Button variant="hero" className="flex-1" onClick={handleUpdateDemand}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Update Demand
            </Button>
          ) : (
            <Button variant="hero" className="flex-1" onClick={handleAddDemand}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Post Demand
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => { setShowAddDemand(false); setEditDemandId(null); setFormData({ product: "", category: "", quantity: "", unit: "", maxPrice: "", urgency: "", description: "" }); }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-secondary text-secondary-foreground p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Buyer Dashboard</h1>
          <p className="text-secondary-foreground/90">Post demands and connect with suppliers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-card p-2 rounded-lg shadow-sm">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            onClick={() => {setActiveTab("dashboard"); setShowAddDemand(false);}}
            className="flex-1"
          >
            Dashboard
          </Button>
          <Button
            variant={activeTab === "demands" ? "default" : "ghost"}
            onClick={() => {setActiveTab("demands"); setShowAddDemand(false);}}
            className="flex-1"
          >
            My Demands
          </Button>
          <Button
            variant={activeTab === "suppliers" ? "default" : "ghost"}
            onClick={() => {setActiveTab("suppliers"); setShowAddDemand(false);}}
            className="flex-1"
          >
            Suppliers
          </Button>
        </div>

        {/* Content */}
        {showAddDemand ? renderAddDemand() :
         activeTab === "dashboard" ? renderDashboard() :
         activeTab === "demands" ? renderDemands() :
         <div className="text-center py-12">
           <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
           <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
           <p className="text-muted-foreground">This section is under development</p>
         </div>
        }
      </div>
    </div>
  );
}