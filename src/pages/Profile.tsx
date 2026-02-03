import { motion } from "framer-motion";
import {
  BadgeCheck,
  MapPin,
  Phone,
  Settings,
  ChevronRight,
  Wallet,
  Package,
  Clock,
  Star,
  LogOut,
  HelpCircle,
  FileText,
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { icon: <Package className="w-5 h-5" />, label: "Total Sold", value: "156 Qtl" },
  { icon: <Wallet className="w-5 h-5" />, label: "Earnings", value: "₹2.4L" },
  { icon: <Star className="w-5 h-5" />, label: "Rating", value: "4.8" },
  { icon: <Clock className="w-5 h-5" />, label: "Member", value: "2 Years" },
];

const menuItems = [
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Order History",
    subtitle: "View past transactions",
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    label: "Payment Settings",
    subtitle: "Bank account & UPI",
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    label: "Help & Support",
    subtitle: "FAQs and contact",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    subtitle: "Notifications & language",
  },
];

const Profile = () => {
  return (
    <MobileLayout>
      <AppHeader title="Profile" />

      <div className="px-4 py-4 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-primary rounded-2xl p-5 text-primary-foreground"
        >
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
              👨‍🌾
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Ramesh Kumar</h2>
                <BadgeCheck className="w-5 h-5 text-accent" />
              </div>
              <p className="opacity-80 text-sm mt-1">Verified Farmer</p>
              <div className="flex items-center gap-1 mt-2 text-sm opacity-80">
                <MapPin className="w-4 h-4" />
                <span>Village Rampur, Varanasi</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm opacity-80">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl p-3 text-center border border-border"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
                {stat.icon}
              </div>
              <p className="font-bold text-foreground text-sm">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Verification Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
            <BadgeCheck className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-success">Verified Farmer</h4>
            <p className="text-sm text-muted-foreground">
              Your identity has been verified. Buyers trust you more!
            </p>
          </div>
        </motion.div>

        {/* Farm Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 border border-border"
        >
          <h3 className="font-bold text-foreground mb-3">Farm Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Farm Type</p>
              <p className="font-semibold text-foreground">Mixed Farming</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Farm Size</p>
              <p className="font-semibold text-foreground">12 Acres</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Main Crops</p>
              <p className="font-semibold text-foreground">Rice, Wheat</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Livestock</p>
              <p className="font-semibold text-foreground">15 Cows</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-xl h-14 text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Profile;
