import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Lightbulb,
  ArrowRight,
  Loader2,
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
import { useApp } from "../contexts/AppContext";
import { Order, Product } from "../services/api";
import { useEffect, useState } from "react";

const Analytics = () => {
  const { orders, products, loading, error, refreshOrders, refreshProducts } = useApp();
  const [analyticsData, setAnalyticsData] = useState({
    monthlyEarnings: [] as { month: string; value: number }[],
    wasteBreakdown: [] as { type: string; percentage: number; color: string; count: number }[],
    aiRecommendations: [] as {
      title: string;
      description: string;
      trend: string;
      positive: boolean;
    }[],
    summaryStats: {
      thisMonthEarnings: 0,
      totalSold: 0,
      ordersCount: 0,
      avgOrderValue: 0,
    }
  });
  
  useEffect(() => {
    // Calculate analytics data
    const calculateAnalytics = () => {
      // Calculate monthly earnings from orders
      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      
      // Group orders by month for the last 6 months
      const monthlyOrders = {};
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= sixMonthsAgo) {
          const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
          if (!monthlyOrders[monthKey]) {
            monthlyOrders[monthKey] = 0;
          }
          monthlyOrders[monthKey] += order.totalPrice;
        }
      });
      
      // Create array of last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
        const monthName = monthDate.toLocaleString('default', { month: 'short' });
        months.push({
          month: monthName,
          value: monthlyOrders[monthKey] || 0
        });
      }
      
      // Calculate waste breakdown from products
      const categoryCounts: Record<string, number> = {};
      products.forEach(product => {
        if (categoryCounts[product.category]) {
          categoryCounts[product.category]++;
        } else {
          categoryCounts[product.category] = 1;
        }
      });
      
      const totalProducts = products.length;
      const wasteBreakdown = Object.entries(categoryCounts).map(([category, count]) => {
        const percentage = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
        
        // Map categories to display names and colors
        const categoryDisplayNames: Record<string, string> = {
          'wheat-straw': 'Wheat Straw',
          'rice-husk': 'Rice Husk',
          'corn-stover': 'Corn Stover',
          'sugarcane-bagasse': 'Sugarcane Bagasse',
          'cotton-stalks': 'Cotton Stalks',
          'other': 'Other Waste',
        };
        
        const displayName = categoryDisplayNames[category] || category;
        
        const colorMap: Record<string, string> = {
          'wheat-straw': 'bg-primary',
          'rice-husk': 'bg-secondary',
          'corn-stover': 'bg-accent',
          'sugarcane-bagasse': 'bg-success',
          'cotton-stalks': 'bg-warning',
          'other': 'bg-muted',
        };
        
        return {
          type: displayName,
          percentage,
          color: colorMap[category] || 'bg-muted',
          count
        };
      });
      
      // Calculate summary stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });
      
      const thisMonthEarnings = thisMonthOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      const totalSold = orders.reduce((sum, order) => sum + order.quantity, 0);
      const avgOrderValue = thisMonthOrders.length > 0 
        ? thisMonthOrders.reduce((sum, order) => sum + order.totalPrice, 0) / thisMonthOrders.length
        : 0;
      
      // Generate AI recommendations based on data
      const recommendations = [];
      
      // Check if there are any pending orders
      const pendingOrders = orders.filter(o => o.status === 'pending');
      if (pendingOrders.length > 0) {
        recommendations.push({
          title: "Action Required",
          description: `You have ${pendingOrders.length} pending order(s) to review.`,
          trend: "New",
          positive: true,
        });
      }
      
      // Check for high-demand categories
      const highDemandCategories = Object.entries(categoryCounts)
        .filter(([_, count]) => count > 2) // Categories with more than 2 products
        .map(([category, _]) => category);
      
      if (highDemandCategories.length > 0) {
        recommendations.push({
          title: `${highDemandCategories[0]} Demand High`,
          description: `More buyers are looking for ${highDemandCategories[0]}. Consider listing more.`,
          trend: "+15%",
          positive: true,
        });
      }
      
      // Check for price trends
      const avgPricePerKg = products.length > 0 
        ? products.reduce((sum, product) => sum + product.pricePerKg, 0) / products.length
        : 0;
      
      if (avgPricePerKg > 3) {
        recommendations.push({
          title: "Premium Pricing Opportunity",
          description: `Your average price is ₹${avgPricePerKg.toFixed(2)}/kg. Market is favorable for premium pricing.`,
          trend: "+20%",
          positive: true,
        });
      }
      
      setAnalyticsData({
        monthlyEarnings: months,
        wasteBreakdown,
        aiRecommendations: recommendations,
        summaryStats: {
          thisMonthEarnings,
          totalSold,
          ordersCount: orders.length,
          avgOrderValue: parseFloat(avgOrderValue.toFixed(2))
        }
      });
    };
    
    calculateAnalytics();
  }, [orders, products]);
  
  if (loading.orders || loading.products) {
    return (
      <MobileLayout>
        <AppHeader title="Analytics" />
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  if (error.orders || error.products) {
    return (
      <MobileLayout>
        <AppHeader title="Analytics" />
        <div className="px-4 py-4">
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center">
            <p className="font-medium text-destructive">Error loading analytics</p>
            <p className="text-sm text-destructive/80 mt-1">{error.orders || error.products}</p>
            <button 
              onClick={() => { refreshOrders(); refreshProducts(); }}
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
      <AppHeader title="Analytics" />

      <div className="px-4 py-4 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="This Month"
            value={`₹${analyticsData.summaryStats.thisMonthEarnings.toLocaleString()}`}
            subtext={`${orders.length} orders this month`}
            variant="primary"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Avg. Order Value"
            value={`₹${analyticsData.summaryStats.avgOrderValue.toLocaleString()}`}
            subtext={`Across ${orders.length} orders`}
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
              {analyticsData.monthlyEarnings.length > 1 
                ? `${Math.round(((analyticsData.monthlyEarnings[analyticsData.monthlyEarnings.length - 1].value - analyticsData.monthlyEarnings[0].value) / analyticsData.monthlyEarnings[0].value) * 100)}%`
                : '0%'}
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.monthlyEarnings}>
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
            <h3 className="font-bold text-foreground">Waste Breakdown</h3>
          </div>

          <div className="space-y-3">
            {analyticsData.wasteBreakdown.map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{item.type}</span>
                  <span className="text-muted-foreground">{item.percentage}% ({item.count})</span>
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
            {analyticsData.aiRecommendations.length > 0 ? (
              analyticsData.aiRecommendations.map((rec, index) => (
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
              ))
            ) : (
              <div className="bg-card rounded-xl p-4 border border-border text-center">
                <p className="text-muted-foreground">No recommendations at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Analytics;
