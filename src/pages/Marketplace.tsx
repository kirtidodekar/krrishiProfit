import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import BuyerCard from "@/components/ui/buyer-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const filters = ["All", "Biofuel", "Compost", "Recycling", "Animal Feed"];

const buyers = [
  {
    id: 1,
    name: "BioFuel Energy Pvt Ltd",
    industry: "Biofuel Production",
    price: 2400,
    unit: "quintal",
    distance: 5,
    demand: "high" as const,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Green Earth Compost",
    industry: "Organic Compost Manufacturing",
    price: 1800,
    unit: "quintal",
    distance: 8,
    demand: "medium" as const,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Agri Recycle Solutions",
    industry: "Agricultural Recycling",
    price: 2100,
    unit: "quintal",
    distance: 12,
    demand: "high" as const,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Farm Fresh Feeds",
    industry: "Animal Feed Production",
    price: 1500,
    unit: "quintal",
    distance: 3,
    demand: "low" as const,
    rating: 4.2,
  },
  {
    id: 5,
    name: "Eco Power Industries",
    industry: "Biomass Power Generation",
    price: 2800,
    unit: "quintal",
    distance: 18,
    demand: "high" as const,
    rating: 4.7,
  },
];

const Marketplace = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch = buyer.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      buyer.industry.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <MobileLayout>
      <AppHeader title="Marketplace" />

      <div className="px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search buyers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-xl"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeFilter === filter
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        {/* Location Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3"
        >
          <MapPin className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Showing buyers near Varanasi
            </p>
            <p className="text-xs text-muted-foreground">
              {filteredBuyers.length} buyers found within 20 km
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary text-xs">
            Change
          </Button>
        </motion.div>

        {/* Buyers List */}
        <div className="space-y-3">
          {filteredBuyers.map((buyer, index) => (
            <motion.div
              key={buyer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BuyerCard
                name={buyer.name}
                industry={buyer.industry}
                price={buyer.price}
                unit={buyer.unit}
                distance={buyer.distance}
                demand={buyer.demand}
                rating={buyer.rating}
                onContact={() => console.log("Contact", buyer.name)}
              />
            </motion.div>
          ))}
        </div>

        {filteredBuyers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No buyers found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Marketplace;
