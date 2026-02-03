import { Bell, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../contexts/AppContext";
import { useState } from "react";
import { X } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  showNotification?: boolean;
  showLanguage?: boolean;
  notificationCount?: number;
  showBack?: boolean;
  onBack?: () => void;
}

const AppHeader = ({
  title = "Krishi Profit",
  showNotification = true,
  showLanguage = true,
  notificationCount = 0,
  showBack = false,
  onBack,
}: AppHeaderProps) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  
  // Calculate unread notifications if not provided
  const unreadCount = notificationCount || notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {showBack && onBack ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            >
              <span className="text-lg">←</span>
            </motion.button>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-xl">🌾</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">{title}</h1>
                <p className="text-xs text-muted-foreground">Waste to Wealth</p>
              </div>
            </>
          )}
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
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="relative w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </motion.button>
              
              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotificationsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-12 right-0 bg-card border border-border rounded-xl shadow-lg z-50 w-80 max-h-96 overflow-y-auto"
                  >
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">Notifications</h3>
                        <button 
                          onClick={() => {
                            markAllNotificationsAsRead();
                            setShowNotificationsDropdown(false);
                          }}
                          className="text-xs text-primary font-semibold"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-border">
                      {notifications.slice(0, 10).map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 cursor-pointer ${!notification.read ? 'bg-muted' : ''}`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-primary' : 'bg-transparent'}`} />
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      {notifications.length === 0 ? 'No notifications' : ''}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;