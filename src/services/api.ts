// Mock API service for KrrishiProfit
import { User } from 'firebase/auth';

// Define our data types
export interface Product {
  id: string;
  name: string;
  category: 'wheat-straw' | 'rice-husk' | 'corn-stover' | 'sugarcane-bagasse' | 'cotton-stalks' | 'other';
  quantity: number; // in kg
  pricePerKg: number; // in INR
  unit: 'kg' | 'quintal' | 'ton';
  location: string;
  farmerId: string;
  farmerName: string;
  verified: boolean;
  images?: string[];
  description: string;
  available: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  joinDate: Date;
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
}

// Mock data stores
let products: Product[] = [
  {
    id: 'prod1',
    name: 'Wheat Straw',
    category: 'wheat-straw',
    quantity: 500,
    pricePerKg: 2.5,
    unit: 'kg',
    location: 'Village Rampur, Varanasi',
    farmerId: 'farmer1',
    farmerName: 'Ramesh Kumar',
    verified: true,
    description: 'High quality wheat straw, dried and clean. Suitable for animal feed and industrial use.',
    available: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'prod2',
    name: 'Rice Husk',
    category: 'rice-husk',
    quantity: 1000,
    pricePerKg: 1.8,
    unit: 'kg',
    location: 'Village Sarnath, Varanasi',
    farmerId: 'farmer2',
    farmerName: 'Suresh Patel',
    verified: true,
    description: 'Fresh rice husk, ideal for biomass energy and industrial applications.',
    available: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'prod3',
    name: 'Corn Stover',
    category: 'corn-stover',
    quantity: 800,
    pricePerKg: 3.0,
    unit: 'kg',
    location: 'Village Bhadohi, Varanasi',
    farmerId: 'farmer3',
    farmerName: 'Vijay Singh',
    verified: false,
    description: 'Quality corn stover, perfect for biofuel production and composting.',
    available: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

let orders: Order[] = [
  {
    id: 'order1',
    productId: 'prod1',
    productName: 'Wheat Straw',
    buyerId: 'buyer1',
    buyerName: 'Agro Industries Ltd',
    quantity: 200,
    totalPrice: 500,
    status: 'delivered',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'order2',
    productId: 'prod2',
    productName: 'Rice Husk',
    buyerId: 'buyer2',
    buyerName: 'Green Energy Co.',
    quantity: 500,
    totalPrice: 900,
    status: 'in-transit',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

let farmers: Farmer[] = [
  {
    id: 'farmer1',
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    phone: '+91 98765 43210',
    location: 'Village Rampur, Varanasi',
    verified: true,
    rating: 4.8,
    totalSales: 156,
    joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'farmer2',
    name: 'Suresh Patel',
    email: 'suresh@example.com',
    phone: '+91 98765 12345',
    location: 'Village Sarnath, Varanasi',
    verified: true,
    rating: 4.6,
    totalSales: 120,
    joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'farmer3',
    name: 'Vijay Singh',
    email: 'vijay@example.com',
    phone: '+91 98765 67890',
    location: 'Village Bhadohi, Varanasi',
    verified: false,
    rating: 4.3,
    totalSales: 85,
    joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
];

// Mock API functions
export const api = {
  // Products
  getProducts: (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter(p => p.available));
      }, 500);
    });
  },

  getProductById: (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.find(p => p.id === id));
      }, 300);
    });
  },

  createProduct: (product: Omit<Product, 'id' | 'farmerId' | 'farmerName' | 'verified' | 'createdAt'>, farmer: User): Promise<Product> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          ...product,
          id: `prod${products.length + 1}`,
          farmerId: farmer.uid,
          farmerName: farmer.displayName || farmer.email?.split('@')[0] || 'Unknown Farmer',
          verified: false, // New farmers are not verified initially
          createdAt: new Date(),
        };
        products.push(newProduct);
        resolve(newProduct);
      }, 800);
    });
  },

  updateProduct: (id: string, updates: Partial<Product>): Promise<Product> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          products[index] = { ...products[index], ...updates };
          resolve(products[index]);
        } else {
          reject(new Error('Product not found'));
        }
      }, 500);
    });
  },

  deleteProduct: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          products.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  // Orders
  getOrdersByFarmer: (farmerId: string): Promise<Order[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(orders.filter(o => {
          const product = products.find(p => p.id === o.productId);
          return product?.farmerId === farmerId;
        }));
      }, 500);
    });
  },

  getOrdersByBuyer: (buyerId: string): Promise<Order[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(orders.filter(o => o.buyerId === buyerId));
      }, 500);
    });
  },

  createOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          ...order,
          id: `order${orders.length + 1}`,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        orders.push(newOrder);
        resolve(newOrder);
      }, 800);
    });
  },

  updateOrderStatus: (orderId: string, status: Order['status']): Promise<Order> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          orders[index] = { ...orders[index], status, updatedAt: new Date() };
          resolve(orders[index]);
        } else {
          reject(new Error('Order not found'));
        }
      }, 500);
    });
  },

  // Farmers
  getFarmers: (): Promise<Farmer[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(farmers);
      }, 500);
    });
  },

  getFarmerById: (id: string): Promise<Farmer | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(farmers.find(f => f.id === id));
      }, 300);
    });
  },

  // Utility functions
  searchProducts: (query: string): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = products.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase())
        ).filter(p => p.available);
        resolve(filtered);
      }, 500);
    });
  },
  
  getProductsByCategory: (category: Product['category']): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter(p => p.category === category && p.available));
      }, 500);
    });
  },
  
  getProductsByLocation: (location: string): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter(p => 
          p.location.toLowerCase().includes(location.toLowerCase()) && p.available
        ));
      }, 500);
    });
  },
};