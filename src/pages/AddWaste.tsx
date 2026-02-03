import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  MapPin,
  Check,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import VoiceButton from "@/components/ui/voice-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const wasteCategories = [
  { id: "wheat-straw", label: "Wheat Straw", icon: "🌾", examples: "Wheat stubble, straw" },
  { id: "rice-husk", label: "Rice Husk", icon: "🌾", examples: "Rice hulls, chaff" },
  { id: "corn-stover", label: "Corn Stover", icon: "🌽", examples: "Corn stalks, leaves" },
  { id: "sugarcane-bagasse", label: "Sugarcane Bagasse", icon: "🌱", examples: "Crushed sugarcane residue" },
  { id: "cotton-stalks", label: "Cotton Stalks", icon: "🌿", examples: "Cotton plant residues" },
  { id: "other", label: "Other Waste", icon: "🍃", examples: "Any other agricultural waste" },
];

const AddWaste = () => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Village Rampur, District Varanasi, UP");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showPricePrediction, setShowPricePrediction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { createProduct } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePhotoUpload = () => {
    setHasPhoto(true);
  };

  const handleGetPrice = () => {
    // Simple price prediction based on waste type and quantity
    const basePrices: Record<string, number> = {
      "wheat-straw": 2.5,
      "rice-husk": 1.8,
      "corn-stover": 3.0,
      "sugarcane-bagasse": 2.0,
      "cotton-stalks": 2.2,
      "other": 1.5,
    };
    
    const basePrice = basePrices[selectedType || "other"] || 2.0;
    const predictedPrice = {
      min: parseFloat((basePrice * 0.8).toFixed(2)),
      max: parseFloat((basePrice * 1.2).toFixed(2)),
      recommended: parseFloat(basePrice.toFixed(2)),
      trend: "+5%",
    };
    
    setPricePerKg(predictedPrice.recommended.toString());
    setShowPricePrediction(true);
    return predictedPrice;
  };

  const handleSubmitListing = async () => {
    if (!user) {
      setSubmissionError("You must be logged in to create a listing");
      return;
    }
    
    if (!selectedType || !quantity || !pricePerKg || !description || !location) {
      setSubmissionError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      const productData = {
        name: wasteCategories.find(c => c.id === selectedType)?.label || "Agricultural Waste",
        category: selectedType as any,
        quantity: parseInt(quantity) * 100, // Convert quintals to kg
        pricePerKg: parseFloat(pricePerKg),
        unit: 'kg' as const, // Use 'as const' to make it a literal type
        location,
        description,
        available: true,
      };
      
      await createProduct(productData);
      
      // Reset form and navigate
      setStep(1);
      setSelectedType(null);
      setQuantity("");
      setPricePerKg("");
      setDescription("");
      setHasPhoto(false);
      setShowPricePrediction(false);
      
      navigate("/home");
    } catch (error) {
      console.error("Error creating product:", error);
      setSubmissionError(error instanceof Error ? error.message : "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate predicted price for display
  const calculatePredictedPrice = () => {
    const basePrices: Record<string, number> = {
      "wheat-straw": 2.5,
      "rice-husk": 1.8,
      "corn-stover": 3.0,
      "sugarcane-bagasse": 2.0,
      "cotton-stalks": 2.2,
      "other": 1.5,
    };
    
    const basePrice = basePrices[selectedType || "other"] || 2.0;
    return {
      min: parseFloat((basePrice * 0.8).toFixed(2)),
      max: parseFloat((basePrice * 1.2).toFixed(2)),
      recommended: parseFloat(basePrice.toFixed(2)),
      trend: "+5%",
    };
  };

  const predictedPrice = calculatePredictedPrice();

  return (
    <MobileLayout>
      <AppHeader title="Add Waste" />

      <div className="px-4 py-4 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center gap-2 px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  step >= s
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={cn(
                    "flex-1 h-1 rounded-full transition-all",
                    step > s ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Photo Upload */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Upload Photo</h2>
                <p className="text-muted-foreground text-sm">
                  Take a clear photo of your agricultural waste
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePhotoUpload}
                className={cn(
                  "w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all",
                  hasPhoto
                    ? "bg-success/10 border-success"
                    : "bg-muted/50 border-border hover:border-primary"
                )}
              >
                {hasPhoto ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-success" />
                    </div>
                    <p className="font-semibold text-success">Photo Added!</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground">Tap to Take Photo</p>
                    <p className="text-sm text-muted-foreground">or upload from gallery</p>
                  </>
                )}
              </motion.button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-14"
                  onClick={handlePhotoUpload}
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Gallery
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-14"
                  onClick={handlePhotoUpload}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Camera
                </Button>
              </div>

              <Button
                size="lg"
                className="w-full rounded-xl h-14 bg-gradient-primary"
                onClick={() => setStep(2)}
                disabled={!hasPhoto}
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Waste Type Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Waste Type</h2>
                <p className="text-muted-foreground text-sm">
                  Select the type of agricultural waste
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {wasteCategories.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all",
                      selectedType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <h4 className="font-bold text-foreground">{type.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {type.examples}
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-14"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1 rounded-xl h-14 bg-gradient-primary"
                  onClick={() => setStep(3)}
                  disabled={!selectedType}
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Quantity & Location */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Details</h2>
                <p className="text-muted-foreground text-sm">
                  Enter quantity and confirm location
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Quantity (in quintals)
                  </label>
                  <div className="flex gap-3 items-center">
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="flex-1 h-14 rounded-xl text-lg"
                    />
                    <VoiceButton
                      onVoiceInput={(text) => setQuantity(text)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Price per kg (₹)
                  </label>
                  <div className="flex gap-3 items-center">
                    <Input
                      type="number"
                      placeholder="Enter price per kg"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(e.target.value)}
                      className="flex-1 h-14 rounded-xl text-lg"
                    />
                    <VoiceButton
                      onVoiceInput={(text) => setPricePerKg(text)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <Input
                    type="text"
                    placeholder="Describe your waste (quality, condition, etc.)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-14 rounded-xl text-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Pickup Location
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full p-4 rounded-xl border border-border bg-card flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">Auto-detected</p>
                      <p className="text-sm text-muted-foreground">
                        {location}
                      </p>
                    </div>
                    <Check className="w-5 h-5 text-success" />
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-14"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1 rounded-xl h-14 bg-gradient-primary"
                  onClick={() => {
                    setStep(4);
                    handleGetPrice();
                  }}
                  disabled={!quantity || !pricePerKg || !description}
                >
                  Get AI Price
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: AI Price Prediction */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">AI Price Suggestion</h2>
                <p className="text-muted-foreground text-sm">
                  Based on market analysis & demand
                </p>
              </div>

              {showPricePrediction && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-primary rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="text-primary-foreground/80 text-sm mb-2">
                    Recommended Price
                  </p>
                  <p className="text-4xl font-bold text-primary-foreground mb-2">
                    ₹{predictedPrice.recommended}
                    <span className="text-lg font-normal opacity-80">/kg</span>
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="opacity-80">Market range:</span>
                    <span className="font-semibold">
                      ₹{predictedPrice.min} - ₹{predictedPrice.max}
                    </span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                    <span className="text-success font-semibold">{predictedPrice.trend}</span>
                    <span className="opacity-80">vs last week</span>
                  </div>
                </motion.div>
              )}

              <div className="bg-card rounded-xl p-4 border border-border space-y-3">
                <h4 className="font-semibold text-foreground">Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Waste Type</span>
                  <span className="font-medium">
                    {wasteCategories.find((t) => t.id === selectedType)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{quantity} quintals ({parseInt(quantity) * 100} kg)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price/kg</span>
                  <span className="font-medium">₹{pricePerKg}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Total Value</span>
                  <span className="font-bold text-primary">
                    ₹{(parseInt(quantity) * 100 * parseFloat(pricePerKg || "0")).toLocaleString()}
                  </span>
                </div>
              </div>

              {submissionError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-center">
                  <p className="text-sm text-destructive">{submissionError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl h-14"
                  onClick={() => setStep(3)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1 rounded-xl h-14 bg-gradient-success"
                  onClick={handleSubmitListing}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Listing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      List for Sale
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
};

export default AddWaste;
