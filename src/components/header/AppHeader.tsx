import { Bell, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface AppHeaderProps {
  title?: string;
  showNotification?: boolean;
  showLanguage?: boolean;
  notificationCount?: number;
}

const AppHeader = ({
  title = "Krishi Profit",
  showNotification = true,
  showLanguage = true,
  notificationCount = 0,
}: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <span className="text-xl">🌾</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">Waste to Wealth</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showLanguage && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            >
              <Globe className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          )}

          {showNotification && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
