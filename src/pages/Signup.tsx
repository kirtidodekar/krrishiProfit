import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  Mic,
  Tractor,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VoiceButton from "@/components/ui/voice-button";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "farmer",
    icon: <Tractor className="w-8 h-8" />,
    emoji: "👨‍🌾",
    title: "I'm a Farmer",
    description: "Sell agricultural waste and earn money",
  },
  {
    id: "buyer",
    icon: <Building2 className="w-8 h-8" />,
    emoji: "🏭",
    title: "I'm a Buyer",
    description: "Buy agricultural waste for processing",
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    role: "",
  });
  const [locationDetected, setLocationDetected] = useState(false);

  const totalSteps = 4;

  const handleDetectLocation = () => {
    // Simulate location detection
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        location: "Village Rampur, District Varanasi, UP",
      }));
      setLocationDetected(true);
    }, 1000);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete registration
      navigate("/home");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.role !== "";
      case 2:
        return formData.name.length >= 2;
      case 3:
        return formData.phone.length >= 10;
      case 4:
        return formData.location !== "";
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-gradient-primary px-6 pt-8 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="flex items-center gap-2 text-primary-foreground/80 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">
            Create Account
          </h1>
          <p className="text-primary-foreground/80 mb-4">
            Step {step} of {totalSteps}
          </p>

          {/* Progress Bar */}
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all",
                  i < step ? "bg-white" : "bg-white/30"
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 -mt-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-lg p-6 min-h-[400px] flex flex-col"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Who are you?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Select your role to get started
                </p>

                <div className="space-y-3">
                  {roles.map((role) => (
                    <motion.button
                      key={role.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: role.id }))
                      }
                      className={cn(
                        "w-full p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all",
                        formData.role === role.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-16 h-16 rounded-xl flex items-center justify-center text-3xl",
                          formData.role === role.id
                            ? "bg-primary/10"
                            : "bg-muted"
                        )}
                      >
                        {role.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg">
                          {role.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                      {formData.role === role.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Name */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h2 className="text-xl font-bold text-foreground mb-2">
                  What's your name?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Enter your full name as per records
                </p>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="pl-12 h-14 rounded-xl text-lg"
                      />
                    </div>
                    <VoiceButton
                      onVoiceInput={(text) =>
                        setFormData((prev) => ({ ...prev, name: text }))
                      }
                    />
                  </div>

                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Tap mic to speak your name
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Phone */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Your phone number
                </h2>
                <p className="text-muted-foreground mb-6">
                  We'll send OTP to verify your number
                </p>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="h-14 px-4 bg-muted rounded-xl flex items-center">
                      <span className="text-lg font-medium text-foreground">
                        +91
                      </span>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type="tel"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value.slice(0, 10),
                          }))
                        }
                        className="h-14 rounded-xl text-lg"
                        maxLength={10}
                      />
                    </div>
                    <VoiceButton
                      onVoiceInput={(text) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: text.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                    />
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                    <p className="text-sm text-foreground">
                      📱 A 6-digit OTP will be sent to this number for
                      verification
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Your location
                </h2>
                <p className="text-muted-foreground mb-6">
                  Helps buyers find you easily
                </p>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleDetectLocation}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all",
                      locationDetected
                        ? "border-success bg-success/5"
                        : "border-primary border-dashed bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        locationDetected ? "bg-success/20" : "bg-primary/10"
                      )}
                    >
                      {locationDetected ? (
                        <Check className="w-6 h-6 text-success" />
                      ) : (
                        <MapPin className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      {locationDetected ? (
                        <>
                          <p className="font-semibold text-success">
                            Location Detected
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formData.location}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-primary">
                            Auto-detect Location
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Tap to detect your farm location
                          </p>
                        </>
                      )}
                    </div>
                  </motion.button>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Or enter manually"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="pl-12 h-14 rounded-xl"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Button */}
          <div className="mt-auto pt-6">
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-primary hover:opacity-90"
            >
              {step === totalSteps ? "Create Account" : "Continue"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-6"
        >
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-bold"
            >
              Login
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
