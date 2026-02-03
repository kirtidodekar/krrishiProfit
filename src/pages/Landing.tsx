import { motion } from "framer-motion";
import { 
  Leaf, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ChevronRight,
  Mic,
  Globe,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Earn More",
    description: "Get AI-powered fair prices for your agricultural waste",
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Reduce Waste",
    description: "Turn crop residue into valuable resources",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Direct Buyers",
    description: "Connect with biofuel & compost companies nearby",
  },
];

const features = [
  { icon: <Sparkles className="w-5 h-5" />, label: "AI Pricing" },
  { icon: <Mic className="w-5 h-5" />, label: "Voice Input" },
  { icon: <Globe className="w-5 h-5" />, label: "Local Language" },
  { icon: <ShieldCheck className="w-5 h-5" />, label: "Verified Buyers" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-primary px-6 pt-12 pb-20 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

        {/* Language Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end mb-6"
        >
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-primary-foreground text-sm">
            <Globe className="w-4 h-4" />
            <span>English</span>
          </button>
        </motion.div>

        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center relative z-10"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-5xl">🌾</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Krishi Profit
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Waste to Wealth
          </p>
        </motion.div>

        {/* Illustration Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 text-6xl">
            <span>👨‍🌾</span>
            <ChevronRight className="w-8 h-8 text-primary-foreground/60" />
            <span>🌿</span>
            <ChevronRight className="w-8 h-8 text-primary-foreground/60" />
            <span>💰</span>
          </div>
          <p className="text-primary-foreground/90 mt-4 text-lg font-medium">
            Turn Your Farm Waste Into Profit
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-8 relative z-10">
        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl shadow-lg p-4 mb-6"
        >
          <div className="grid grid-cols-4 gap-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex flex-col items-center gap-1 p-2"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground text-center">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 text-center">
            Why Farmers Choose Us
          </h2>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-card rounded-xl p-4 border border-border flex items-start gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-secondary rounded-2xl p-5 mb-8 text-secondary-foreground"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-xs opacity-80">Farmers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">₹2Cr+</p>
              <p className="text-xs opacity-80">Earned</p>
            </div>
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs opacity-80">Buyers</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3 pb-8"
        >
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-primary hover:opacity-90"
          >
            Get Started Free
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full h-14 rounded-xl text-lg font-semibold border-2"
          >
            Already have an account? Login
          </Button>
        </motion.div>

        {/* Trust Badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center text-sm text-muted-foreground pb-6"
        >
          🔒 Trusted by 10,000+ farmers across India
        </motion.p>
      </div>
    </div>
  );
};

export default Landing;
