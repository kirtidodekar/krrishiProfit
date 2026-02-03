import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import StatCard from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";

const earningsData = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 18000 },
  { month: "Mar", value: 15000 },
  { month: "Apr", value: 25000 },
  { month: "May", value: 32000 },
  { month: "Jun", value: 28000 },
];

const wasteBreakdown = [
  { type: "Crop Residue", percentage: 45, color: "bg-primary" },
  { type: "Animal Waste", percentage: 30, color: "bg-secondary" },
  { type: "Vegetable Waste", percentage: 15, color: "bg-accent" },
  { type: "Fruit Waste", percentage: 10, color: "bg-success" },
];

const aiRecommendations = [
  {
    title: "Rice Straw Demand Up",
    description: "Biofuel companies paying 20% more. Consider listing soon.",
    trend: "+20%",
    positive: true,
  },
  {
    title: "New Buyer in Area",
    description: "Eco Compost opened 10 km away. High demand for vegetable waste.",
    trend: "New",
    positive: true,
  },
  {
    title: "Price Drop Alert",
    description: "Wheat stubble prices down due to oversupply. Hold if possible.",
    trend: "-12%",
    positive: false,
  },
];

const Analytics = () => {
  return (
    <MobileLayout>
      <AppHeader title="Analytics" />

      <div className="px-4 py-4 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="This Month"
            value="₹28,400"
            subtext="+15% vs last month"
            variant="primary"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Total Sold"
            value="45 Qtl"
            subtext="Across 12 orders"
          />
        </div>

        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 border border-border shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground">Monthly Earnings</h3>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1 text-success text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +18%
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(142 45% 35%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(142 45% 35%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(30 15% 40%)", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(30 20% 85%)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Earnings"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(142 45% 35%)"
                  strokeWidth={3}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Waste Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 border border-border shadow-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Waste-to-Profit</h3>
          </div>

          <div className="space-y-3">
            {wasteBreakdown.map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{item.type}</span>
                  <span className="text-muted-foreground">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-foreground">AI Recommendations</h3>
          </div>

          <div className="space-y-3">
            {aiRecommendations.map((rec, index) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-card rounded-xl p-4 border border-border flex items-start gap-3"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold",
                    rec.positive
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {rec.positive ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{rec.title}</h4>
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full",
                        rec.positive
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {rec.trend}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rec.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground mt-2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Analytics;
