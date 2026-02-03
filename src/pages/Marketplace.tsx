import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, X, Wheat, Loader2 } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import BuyerCard from "@/components/ui/buyer-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "../contexts/AppContext";
import { Product } from "../services/api";

const filters = ["All", "wheat-straw", "rice-husk", "corn-stover", "sugarcane-bagasse", "cotton-stalks", "other"];

const Marketplace = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { products, loading, error, refreshProducts, searchProducts, getProductsByCategory } = useApp();
  
  // Filter products based on active filter and search query
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      product.category === activeFilter;
    return matchesSearch && matchesFilter;
  });
  
  // Handle filter changes
  useEffect(() => {
    if (activeFilter !== "All") {
      getProductsByCategory(activeFilter as Product['category']).catch(console.error);
    } else {
      refreshProducts().catch(console.error);
    }
  }, [activeFilter]);
  
  // Handle search
  useEffect(() => {
    if (searchQuery) {
      searchProducts(searchQuery).catch(console.error);
    } else {
      refreshProducts().catch(console.error);
    }
  }, [searchQuery]);

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

        {/* Loading State */}
        {loading.products && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error.products && (
          <div className="text-center py-12">
            <p className="font-semibold text-destructive">Error loading products</p>
            <p className="text-sm text-destructive/80 mt-1">{error.products}</p>
            <Button 
              onClick={refreshProducts}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Location Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3"
        >
          <MapPin className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Showing products near Varanasi
            </p>
            <p className="text-xs text-muted-foreground">
              {filteredProducts.length} products found
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary text-xs">
            Change
          </Button>
        </motion.div>

        {/* Products List */}
        <div className="space-y-3">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Wheat className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-foreground">{product.name}</h3>
                      {product.verified && (
                        <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{product.pricePerKg}/kg</p>
                    <p className="text-xs text-muted-foreground">{product.quantity} {product.unit} available</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex-1"></div>
                  <Button 
                    size="sm" 
                    onClick={() => console.log('Contact farmer:', product.farmerName)}
                    className="h-7 text-xs"
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading.products && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No products found</p>
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
