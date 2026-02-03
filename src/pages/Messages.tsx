import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  X, 
  User, 
  Check, 
  CheckCheck,
  Phone,
  MapPin,
  Calendar,
  Loader2
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import AppHeader from "@/components/header/AppHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";

// Mock message data structure
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'farmer' | 'buyer';
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

const Messages = () => {
  const { user } = useAuth();
  const { orders } = useApp();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock conversations data - in real app, this would come from API
  useEffect(() => {
    // Generate mock conversations based on orders
    const mockConversations: Conversation[] = [
      {
        id: "conv1",
        buyerId: "buyer1",
        buyerName: "Rajesh Kumar",
        buyerCompany: "BioFuel Corp",
        lastMessage: "Hi, I'm interested in your wheat straw listing",
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        unreadCount: 2,
        messages: [
          {
            id: "msg1",
            senderId: "buyer1",
            senderName: "Rajesh Kumar",
            senderRole: "buyer",
            content: "Hi, I'm interested in your wheat straw listing. What's the current price?",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true
          },
          {
            id: "msg2",
            senderId: "farmer1",
            senderName: user?.displayName || "Farmer",
            senderRole: "farmer",
            content: "Hello Rajesh! The current price is ₹2,500 per quintal. Still available!",
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
            read: true
          },
          {
            id: "msg3",
            senderId: "buyer1",
            senderName: "Rajesh Kumar",
            senderRole: "buyer",
            content: "Great! Can you deliver 10 quintals by next week?",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            read: false
          },
          {
            id: "msg4",
            senderId: "buyer1",
            senderName: "Rajesh Kumar",
            senderRole: "buyer",
            content: "Also, can you share the quality details?",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            read: false
          }
        ]
      },
      {
        id: "conv2",
        buyerId: "buyer2",
        buyerName: "Priya Sharma",
        buyerCompany: "Green Compost Solutions",
        lastMessage: "Thanks for the quick response!",
        lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        unreadCount: 0,
        messages: [
          {
            id: "msg5",
            senderId: "buyer2",
            senderName: "Priya Sharma",
            senderRole: "buyer",
            content: "Hello! I saw your rice husk listing. Is it still available?",
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            read: true
          },
          {
            id: "msg6",
            senderId: "farmer1",
            senderName: user?.displayName || "Farmer",
            senderRole: "farmer",
            content: "Yes, 500 kg available. Price is ₹1,800 per quintal.",
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
            read: true
          },
          {
            id: "msg7",
            senderId: "buyer2",
            senderName: "Priya Sharma",
            senderRole: "buyer",
            content: "Thanks for the quick response!",
            timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
            read: true
          }
        ]
      }
    ];
    
    setConversations(mockConversations);
    if (mockConversations.length > 0) {
      setActiveConversation(mockConversations[0]);
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const message: Message = {
        id: `msg${Date.now()}`,
        senderId: user?.uid || "farmer1",
        senderName: user?.displayName || "Farmer",
        senderRole: "farmer",
        content: newMessage,
        timestamp: new Date(),
        read: false
      };
      
      // Update conversation
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            lastMessage: newMessage,
            lastMessageTime: new Date(),
            messages: [...conv.messages, message]
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      setActiveConversation({
        ...activeConversation,
        lastMessage: newMessage,
        lastMessageTime: new Date(),
        messages: [...activeConversation.messages, message]
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const markAsRead = (conversationId: string) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        // Mark all messages as read
        const updatedMessages = conv.messages.map(msg => ({
          ...msg,
          read: msg.senderRole === 'farmer' ? msg.read : true
        }));
        
        return {
          ...conv,
          unreadCount: 0,
          messages: updatedMessages
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    if (activeConversation?.id === conversationId) {
      setActiveConversation({
        ...activeConversation,
        unreadCount: 0,
        messages: activeConversation.messages.map(msg => ({
          ...msg,
          read: msg.senderRole === 'farmer' ? msg.read : true
        }))
      });
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
    markAsRead(conversation.id);
  };

  // Calculate total unread messages
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <MobileLayout>
      <AppHeader 
        title={activeConversation ? activeConversation.buyerName : "Messages"} 
        showBack={!!activeConversation}
        onBack={() => setActiveConversation(null)}
        notificationCount={totalUnread}
      />
      
      <div className="flex h-[calc(100vh-120px)]">
        {/* Conversations List (Desktop/Tablet) */}
        {(!activeConversation || window.innerWidth > 768) && (
          <div className="w-full md:w-1/3 border-r border-border bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Messages</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {conversations.length} active conversations
              </p>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-73px)]">
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                  onClick={() => handleConversationSelect(conversation)}
                  className={cn(
                    "p-4 border-b border-border cursor-pointer transition-colors",
                    activeConversation?.id === conversation.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground truncate">
                          {conversation.buyerName}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.buyerCompany}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {conversations.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Buyers will message you about your listings
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Chat Area */}
        <div className={cn(
          "flex-1 flex flex-col",
          activeConversation ? "flex" : "hidden md:flex"
        )}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {activeConversation.buyerName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activeConversation.buyerCompany}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" />
                        Online
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                {activeConversation.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      message.senderRole === 'farmer' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      message.senderRole === 'farmer' 
                        ? "bg-primary text-primary-foreground rounded-br-md" 
                        : "bg-muted text-foreground rounded-bl-md"
                    )}>
                      <p className="text-sm">{message.content}</p>
                      <div className={cn(
                        "flex items-center gap-1 mt-1 text-xs",
                        message.senderRole === 'farmer' ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderRole === 'farmer' && (
                          message.read ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 h-12 rounded-full px-4"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || loading}
                    className="h-12 w-12 rounded-full"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No conversation selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Messages;