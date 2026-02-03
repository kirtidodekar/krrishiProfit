import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ActionButton = ({
  icon,
  label,
  onClick,
  variant = "default",
  size = "md",
  className,
}: ActionButtonProps) => {
  const variants = {
    default: "bg-card border border-border text-foreground hover:bg-muted",
    primary: "bg-gradient-primary text-primary-foreground shadow-md",
    secondary: "bg-gradient-secondary text-secondary-foreground shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
  };

  const sizes = {
    sm: "p-3 min-w-[80px]",
    md: "p-4 min-w-[100px]",
    lg: "p-5 min-w-[120px]",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl transition-all",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <div className={iconSizes[size]}>{icon}</div>
      <span className="text-sm font-semibold text-center">{label}</span>
    </motion.button>
  );
};

export default ActionButton;
