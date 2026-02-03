import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, Farmer, api } from '../services/api';
import { useAuth } from './AuthContext';

// Define notification interface
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextType {
  products: Product[];
  orders: Order[];
  farmers: Farmer[];
  notifications: Notification[];
  language: string;
  loading: {
    products: boolean;
    orders: boolean;
    farmers: boolean;
  };
  error: {
    products: string | null;
    orders: string | null;
    farmers: string | null;
  };
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshFarmers: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  setLanguage: (lang: string) => void;
  createProduct: (product: Omit<Product, 'id' | 'farmerId' | 'farmerName' | 'verified' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  createOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<Order>;
  searchProducts: (query: string) => Promise<Product[]>;
  getProductsByCategory: (category: Product['category']) => Promise<Product[]>;
  getProductsByLocation: (location: string) => Promise<Product[]>;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  const [loading, setLoading] = useState({
    products: false,
    orders: false,
    farmers: false,
  });
  const [error, setError] = useState({
    products: null,
    orders: null,
    farmers: null,
  });

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      refreshProducts();
      refreshFarmers();
      refreshNotifications();
      
      // Load orders based on user type
      if (user.email?.includes('farmer')) {
        refreshOrders(); // Load farmer's orders
      } else {
        // For now, load all orders - in real app, would load buyer's orders
        refreshOrders();
      }
    }
  }, [user]);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const refreshProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    setError(prev => ({ ...prev, products: null }));
    
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(prev => ({ ...prev, products: (err as Error).message }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const refreshOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    setError(prev => ({ ...prev, orders: null }));
    
    try {
      let data: Order[] = [];
      if (user) {
        // In a real app, we'd distinguish between farmers and buyers
        // For now, we'll just get all orders
        data = await api.getOrdersByFarmer(user.uid || 'dummy');
      }
      setOrders(data);
    } catch (err) {
      setError(prev => ({ ...prev, orders: (err as Error).message }));
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const refreshFarmers = async () => {
    setLoading(prev => ({ ...prev, farmers: true }));
    setError(prev => ({ ...prev, farmers: null }));
    
    try {
      const data = await api.getFarmers();
      setFarmers(data);
    } catch (err) {
      setError(prev => ({ ...prev, farmers: (err as Error).message }));
    } finally {
      setLoading(prev => ({ ...prev, farmers: false }));
    }
  };

  const refreshNotifications = async () => {
    // In a real app, this would fetch from the backend
    // For now, we'll generate some mock notifications
    const mockNotifications: Notification[] = [
      { 
        id: '1', 
        title: 'New Buyer Inquiry', 
        message: 'BioFuel Corp is interested in your wheat straw', 
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        read: false,
        type: 'info'
      },
      { 
        id: '2', 
        title: 'Price Alert', 
        message: 'Rice husk prices increased by 8% this week', 
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        read: false,
        type: 'warning'
      },
      { 
        id: '3', 
        title: 'Order Confirmed', 
        message: 'Your order with Green Compost was confirmed', 
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: true,
        type: 'success'
      },
    ];
    
    setNotifications(mockNotifications);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const createProduct = async (product: Omit<Product, 'id' | 'farmerId' | 'farmerName' | 'verified' | 'createdAt'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      const newProduct = await api.createProduct(product, user);
      setProducts(prev => [...prev, newProduct]);
      addNotification({
        title: 'Product Created',
        message: `Successfully added ${newProduct.name} to your listings`,
        type: 'success'
      });
      return newProduct;
    } catch (err) {
      addNotification({
        title: 'Error',
        message: (err as Error).message || 'Failed to create product',
        type: 'error'
      });
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updatedProduct = await api.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      addNotification({
        title: 'Product Updated',
        message: `Successfully updated ${updatedProduct.name}`,
        type: 'success'
      });
      return updatedProduct;
    } catch (err) {
      addNotification({
        title: 'Error',
        message: (err as Error).message || 'Failed to update product',
        type: 'error'
      });
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const success = await api.deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        addNotification({
          title: 'Product Deleted',
          message: 'Successfully removed product from your listings',
          type: 'info'
        });
      }
      return success;
    } catch (err) {
      addNotification({
        title: 'Error',
        message: (err as Error).message || 'Failed to delete product',
        type: 'error'
      });
      throw err;
    }
  };

  const createOrder = async (order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newOrder = await api.createOrder(order);
      setOrders(prev => [...prev, newOrder]);
      addNotification({
        title: 'Order Created',
        message: `Successfully created order for ${newOrder.productName}`,
        type: 'success'
      });
      return newOrder;
    } catch (err) {
      addNotification({
        title: 'Error',
        message: (err as Error).message || 'Failed to create order',
        type: 'error'
      });
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const updatedOrder = await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      addNotification({
        title: 'Order Status Updated',
        message: `Order status changed to ${status}`,
        type: 'info'
      });
      return updatedOrder;
    } catch (err) {
      addNotification({
        title: 'Error',
        message: (err as Error).message || 'Failed to update order status',
        type: 'error'
      });
      throw err;
    }
  };

  const searchProducts = async (query: string) => {
    try {
      const results = await api.searchProducts(query);
      setProducts(results);
      return results;
    } catch (err) {
      setError(prev => ({ ...prev, products: (err as Error).message }));
      addNotification({
        title: 'Search Error',
        message: (err as Error).message || 'Failed to search products',
        type: 'error'
      });
      throw err;
    }
  };

  const getProductsByCategory = async (category: Product['category']) => {
    try {
      const results = await api.getProductsByCategory(category);
      setProducts(results);
      return results;
    } catch (err) {
      setError(prev => ({ ...prev, products: (err as Error).message }));
      addNotification({
        title: 'Category Error',
        message: (err as Error).message || 'Failed to get products by category',
        type: 'error'
      });
      throw err;
    }
  };

  const getProductsByLocation = async (location: string) => {
    try {
      const results = await api.getProductsByLocation(location);
      setProducts(results);
      return results;
    } catch (err) {
      setError(prev => ({ ...prev, products: (err as Error).message }));
      addNotification({
        title: 'Location Error',
        message: (err as Error).message || 'Failed to get products by location',
        type: 'error'
      });
      throw err;
    }
  };

  const value = {
    products,
    orders,
    farmers,
    notifications,
    language,
    loading,
    error,
    refreshProducts,
    refreshOrders,
    refreshFarmers,
    refreshNotifications,
    setLanguage,
    createProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrderStatus,
    searchProducts,
    getProductsByCategory,
    getProductsByLocation,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};