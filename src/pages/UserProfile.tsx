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
import { AchievementUnlockNotification, useAchievementNotifications } from "@/components/gamification/AchievementNotification";
import { useUserProgress, useAchievements, useBadges } from "@/hooks/useGamification";
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
  Sidebar
} from "lucide-react";
import { FarmFieldMapping } from "@/components/dashboard/FarmFieldMapping";
import { FinancialManagement } from "@/components/dashboard/FinancialManagement";
import { CropPlanningCalendar } from "@/components/dashboard/CropPlanningCalendar";
import { EquipmentManagement } from "@/components/dashboard/EquipmentManagement";

export default function UserProfile() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Gamification hooks
  const { userLevel, userStats, levelProgress } = useUserProgress();
  const { recentAchievements, achievements } = useAchievements();
  const { badges, recentBadges } = useBadges();
  const { currentNotification, isVisible, hideNotification } = useAchievementNotifications();
  
  const [farmerData, setFarmerData] = useState({
    name: "Rajesh Kumar",
    location: "Village Rampur, Punjab",
    phone: "+91 98765 43210",
    email: "rajesh.farmer@gmail.com",
    joinDate: "March 2023",
    farmSize: "15 acres",
    crops: ["Wheat", "Rice", "Sugarcane"],
    experience: "12 years",
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
      title: "Wheat Disease Detected",
      description: "Leaf rust identified - Treatment applied",
      date: "2 days ago",
      status: "resolved",
    },
    {
      type: "market",
      title: "Sold Rice Crop",
      description: "5 quintal sold at ₹3,200/quintal",
      date: "1 week ago",
      status: "completed",
    },
    {
      type: "purchase",
      title: "Fertilizer Purchase",
      description: "NPK 50kg bag ordered",
      date: "2 weeks ago",
      status: "delivered",
    },
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
      setActivities([...activities, { ...activityForm }]);
      setActivityForm({ type: "diagnosis", title: "", description: "", date: "", status: "pending" });
    }
  };
  const handleEditActivity = (idx: number) => {
    setEditActivityIdx(idx);
    setActivityForm({ ...activities[idx] });
  };
  const handleUpdateActivity = () => {
    if (editActivityIdx !== null) {
      const updated = [...activities];
      updated[editActivityIdx] = { ...activityForm };
      setActivities(updated);
      setEditActivityIdx(null);
      setActivityForm({ type: "diagnosis", title: "", description: "", date: "", status: "pending" });
    }
  };
  const handleDeleteActivity = (idx: number) => {
    setActivities(activities.filter((_, i) => i !== idx));
  };

  const stats = [
    { label: "Diagnoses", value: "23", icon: Camera },
    { label: "Trades", value: "8", icon: ShoppingCart },
    { label: "Savings", value: "₹45K", icon: TrendingUp },
    { label: "Rating", value: "4.8", icon: Star },
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

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t grid sm:grid-cols-2 gap-4 text-sm">
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
            </div>
          </CardContent>
        </Card>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="hidden lg:grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
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
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Gamification Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-elegant">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Level</p>
                      <p className="text-2xl font-bold text-foreground">{userLevel.currentLevel}</p>
                      <p className="text-xs text-muted-foreground">{levelProgress}% to next level</p>
                    </div>
                    <Crown className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                  </div>
                  <Progress value={levelProgress} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                      <p className="text-2xl font-bold text-foreground">{userStats.totalPoints.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">+{userStats.weeklyPoints} this week</p>
                    </div>
                    <Star className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                      <p className="text-2xl font-bold text-foreground">
                        {achievements.filter(a => a.unlocked).length}/{achievements.length}
                      </p>
                      <p className="text-xs text-muted-foreground">{recentAchievements.length} recent</p>
                    </div>
                    <Trophy className="h-8 w-8 text-green-500 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                      <p className="text-2xl font-bold text-foreground">{badges.length}</p>
                      <p className="text-xs text-muted-foreground">{recentBadges.length} new</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            {recentAchievements.length > 0 && (
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentAchievements.slice(0, 3).map((achievement) => (
                      <Card key={achievement.id} className="shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-yellow-500 dark:text-yellow-400">
                              <Trophy size={24} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{achievement.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  +{achievement.points} points
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {achievement.rarity}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Streak */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Daily Activity Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-orange-500 dark:text-orange-400">{userStats.currentStreak}</p>
                    <p className="text-sm text-muted-foreground">Days in a row</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">Weekly Goal</p>
                    <p className="text-xs text-muted-foreground">Complete 5 activities</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground">Progress this week</span>
                  <span className="text-sm font-medium text-foreground">4/5 activities</span>
                </div>
                <Progress value={80} className="h-2" />
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div
                      key={day}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        day <= 4
                          ? 'bg-orange-500 dark:bg-orange-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {day <= 4 ? '✓' : day}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Activities Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, idx) => (
                    <div key={idx} className="border rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditActivity(idx)}><Edit className="h-3 w-3" />Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteActivity(idx)}><Trash2 className="h-3 w-3" />Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2">
                  <h4 className="font-semibold">{editActivityIdx !== null ? "Edit Activity" : "Add Activity"}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input 
                      name="title" 
                      value={activityForm.title} 
                      onChange={e => setActivityForm({ ...activityForm, title: e.target.value })} 
                      placeholder="Title" 
                      className="border border-border rounded px-2 py-1 bg-background text-foreground" 
                    />
                    <input 
                      name="description" 
                      value={activityForm.description} 
                      onChange={e => setActivityForm({ ...activityForm, description: e.target.value })} 
                      placeholder="Description" 
                      className="border border-border rounded px-2 py-1 bg-background text-foreground" 
                    />
                    <input 
                      name="date" 
                      value={activityForm.date} 
                      onChange={e => setActivityForm({ ...activityForm, date: e.target.value })} 
                      placeholder="Date" 
                      className="border border-border rounded px-2 py-1 bg-background text-foreground" 
                    />
                    <select 
                      name="type" 
                      value={activityForm.type} 
                      onChange={e => setActivityForm({ ...activityForm, type: e.target.value })} 
                      className="border border-border rounded px-2 py-1 bg-background text-foreground"
                      title="Activity Type"
                    >
                      <option value="diagnosis">Diagnosis</option>
                      <option value="market">Market</option>
                      <option value="purchase">Purchase</option>
                    </select>
                    <select 
                      name="status" 
                      value={activityForm.status} 
                      onChange={e => setActivityForm({ ...activityForm, status: e.target.value })} 
                      className="border border-border rounded px-2 py-1 bg-background text-foreground"
                      title="Activity Status"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="resolved">Resolved</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {editActivityIdx !== null ? (
                      <Button size="sm" variant="default" onClick={handleUpdateActivity}>Update</Button>
                    ) : (
                      <Button size="sm" variant="default" onClick={handleAddActivity}>Add</Button>
                    )}
                    {editActivityIdx !== null && (
                      <Button size="sm" variant="ghost" onClick={() => { setEditActivityIdx(null); setActivityForm({ type: "diagnosis", title: "", description: "", date: "", status: "pending" }); }}>Cancel</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Charts and Data */}
              <div className="lg:col-span-2 space-y-8">
                {/* Revenue Chart */}
                <RevenueChart userType="farmer" />
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                {/* Activity Feed */}
                <ActivityFeed userType="farmer" limit={6} />

                {/* Notification Center */}
                <NotificationCenter userType="farmer" />
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
        </Tabs>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="grid grid-cols-5 gap-1 p-2">
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
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Achievement Notifications */}
      {isVisible && currentNotification && (
        <AchievementUnlockNotification
          achievement={currentNotification}
          isVisible={isVisible}
          onClose={hideNotification}
        />
      )}
    </div>
  );
}