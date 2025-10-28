import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { SettingsModal } from "@/components/SettingsModal";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Camera,
  ShoppingCart,
  Bell,
  Settings,
  Leaf,
  Star,
  Edit,
  Trash2,
  Trophy,
  Award,
  Crown,
  Target,
  Zap,
  Flame,
  Home,
  BarChart3,
  Activity,
  DollarSign,
  Tractor,
  Calendar as CalendarIcon,
  Wrench,
  Sidebar,
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter
} from "lucide-react";
import { FarmFieldMapping } from "@/components/dashboard/FarmFieldMapping";
import { FinancialManagement } from "@/components/dashboard/FinancialManagement";
import { CropPlanningCalendar } from "@/components/dashboard/CropPlanningCalendar";
import { EquipmentManagement } from "@/components/dashboard/EquipmentManagement";
import { ProductManagement } from "@/components/ProductManagement";
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line
} from "recharts";

export default function UserProfile() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [farmerData, setFarmerData] = useState({
    name: "Rajesh Kumar Sharma",
    location: "Village Rampur, District Sangrur, Punjab",
    phone: "+91 98765 43210",
    email: "rajesh.farmer@gmail.com",
    joinDate: "March 2023",
    farmSize: "15 acres",
    crops: ["Wheat", "Rice", "Sugarcane", "Cotton", "Maize"],
    experience: "12 years",
    farmType: "Family-owned farm",
    irrigationType: "Canal + Borewell",
    soilType: "Alluvial Soil",
    certifications: ["Organic Farming Certified", "GAP Certified"],
    bankAccount: "XXXX-XXXX-1234",
    aadharNumber: "XXXX-XXXX-5678",
    panNumber: "ABCDE1234F",
    totalRevenue: "₹12,50,000",
    monthlyIncome: "₹85,000",
    outstandingLoans: "₹2,50,000",
    insuranceCoverage: "₹8,00,000"
  });

  // CRUD for crops
  const [newCrop, setNewCrop] = useState("");
  const [editCropIdx, setEditCropIdx] = useState<number|null>(null);
  const [editCropName, setEditCropName] = useState("");

  const handleAddCrop = () => {
    if (newCrop.trim()) {
      setFarmerData({ ...farmerData, crops: [...farmerData.crops, newCrop.trim()] });
      setNewCrop("");
    }
  };
  const handleEditCrop = (idx: number) => {
    setEditCropIdx(idx);
    setEditCropName(farmerData.crops[idx]);
  };
  const handleUpdateCrop = () => {
    if (editCropIdx !== null && editCropName.trim()) {
      const updatedCrops = [...farmerData.crops];
      updatedCrops[editCropIdx] = editCropName.trim();
      setFarmerData({ ...farmerData, crops: updatedCrops });
      setEditCropIdx(null);
      setEditCropName("");
    }
  };
  const handleDeleteCrop = (idx: number) => {
    setFarmerData({ ...farmerData, crops: farmerData.crops.filter((_, i) => i !== idx) });
  };

  // CRUD for activities
  const [activities, setActivities] = useState([
    {
      type: "diagnosis",
      title: "Wheat Disease Detected - Leaf Rust",
      description: "AI analysis detected early leaf rust in North Field. Recommended fungicide application within 48 hours.",
      date: "2 days ago",
      status: "resolved",
      icon: Camera,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      time: "2 days ago",
      category: "Diagnosis",
      details: "Treatment cost: ₹2,500",
      amount: "₹2,500"
    },
    {
      type: "market",
      title: "Rice Crop Sold Successfully",
      description: "5 quintal PR-126 rice sold at ₹3,200/quintal to local mandi. Total revenue: ₹16,000.",
      date: "1 week ago",
      status: "completed",
      icon: ShoppingCart,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      time: "1 week ago",
      category: "Sales",
      details: "Quality grade: A+",
      amount: "₹16,000"
    },
    {
      type: "purchase",
      title: "Fertilizer Purchase - NPK 50kg",
      description: "Purchased NPK 20-20-20 fertilizer for wheat crop. Cost: ₹2,800.",
      date: "2 weeks ago",
      status: "delivered",
      icon: Package,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      time: "2 weeks ago",
      category: "Purchase",
      details: "Supplier: AgriChem Distributors",
      amount: "₹2,800"
    },
    {
      type: "maintenance",
      title: "Tractor Maintenance Completed",
      description: "Mahindra 575 DI tractor serviced. Oil change, filter replacement, and brake adjustment.",
      date: "3 weeks ago",
      status: "completed",
      icon: Wrench,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      time: "3 weeks ago",
      category: "Maintenance",
      details: "Cost: ₹4,200",
      amount: "₹4,200"
    },
    {
      type: "weather",
      title: "Weather Alert - Heavy Rainfall",
      description: "Heavy rainfall expected (150mm) in next 24 hours. Protected crops with tarpaulin.",
      date: "1 month ago",
      status: "completed",
      icon: AlertCircle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      time: "1 month ago",
      category: "Weather",
      details: "No damage reported",
      amount: null
    },
    {
      type: "subsidy",
      title: "PM-KISAN Payment Received",
      description: "₹6,000 received under PM-KISAN scheme for quarter 3.",
      date: "1 month ago",
      status: "completed",
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      time: "1 month ago",
      category: "Subsidy",
      details: "Total annual benefit: ₹24,000",
      amount: "₹6,000"
    },
    {
      type: "training",
      title: "Organic Farming Workshop",
      description: "Attended 2-day organic farming workshop organized by Krishi Vigyan Kendra.",
      date: "2 months ago",
      status: "completed",
      icon: Award,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      time: "2 months ago",
      category: "Training",
      details: "Learned sustainable practices",
      amount: null
    },
    {
      type: "insurance",
      title: "Crop Insurance Claim Filed",
      description: "Filed insurance claim for hail damage to maize crop. Claim amount: ₹15,000.",
      date: "3 months ago",
      status: "pending",
      icon: CheckCircle,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      time: "3 months ago",
      category: "Insurance",
      details: "Status: Under review",
      amount: "₹15,000"
    }
  ]);
  const [activityForm, setActivityForm] = useState({
    type: "diagnosis",
    title: "",
    description: "",
    date: "",
    status: "pending"
  });
  const [editActivityIdx, setEditActivityIdx] = useState<number|null>(null);

  const handleAddActivity = () => {
    if (activityForm.title && activityForm.description) {
      const activityTypeConfig = {
        diagnosis: { icon: Camera, iconBg: "bg-red-100", iconColor: "text-red-600", category: "Diagnosis" },
        market: { icon: ShoppingCart, iconBg: "bg-green-100", iconColor: "text-green-600", category: "Sales" },
        purchase: { icon: Package, iconBg: "bg-blue-100", iconColor: "text-blue-600", category: "Purchase" },
        maintenance: { icon: Wrench, iconBg: "bg-orange-100", iconColor: "text-orange-600", category: "Maintenance" },
        weather: { icon: AlertCircle, iconBg: "bg-yellow-100", iconColor: "text-yellow-600", category: "Weather" },
        subsidy: { icon: DollarSign, iconBg: "bg-green-100", iconColor: "text-green-600", category: "Subsidy" },
        training: { icon: Award, iconBg: "bg-purple-100", iconColor: "text-purple-600", category: "Training" },
        insurance: { icon: CheckCircle, iconBg: "bg-gray-100", iconColor: "text-gray-600", category: "Insurance" }
      };

      const config = activityTypeConfig[activityForm.type as keyof typeof activityTypeConfig] || activityTypeConfig.diagnosis;

      setActivities([...activities, { 
        ...activityForm,
        icon: config.icon,
        iconBg: config.iconBg,
        iconColor: config.iconColor,
        time: activityForm.date || "Just now",
        category: config.category,
        details: "",
        amount: null
      }]);
      setActivityForm({ type: "diagnosis", title: "", description: "", date: "", status: "pending" });
    }
  };
  const handleEditActivity = (idx: number) => {
    setEditActivityIdx(idx);
    setActivityForm({ ...activities[idx] });
  };
  const handleUpdateActivity = () => {
    if (editActivityIdx !== null) {
      const activityTypeConfig = {
        diagnosis: { icon: Camera, iconBg: "bg-red-100", iconColor: "text-red-600", category: "Diagnosis" },
        market: { icon: ShoppingCart, iconBg: "bg-green-100", iconColor: "text-green-600", category: "Sales" },
        purchase: { icon: Package, iconBg: "bg-blue-100", iconColor: "text-blue-600", category: "Purchase" },
        maintenance: { icon: Wrench, iconBg: "bg-orange-100", iconColor: "text-orange-600", category: "Maintenance" },
        weather: { icon: AlertCircle, iconBg: "bg-yellow-100", iconColor: "text-yellow-600", category: "Weather" },
        subsidy: { icon: DollarSign, iconBg: "bg-green-100", iconColor: "text-green-600", category: "Subsidy" },
        training: { icon: Award, iconBg: "bg-purple-100", iconColor: "text-purple-600", category: "Training" },
        insurance: { icon: CheckCircle, iconBg: "bg-gray-100", iconColor: "text-gray-600", category: "Insurance" }
      };

      const config = activityTypeConfig[activityForm.type as keyof typeof activityTypeConfig] || activityTypeConfig.diagnosis;

      const updated = [...activities];
      updated[editActivityIdx] = { 
        ...activityForm,
        icon: config.icon,
        iconBg: config.iconBg,
        iconColor: config.iconColor,
        time: activityForm.date || activities[editActivityIdx].time,
        category: config.category,
        details: activities[editActivityIdx].details || "",
        amount: activities[editActivityIdx].amount || null
      };
      setActivities(updated);
      setEditActivityIdx(null);
      setActivityForm({ type: "diagnosis", title: "", description: "", date: "", status: "pending" });
    }
  };
  const handleDeleteActivity = (idx: number) => {
    setActivities(activities.filter((_, i) => i !== idx));
  };

  const stats = [
    { label: "AI Diagnoses", value: "47", icon: Camera, description: "Plant health checks" },
    { label: "Successful Sales", value: "23", icon: ShoppingCart, description: "Market transactions" },
    { label: "Farm Savings", value: "₹1.2L", icon: TrendingUp, description: "Cost optimizations" },
    { label: "Farm Rating", value: "4.8", icon: Star, description: "Buyer feedback" },
    { label: "Active Fields", value: "3", icon: Leaf, description: "Under cultivation" },
    { label: "Equipment", value: "5", icon: Tractor, description: "Farm machinery" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Farmer Dashboard</h1>
          <p className="text-primary-foreground/90">Your farming journey and achievements</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Profile Header Card - Always visible */}
        <Card className="shadow-elegant mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {farmerData.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{farmerData.name}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{farmerData.location}</span>
                  </div>
                  <Badge className="mt-2 bg-success text-success-foreground">
                    Verified Farmer
                  </Badge>
                </div>
              </div>

              {/* Quick Profile Actions */}
              <div className="flex-1 md:text-right space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full md:w-auto"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <div className="flex md:justify-end gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Info and Farm Details */}
            <div className="mt-6 pt-6 border-t grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{farmerData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{farmerData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Member since {farmerData.joinDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" />
                <span>{farmerData.farmSize} farm</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <span>{farmerData.farmType}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>{farmerData.monthlyIncome}/month</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Experience:</span> {farmerData.experience}
              </div>
              <div>
                <span className="font-medium">Soil Type:</span> {farmerData.soilType}
              </div>
              <div>
                <span className="font-medium">Irrigation:</span> {farmerData.irrigationType}
              </div>
              <div>
                <span className="font-medium">Insurance:</span> {farmerData.insuranceCoverage}
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {farmerData.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="hidden lg:grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="farm" className="flex items-center gap-2">
              <Tractor className="h-4 w-4" />
              <span className="hidden sm:inline">Farm</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Sell</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <QuickActions userType="farmer" />

            {/* Dashboard Metrics */}
            <DashboardMetrics userType="farmer" />
          </TabsContent>

          {/* Farm Management Tab */}
          <TabsContent value="farm" className="space-y-6">
            {/* Farm Information */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Farm Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Farm Size</h4>
                    <p className="text-2xl font-bold text-primary">{farmerData.farmSize}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Experience</h4>
                    <p className="text-2xl font-bold text-primary">{farmerData.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Main Crops</h4>
                    <div className="flex flex-wrap gap-2">
                      {farmerData.crops.map((crop, idx) => (
                        <span key={crop} className="flex items-center gap-1">
                          {editCropIdx === idx ? (
                            <>
                              <input 
                                value={editCropName} 
                                onChange={e => setEditCropName(e.target.value)} 
                                className="border border-border rounded px-2 py-1 text-sm bg-background text-foreground" 
                                placeholder="Crop name"
                              />
                              <Button size="sm" variant="outline" onClick={handleUpdateCrop}>Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => { setEditCropIdx(null); setEditCropName(""); }}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              <Badge variant="secondary">{crop}</Badge>
                              <Button size="sm" variant="ghost" onClick={() => handleEditCrop(idx)}><Edit className="h-3 w-3" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteCrop(idx)}><Trash2 className="h-3 w-3" /></Button>
                            </>
                          )}
                        </span>
                      ))}
                      <input 
                        value={newCrop} 
                        onChange={e => setNewCrop(e.target.value)} 
                        placeholder="Add crop" 
                        className="border border-border rounded px-2 py-1 text-sm bg-background text-foreground" 
                      />
                      <Button size="sm" variant="default" onClick={handleAddCrop}>Add</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farm Field Mapping */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Farm Field Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <FarmFieldMapping />
              </CardContent>
            </Card>

            {/* Crop Planning Calendar */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Crop Planning Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CropPlanningCalendar />
              </CardContent>
            </Card>

            {/* Equipment Management */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Equipment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <EquipmentManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Activities</h3>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {activities.map((activity, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${activity.iconBg}`}>
                      <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                          <Badge variant="secondary" className="text-xs">
                            {activity.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      {activity.details && (
                        <div className="text-xs text-muted-foreground">
                          {activity.details}
                        </div>
                      )}
                      {activity.amount && (
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {activity.amount}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline">
                Load More Activities
              </Button>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Charts and Data */}
              <div className="lg:col-span-2 space-y-8">
                {/* Revenue Chart */}
                <RevenueChart userType="farmer" />

                {/* Crop Performance Chart */}
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle>Crop Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Rice', yield: 85, revenue: 45000 },
                          { name: 'Wheat', yield: 92, revenue: 38000 },
                          { name: 'Cotton', yield: 78, revenue: 52000 },
                          { name: 'Sugarcane', yield: 88, revenue: 65000 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="yield" fill="#8884d8" name="Yield %" />
                          <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Trends */}
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { month: 'Jan', sales: 12000, expenses: 8000, profit: 4000 },
                          { month: 'Feb', sales: 15000, expenses: 9000, profit: 6000 },
                          { month: 'Mar', sales: 18000, expenses: 10000, profit: 8000 },
                          { month: 'Apr', sales: 22000, expenses: 12000, profit: 10000 },
                          { month: 'May', sales: 25000, expenses: 14000, profit: 11000 },
                          { month: 'Jun', sales: 28000, expenses: 15000, profit: 13000 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
                          <Line type="monotone" dataKey="expenses" stroke="#ff7300" name="Expenses" />
                          <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                {/* Activity Feed */}
                <ActivityFeed userType="farmer" limit={6} />

                {/* Notification Center */}
                <NotificationCenter userType="farmer" />

                {/* Quick Insights */}
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle>Quick Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Revenue Up 15%</p>
                        <p className="text-sm text-green-600">vs last month</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Camera className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">47 AI Diagnoses</p>
                        <p className="text-sm text-blue-600">This month</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Star className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-800">4.8 Rating</p>
                        <p className="text-sm text-orange-600">Average score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Financial Management</CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sell Tab */}
          <TabsContent value="sell" className="space-y-6">
            <ProductManagement />
          </TabsContent>
        </Tabs>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="grid grid-cols-6 gap-1 p-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("overview")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Home className="h-4 w-4" />
              <span className="text-xs">Overview</span>
            </Button>
            <Button
              variant={activeTab === "farm" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("farm")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Tractor className="h-4 w-4" />
              <span className="text-xs">Farm</span>
            </Button>
            <Button
              variant={activeTab === "activities" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("activities")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Activity className="h-4 w-4" />
              <span className="text-xs">Activities</span>
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("analytics")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Analytics</span>
            </Button>
            <Button
              variant={activeTab === "financial" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("financial")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Financial</span>
            </Button>
            <Button
              variant={activeTab === "sell" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("sell")}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Truck className="h-4 w-4" />
              <span className="text-xs">Sell</span>
            </Button>
          </div>
        </div>

        {/* Quick Access Sidebar - Desktop Only */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
            <div className="flex flex-col gap-1">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("overview")}
                className="w-10 h-10 p-0"
                title="Overview"
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "farm" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("farm")}
                className="w-10 h-10 p-0"
                title="Farm Management"
              >
                <Tractor className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "activities" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("activities")}
                className="w-10 h-10 p-0"
                title="Activities"
              >
                <Activity className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("analytics")}
                className="w-10 h-10 p-0"
                title="Analytics"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "financial" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("financial")}
                className="w-10 h-10 p-0"
                title="Financial"
              >
                <DollarSign className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "sell" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("sell")}
                className="w-10 h-10 p-0"
                title="Sell Management"
              >
                <Truck className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}