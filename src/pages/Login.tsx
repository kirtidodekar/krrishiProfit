import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Mic,
  Fingerprint
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VoiceButton from "@/components/ui/voice-button";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleLogin = () => {
    // Simulate login
    navigate("/home");
  };

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setOtpSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-gradient-primary px-6 pt-12 pb-16 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">
            Welcome Back!
          </h1>
          <p className="text-primary-foreground/80 mt-1">
            Login to Krishi Profit
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-lg p-6 space-y-5"
        >
          {/* Login Method Toggle */}
          <div className="flex gap-2 bg-muted p-1 rounded-xl">
            <button
              onClick={() => {
                setLoginMethod("password");
                setOtpSent(false);
              }}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                loginMethod === "password"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              Password
            </button>
            <button
              onClick={() => setLoginMethod("otp")}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                loginMethod === "otp"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              OTP Login
            </button>
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-12 h-14 rounded-xl text-lg"
                />
              </div>
              <VoiceButton
                onVoiceInput={(text) => setPhone(text.replace(/\D/g, ""))}
                className="shrink-0"
              />
            </div>
          </div>

          {/* Password or OTP */}
          {loginMethod === "password" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 rounded-xl text-lg"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              <button className="text-sm text-primary font-medium">
                Forgot Password?
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {!otpSent ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSendOtp}
                  disabled={phone.length < 10}
                  className="w-full h-14 rounded-xl"
                >
                  Send OTP to Phone
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-foreground">
                    Enter 6-digit OTP
                  </label>
                  <Input
                    type="text"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    className="h-14 rounded-xl text-2xl text-center tracking-[0.5em]"
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    OTP sent to +91 {phone.slice(0, 5)}*****
                  </p>
                  <button 
                    onClick={() => setOtpSent(false)}
                    className="text-sm text-primary font-medium block mx-auto"
                  >
                    Resend OTP
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Login Button */}
          <Button
            size="lg"
            onClick={handleLogin}
            disabled={
              !phone ||
              (loginMethod === "password" && !password) ||
              (loginMethod === "otp" && (!otpSent || otp.length < 6))
            }
            className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-primary hover:opacity-90"
          >
            Login
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Biometric Login */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 rounded-xl border-2 border-border flex items-center justify-center gap-3 text-foreground font-semibold"
          >
            <Fingerprint className="w-6 h-6 text-primary" />
            Login with Fingerprint
          </motion.button>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-6"
        >
          <p className="text-muted-foreground">
            New to Krishi Profit?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary font-bold"
            >
              Create Account
            </button>
          </p>
        </motion.div>

        {/* Back to Landing */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate("/")}
          className="w-full text-center text-sm text-muted-foreground pb-6"
        >
          ← Back to Home
        </motion.button>
      </div>
    </div>
  );
};

export default Login;
