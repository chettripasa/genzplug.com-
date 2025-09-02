export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePic: string | undefined;
  bio: string | undefined;
  role: 'user' | 'admin' | 'moderator';
  isVerified: boolean;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: string;
  moderationStatus: 'pending' | 'approved' | 'flagged' | 'rejected';
  lastLoginAt?: string;
  loginCount: number;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  owner: User;
  views: number;
  likes: string[];
  duration: number;
  status: 'processing' | 'processed' | 'failed';
  createdAt: string;
}

export interface Post {
  _id: string;
  content: string;
  images: string[];
  author: User;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Game {
  _id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnail: string;
  category: string;
  plays: number;
  createdAt: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  name?: string;
  price?: number;
  image: string | undefined;
}

export interface Order {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Notification {
  _id: string;
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  createdAt: string;
  isRead: boolean;
}
