import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  IndianRupee,
  ChevronRight,
  Loader2,
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import { cn } from "@/lib/utils";
import { useApp } from "../contexts/AppContext";
import { Order } from "../services/api";

const tabs = ["Active", "Completed", "Payments"];

const Orders = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const { orders, loading, error, refreshOrders } = useApp();
  
  // Calculate payment summary
  const totalReceived = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + order.totalPrice, 0);
  
  const pendingAmount = orders
    .filter(o => o.status === 'in-transit')
    .reduce((sum, order) => sum + order.totalPrice, 0);
  
  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "Active")
      return order.status === "pending" || order.status === "in-transit";
    if (activeTab === "Completed") return order.status === "delivered";
    return false; // For payments tab, we handle separately
  });
  
  // Payment-related orders
  const paymentOrders = orders.filter(order => 
    order.status === 'delivered' || order.status === 'in-transit'
  );

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    "in-transit": {
      icon: Truck,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    delivered: {
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    cancelled: {
      icon: Clock,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  };

  if (loading.orders) {
    return (
      <MobileLayout>
        <AppHeader title="Orders & Payments" />
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  if (error.orders) {
    return (
      <MobileLayout>
        <AppHeader title="Orders & Payments" />
        <div className="px-4 py-4">
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center">
            <p className="font-medium text-destructive">Error loading orders</p>
            <p className="text-sm text-destructive/80 mt-1">{error.orders}</p>
            <button 
              onClick={refreshOrders}
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
      <AppHeader title="Orders & Payments" />

      <div className="px-4 py-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-muted p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all",
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Summary Cards for Payments Tab */}
        {activeTab === "Payments" && (
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-success rounded-xl p-4 text-success-foreground"
            >
              <p className="text-sm opacity-80">Total Received</p>
              <p className="text-2xl font-bold">₹{totalReceived.toLocaleString()}</p>
              <p className="text-xs opacity-70 mt-1">Last 30 days</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-gradient-accent rounded-xl p-4 text-accent-foreground"
            >
              <p className="text-sm opacity-80">Pending</p>
              <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</p>
              <p className="text-xs opacity-70 mt-1">{orders.filter(o => o.status === 'in-transit').length} payment(s)</p>
            </motion.div>
          </div>
        )}

        {/* Orders List */}
        {(activeTab === "Active" || activeTab === "Completed") && (
          <div className="space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => {
                const config = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                
                // Find the product to get the name
                const product = { name: order.productName }; // In a real app, we'd fetch product details

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-xl p-4 border border-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            config.bg
                          )}
                        >
                          <Package className={cn("w-5 h-5", config.color)} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {order.quantity} kg
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                          config.bg,
                          config.color
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Buyer</p>
                        <p className="text-sm font-medium text-foreground">
                          {order.buyerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{new Date(order.updatedAt).toLocaleDateString()}</p>
                        <p className="font-bold text-primary">
                          ₹{order.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-semibold text-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start selling your waste to see orders here
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payments List */}
        {activeTab === "Payments" && (
          <div className="space-y-3">
            {paymentOrders.map((order, index) => {
              const config = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              
              // Determine payment status based on order status
              const paymentStatus = order.status === 'delivered' ? 'credited' : 'pending';
              const paymentStatusLabel = order.status === 'delivered' ? 'Received' : 'Pending';
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      paymentStatus === 'credited' ? 'bg-success/10' : 'bg-warning/10'
                    )}
                  >
                    <IndianRupee className={cn("w-6 h-6", paymentStatus === 'credited' ? 'text-success' : 'text-warning')} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">
                        ₹{order.totalPrice.toLocaleString()}
                      </h4>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
                          paymentStatus === 'credited' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        )}
                      >
                        {paymentStatusLabel}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.status === 'delivered' ? 'Bank Transfer' : 'Expected payment'} • {new Date(order.updatedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Order #{order.id}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Orders;
