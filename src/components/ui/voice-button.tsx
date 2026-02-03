import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface VoiceButtonProps {
  onVoiceInput?: (text: string) => void;
  className?: string;
}

const VoiceButton = ({ onVoiceInput, className }: VoiceButtonProps) => {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    setIsListening(!isListening);
    // Voice input simulation - in production, connect to Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        onVoiceInput?.("Sample voice input");
      }, 2000);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn(
        "relative w-14 h-14 rounded-full flex items-center justify-center transition-all",
        isListening
          ? "bg-destructive text-destructive-foreground"
          : "bg-primary/10 text-primary",
        className
      )}
    >
      {isListening ? (
        <>
          <MicOff className="w-6 h-6" />
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 rounded-full bg-destructive/20"
          />
        </>
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </motion.button>
  );
};

export default VoiceButton;
