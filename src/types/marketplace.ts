export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'seeds' | 'fertilizers' | 'tools' | 'pesticides' | 'equipment' | 'other' | 'Fruits' | 'Vegetables' | 'Crop Residue' | 'Animal Waste' | 'Food Waste' | 'Other Biomass';
  image: string;
  stock: number;
  rating?: number;
  seller: string;
  unit: string; // kg, piece, litre, etc.
  location?: string;
  inStock?: boolean;
  organic?: boolean;
  discount?: number;
  recyclable?: boolean;
  // Enhanced payment and blockchain features
  paymentFeatures?: {
    razorpayEnabled: boolean;
    escrowProtection: boolean;
    blockchainRecording: boolean;
    fraudDetection: boolean;
    autoRelease: boolean;
    disputeResolution: boolean;
  };
  blockchainInfo?: {
    transactionCount: number;
    lastTransactionHash?: string;
    network: string;
    verificationStatus: 'verified' | 'pending' | 'failed';
  };
  securityFeatures?: {
    buyerProtection: boolean;
    sellerVerification: boolean;
    paymentGuarantee: boolean;
    transparentPricing: boolean;
  };
  analytics?: {
    totalSales: number;
    successRate: number;
    averageRating: number;
    customerSatisfaction: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: 'cod' | 'online' | 'upi';
  paymentStatus: 'pending' | 'completed' | 'failed';
  trackingId?: string;
}