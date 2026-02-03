import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  variant?: "default" | "primary" | "secondary" | "accent";
  className?: string;
}

const StatCard = ({
  icon,
  label,
  value,
  subtext,
  variant = "default",
  className,
}: StatCardProps) => {
  const variants = {
    default: "bg-card border border-border",
    primary: "bg-gradient-primary text-primary-foreground",
    secondary: "bg-gradient-secondary text-secondary-foreground",
    accent: "bg-gradient-accent text-accent-foreground",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-2xl p-4 shadow-card",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            variant === "default"
              ? "bg-primary/10 text-primary"
              : "bg-white/20"
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-80"
            )}
          >
            {label}
          </p>
          <p className="text-2xl font-bold truncate">{value}</p>
          {subtext && (
            <p
              className={cn(
                "text-xs mt-1",
                variant === "default" ? "text-muted-foreground" : "opacity-70"
              )}
            >
              {subtext}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
