import { motion } from "framer-motion";
import { MapPin, TrendingUp, Star, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface BuyerCardProps {
  name: string;
  industry: string;
  price: number;
  unit: string;
  distance: number;
  demand: "high" | "medium" | "low";
  rating: number;
  className?: string;
  onContact?: () => void;
}

const BuyerCard = ({
  name,
  industry,
  price,
  unit,
  distance,
  demand,
  rating,
  className,
  onContact,
}: BuyerCardProps) => {
  const demandColors = {
    high: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
    low: "bg-muted text-muted-foreground",
  };

  const demandLabels = {
    high: "High Demand",
    medium: "Medium",
    low: "Low",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "bg-card rounded-2xl p-4 border border-border shadow-card",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-foreground text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{industry}</p>
        </div>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
            demandColors[demand]
          )}
        >
          <TrendingUp className="w-3 h-3" />
          {demandLabels[demand]}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{distance} km</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-warning">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium">{rating}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Offered Price</p>
          <p className="text-xl font-bold text-primary">
            ₹{price}
            <span className="text-sm font-normal text-muted-foreground">
              /{unit}
            </span>
          </p>
        </div>
        <Button
          variant="default"
          size="lg"
          onClick={onContact}
          className="rounded-xl bg-gradient-primary hover:opacity-90"
        >
          <Phone className="w-4 h-4 mr-2" />
          Contact
        </Button>
      </div>
    </motion.div>
  );
};

export default BuyerCard;
