import { Product, Video, User, Post, Game } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    _id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate gamer and content creator',
    role: 'user',
    isVerified: true,
    isBanned: false,
    banReason: undefined,
    bannedAt: undefined,
    bannedBy: undefined,
    moderationStatus: 'approved',
    lastLoginAt: undefined,
    loginCount: 15,
    followers: ['2'],
    following: ['2'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    _id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Tech enthusiast and streamer',
    role: 'admin',
    isVerified: true,
    isBanned: false,
    banReason: undefined,
    bannedAt: undefined,
    bannedBy: undefined,
    moderationStatus: 'approved',
    lastLoginAt: undefined,
    loginCount: 8,
    followers: ['1'],
    following: ['1'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Gaming Headset Pro',
    description: 'High-quality gaming headset with noise cancellation and surround sound',
    price: 129.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
    ],
    category: 'Gaming',
    stock: 25,
    rating: 4.5,
    reviewCount: 128,
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    _id: '2',
    name: 'Mechanical Keyboard RGB',
    description: 'Premium mechanical keyboard with customizable RGB lighting and tactile switches',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1541140532154-b019d8b2c3c3?w=400&h=400&fit=crop',
    ],
    category: 'Gaming',
    stock: 15,
    rating: 4.8,
    reviewCount: 89,
    createdAt: '2024-01-18T14:00:00Z',
  },
  {
    _id: '3',
    name: 'Gaming Mouse Wireless',
    description: 'High-precision wireless gaming mouse with adjustable DPI and programmable buttons',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    ],
    category: 'Gaming',
    stock: 42,
    rating: 4.3,
    reviewCount: 156,
    createdAt: '2024-01-16T11:00:00Z',
  },
  {
    _id: '4',
    name: 'Gaming Chair Ergonomic',
    description: 'Ergonomic gaming chair with lumbar support and adjustable armrests',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    ],
    category: 'Furniture',
    stock: 8,
    rating: 4.6,
    reviewCount: 67,
    createdAt: '2024-01-14T16:00:00Z',
  },
];

// Mock Videos
export const mockVideos: Video[] = [
  {
    _id: '1',
    title: 'How to Build the Ultimate Gaming Setup',
    description: 'Complete guide to building a professional gaming setup with the best equipment',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop',
    owner: mockUsers[0]!,
    views: 15420,
    likes: ['1', '2'],
    duration: 1247,
    status: 'processed',
    createdAt: '2024-01-19T15:00:00Z',
  },
  {
    _id: '2',
    title: 'Top 10 Games of 2024',
    description: 'Review of the best games released this year with gameplay footage',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop',
    owner: mockUsers[1]!,
    views: 8920,
    likes: ['1'],
    duration: 892,
    status: 'processed',
    createdAt: '2024-01-17T12:00:00Z',
  },
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    _id: '1',
    content: 'Just finished setting up my new gaming rig! The RTX 4090 is absolutely insane. What do you think of my setup?',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    ],
    author: mockUsers[0]!,
    likes: ['2'],
    comments: [
      {
        _id: '1',
        content: 'Looks amazing! What monitor are you using?',
        author: mockUsers[1]!,
        createdAt: '2024-01-20T10:30:00Z',
      },
    ],
    createdAt: '2024-01-20T09:00:00Z',
  },
  {
    _id: '2',
    content: 'Streaming tonight at 8 PM! Come join us for some competitive Valorant matches 🎮',
    images: [],
    author: mockUsers[1]!,
    likes: ['1'],
    comments: [],
    createdAt: '2024-01-20T14:00:00Z',
  },
];

// Mock Games
export const mockGames: Game[] = [
  {
    _id: '1',
    title: 'Space Shooter',
    description: 'Classic space shooter game with modern graphics and power-ups',
    embedUrl: 'https://example.com/games/space-shooter',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    category: 'Action',
    plays: 15420,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '2',
    title: 'Puzzle Master',
    description: 'Brain-teasing puzzle game with hundreds of levels',
    embedUrl: 'https://example.com/games/puzzle-master',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    category: 'Puzzle',
    plays: 8920,
    createdAt: '2024-01-12T14:00:00Z',
  },
];

// Mock API functions
export const mockAPI = {
  // Products
  getProducts: () => Promise.resolve(mockProducts),
  getProduct: (id: string) => Promise.resolve(mockProducts.find(p => p._id === id)),
  
  // Videos
  getVideos: () => Promise.resolve(mockVideos),
  getVideo: (id: string) => Promise.resolve(mockVideos.find(v => v._id === id)),
  
  // Posts
  getPosts: () => Promise.resolve(mockPosts),
  getPost: (id: string) => Promise.resolve(mockPosts.find(p => p._id === id)),
  
  // Games
  getGames: () => Promise.resolve(mockGames),
  getGame: (id: string) => Promise.resolve(mockGames.find(g => g._id === id)),
  
  // Users
  getUsers: () => Promise.resolve(mockUsers),
  getUser: (id: string) => Promise.resolve(mockUsers.find(u => u._id === id)),
};
