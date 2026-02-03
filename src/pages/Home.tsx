import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Package,
  Users,
  Wheat,
  Leaf,
  Recycle,
  ChevronRight,
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import StatCard from "@/components/ui/stat-card";
import ActionButton from "@/components/ui/action-button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const quickActions = [
    { icon: <Wheat className="w-full h-full" />, label: "Crop Waste", path: "/add-waste" },
    { icon: <Leaf className="w-full h-full" />, label: "Bio Waste", path: "/add-waste" },
    { icon: <Recycle className="w-full h-full" />, label: "Sell Now", path: "/marketplace" },
  ];

  const recentBuyers = [
    { name: "BioFuel Corp", offer: "₹2,500", distance: "5 km", demand: "High" },
    { name: "Green Compost", offer: "₹1,800", distance: "8 km", demand: "Medium" },
  ];

  return (
    <MobileLayout>
      <AppHeader notificationCount={3} />

      <div className="px-4 py-4 space-y-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <p className="text-muted-foreground">Good Morning,</p>
          <h2 className="text-2xl font-bold text-foreground">Ramesh Kumar 👋</h2>
        </motion.div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Wallet className="w-6 h-6" />}
            label="Today's Value"
            value="₹4,250"
            subtext="+12% from yesterday"
            variant="primary"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total Earnings"
            value="₹85,400"
            subtext="This month"
            variant="secondary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Active Listings"
            value="8"
            subtext="3 pending offers"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Nearby Buyers"
            value="12"
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
                  onClick={() => navigate(action.path)}
                  variant={index === 2 ? "primary" : "default"}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Insights Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-accent rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-accent-foreground">AI Price Alert</h4>
              <p className="text-sm opacity-80">
                Rice straw prices are up 15% this week!
              </p>
            </div>
            <ChevronRight className="w-5 h-5 opacity-60" />
          </div>
        </motion.div>

        {/* Nearby Buyer Alerts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-foreground">Buyer Alerts</h3>
            <button 
              onClick={() => navigate("/marketplace")}
              className="text-sm text-primary font-semibold"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentBuyers.map((buyer, index) => (
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
