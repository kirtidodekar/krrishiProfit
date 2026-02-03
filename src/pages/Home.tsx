import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Package,
  Users,
  Wheat,
  Leaf,
  Recycle,
  ChevronRight,
  Loader2,
  MessageCircle,
  Bell,
  Globe,
  Sun,
  Moon,
  Coffee,
  Utensils,
  Car,
  Settings,
  MapPin,
  Phone,
  Check,
  X,
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import StatCard from "@/components/ui/stat-card";
import ActionButton from "@/components/ui/action-button";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    products, 
    orders, 
    loading, 
    error, 
    refreshProducts, 
    notifications, 
    language, 
    setLanguage, 
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification
  } = useApp();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [aiAlerts, setAiAlerts] = useState([
    { id: 1, type: 'price-increase', title: 'Rice Husk Prices Rising', message: 'Market analysis shows 8% price increase for rice husk', active: true },
    { id: 2, type: 'demand', title: 'High Demand for Wheat Straw', message: 'Buyers are actively seeking wheat straw in your area', active: true },
  ]);

  // Get greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculate stats based on real data
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  // Filter products for this farmer
  const farmerProducts = products.filter(p => p.farmerName.toLowerCase().includes(user?.displayName?.toLowerCase() || user?.email?.split('@')[0].toLowerCase() || ''));

  // Calculate today's earnings
  const todayOrders = orders.filter(order => 
    new Date(order.createdAt) >= todayStart && 
    new Date(order.createdAt) < todayEnd &&
    order.status !== 'cancelled'
  );

  const todayEarnings = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  // Calculate total earnings
  const totalEarnings = orders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + order.totalPrice, 0);

  // Active listings
  const activeListings = farmerProducts.filter(p => p.available).length;

  // Pending orders
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // Calculate nearby buyers based on location
  const nearbyBuyers = [
    { 
      name: "BioFuel Corp", 
      offer: "₹2,500", 
      distance: "5 km", 
      demand: "High",
      contact: "+91 98765 43210",
      lastContacted: "Today"
    },
    { 
      name: "Green Compost", 
      offer: "₹1,800", 
      distance: "8 km", 
      demand: "Medium",
      contact: "+91 98765 43211",
      lastContacted: "Yesterday"
    },
    { 
      name: "Organic Waste Solutions", 
      offer: "₹2,200", 
      distance: "12 km", 
      demand: "Medium",
      contact: "+91 98765 43212",
      lastContacted: "2 days ago"
    },
  ];

  // Unread notification count
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    if (action === 'wheat') {
      navigate('/add-waste', { state: { category: 'wheat-straw' } });
    } else if (action === 'rice') {
      navigate('/add-waste', { state: { category: 'rice-husk' } });
    } else if (action === 'messages') {
      navigate('/messages');
    }
  };

  // Dismiss AI alert
  const dismissAlert = (id: number) => {
    setAiAlerts(aiAlerts.filter(alert => alert.id !== id));
  };

  // Change language
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  const quickActions = [
    { icon: <Wheat className="w-full h-full" />, label: "Add Wheat Straw", action: 'wheat' },
    { icon: <Leaf className="w-full h-full" />, label: "Add Rice Husk", action: 'rice' },
    { icon: <MessageCircle className="w-full h-full" />, label: "Check Messages", action: 'messages' },
  ];

  if (loading.products || loading.orders) {
    return (
      <MobileLayout>
        <AppHeader 
          title={`${getTimeBasedGreeting()}, ${user?.displayName || user?.email?.split('@')[0]} 👋`} 
          showNotification={true}
          showLanguage={true}
          notificationCount={0}
          onBack={undefined}
        />
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  if (error.products || error.orders) {
    return (
      <MobileLayout>
        <AppHeader 
          title={`${getTimeBasedGreeting()}, ${user?.displayName || user?.email?.split('@')[0]} 👋`} 
          showNotification={true}
          showLanguage={true}
          notificationCount={0}
          onBack={undefined}
        />
        <div className="px-4 py-4">
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center">
            <p className="font-medium text-destructive">Error loading data</p>
            <p className="text-sm text-destructive/80 mt-1">{error.products || error.orders}</p>
            <button 
              onClick={refreshProducts}
              className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <AppHeader 
        title={`${getTimeBasedGreeting()}, ${user?.displayName || user?.email?.split('@')[0]} 👋`} 
        showNotification={true}
        showLanguage={true}
        notificationCount={0}
        onBack={undefined}
      />
      
      <div className="px-4 py-4 space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Wallet className="w-6 h-6" />}
            label="Today's Value"
            value={`₹${todayEarnings.toLocaleString()}`}
            subtext="from orders"
            variant="primary"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total Earnings"
            value={`₹${totalEarnings.toLocaleString()}`}
            subtext="lifetime"
            variant="secondary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Active Listings"
            value={`${activeListings}`}
            subtext={`${pendingOrders} pending`}
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Nearby Buyers"
            value={`${nearbyBuyers.length}`}
            subtext="Within 15 km"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-foreground">Quick Actions</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ActionButton
                  icon={action.icon}
                  label={action.label}
                  onClick={() => handleQuickAction(action.action)}
                  variant={index === 2 ? "primary" : "default"}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Insights Banners */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-foreground">AI Insights</h3>
          {aiAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-accent rounded-2xl p-4 shadow-card relative"
            >
              <button 
                onClick={() => dismissAlert(alert.id)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-accent-foreground">{alert.title}</h4>
                  <p className="text-sm opacity-80">
                    {alert.message}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/marketplace')}
                  className="text-xs bg-white/20 text-white px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                >
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nearby Buyer Alerts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-foreground">Nearby Buyers</h3>
            <button 
              onClick={() => navigate("/messages")}
              className="text-sm text-primary font-semibold"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {nearbyBuyers.map((buyer, index) => (
              <motion.div
                key={buyer.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{buyer.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {buyer.distance} • {buyer.demand} Demand
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{buyer.offer}</p>
                  <p className="text-xs text-muted-foreground">per quintal</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Home;