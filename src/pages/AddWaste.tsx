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
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import VoiceButton from "@/components/ui/voice-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const wasteTypes = [
  { id: "crop", label: "Crop Residue", icon: "🌾", examples: "Rice straw, wheat stubble" },
  { id: "animal", label: "Animal Waste", icon: "🐄", examples: "Cow dung, poultry litter" },
  { id: "vegetable", label: "Vegetable Waste", icon: "🥬", examples: "Spoiled vegetables, peels" },
  { id: "fruit", label: "Fruit Waste", icon: "🍎", examples: "Rotten fruits, seeds" },
];

const AddWaste = () => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showPricePrediction, setShowPricePrediction] = useState(false);

  const handlePhotoUpload = () => {
    setHasPhoto(true);
  };

  const handleGetPrice = () => {
    setShowPricePrediction(true);
  };

  const predictedPrice = {
    min: 1800,
    max: 2400,
    recommended: 2100,
    trend: "+8%",
  };

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
                {wasteTypes.map((type) => (
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
                        Village Rampur, District Varanasi
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
                  disabled={!quantity}
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
                    <span className="text-lg font-normal opacity-80">/quintal</span>
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
                    {wasteTypes.find((t) => t.id === selectedType)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{quantity} quintals</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Total Value</span>
                  <span className="font-bold text-primary">
                    ₹{(Number(quantity) * predictedPrice.recommended).toLocaleString()}
                  </span>
                </div>
              </div>

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
                >
                  <Upload className="w-5 h-5 mr-2" />
                  List for Sale
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
