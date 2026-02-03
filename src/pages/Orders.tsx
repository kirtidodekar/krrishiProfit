import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  IndianRupee,
  ChevronRight,
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import { cn } from "@/lib/utils";

const tabs = ["Active", "Completed", "Payments"];

const orders = [
  {
    id: "ORD001",
    buyer: "BioFuel Energy Pvt Ltd",
    wasteType: "Rice Straw",
    quantity: "5 quintals",
    amount: 12500,
    status: "in-transit",
    date: "Today, 10:30 AM",
    statusLabel: "In Transit",
  },
  {
    id: "ORD002",
    buyer: "Green Earth Compost",
    wasteType: "Vegetable Waste",
    quantity: "3 quintals",
    amount: 5400,
    status: "pending",
    date: "Yesterday",
    statusLabel: "Pickup Pending",
  },
  {
    id: "ORD003",
    buyer: "Agri Recycle Solutions",
    wasteType: "Wheat Stubble",
    quantity: "8 quintals",
    amount: 16800,
    status: "completed",
    date: "2 days ago",
    statusLabel: "Delivered",
  },
  {
    id: "ORD004",
    buyer: "Farm Fresh Feeds",
    wasteType: "Animal Waste",
    quantity: "10 quintals",
    amount: 15000,
    status: "completed",
    date: "5 days ago",
    statusLabel: "Delivered",
  },
];

const payments = [
  {
    id: "PAY001",
    orderId: "ORD003",
    amount: 16800,
    status: "credited",
    date: "2 days ago",
    method: "Bank Transfer",
  },
  {
    id: "PAY002",
    orderId: "ORD004",
    amount: 15000,
    status: "credited",
    date: "5 days ago",
    method: "UPI",
  },
  {
    id: "PAY003",
    orderId: "ORD001",
    amount: 12500,
    status: "pending",
    date: "Expected in 2 days",
    method: "Bank Transfer",
  },
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState("Active");

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
    completed: {
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    credited: {
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "Active")
      return order.status === "pending" || order.status === "in-transit";
    if (activeTab === "Completed") return order.status === "completed";
    return false;
  });

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
              <p className="text-2xl font-bold">₹31,800</p>
              <p className="text-xs opacity-70 mt-1">Last 30 days</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-gradient-accent rounded-xl p-4 text-accent-foreground"
            >
              <p className="text-sm opacity-80">Pending</p>
              <p className="text-2xl font-bold">₹12,500</p>
              <p className="text-xs opacity-70 mt-1">1 payment</p>
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
                            {order.wasteType}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {order.quantity}
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
                        {order.statusLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Buyer</p>
                        <p className="text-sm font-medium text-foreground">
                          {order.buyer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                        <p className="font-bold text-primary">
                          ₹{order.amount.toLocaleString()}
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
            {payments.map((payment, index) => {
              const config = statusConfig[payment.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      config.bg
                    )}
                  >
                    <IndianRupee className={cn("w-6 h-6", config.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">
                        ₹{payment.amount.toLocaleString()}
                      </h4>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
                          config.bg,
                          config.color
                        )}
                      >
                        {payment.status === "credited" ? "Received" : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • {payment.date}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Order #{payment.orderId}
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
