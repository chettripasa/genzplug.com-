export interface User {
  _id: string;
  username: string;
  email: string;
  profilePic: string;
  bio: string;
  isAdmin: boolean;
  createdAt: string;
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
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}
