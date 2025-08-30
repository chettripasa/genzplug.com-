import { User } from '../types';

// Mock user data for testing
const mockUsers = [
  {
    _id: '1',
    username: 'admin',
    email: 'admin@nexushub.com',
    firstName: 'Admin',
    lastName: 'User',
    profilePic: undefined,
    bio: undefined,
    role: 'admin',
    isVerified: true,
    isBanned: false,
    banReason: undefined,
    bannedAt: undefined,
    bannedBy: undefined,
    moderationStatus: 'approved',
    lastLoginAt: undefined,
    loginCount: 10,
    followers: [],
    following: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: '2',
    username: 'demo',
    email: 'demo@nexushub.com',
    firstName: 'Demo',
    lastName: 'User',
    profilePic: undefined,
    bio: undefined,
    role: 'user',
    isVerified: true,
    isBanned: false,
    banReason: undefined,
    bannedAt: undefined,
    bannedBy: undefined,
    moderationStatus: 'approved',
    lastLoginAt: undefined,
    loginCount: 5,
    followers: [],
    following: [],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

// Simulate localStorage for token management
let mockToken: string | null = null;

export const mockAuthAPI = {
  // Login with mock credentials
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check for demo credentials
    if (email === 'demo@nexushub.com' && password === 'demo123') {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        mockToken = `mock_token_${user._id}`;
        return { user, token: mockToken };
      }
    }
    
    // Check for admin credentials
    if (email === 'admin@nexushub.com' && password === 'admin123') {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        mockToken = `mock_token_${user._id}`;
        return { user, token: mockToken };
      }
    }
    
    throw new Error('Invalid credentials. Use demo@nexushub.com / demo123 or admin@nexushub.com / admin123');
  },

  // Register new user
  async register(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username or email already exists
    if (mockUsers.some(u => u.username === username)) {
      throw new Error('Username already exists');
    }
    
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    // Create new user
    const newUser: User = {
      _id: `user_${Date.now()}`,
      username,
      email,
      firstName: username,
      lastName: '',
      profilePic: undefined,
      bio: undefined,
      role: 'user',
      isVerified: true,
      isBanned: false,
      banReason: undefined,
      bannedAt: undefined,
      bannedBy: undefined,
      moderationStatus: 'approved',
      lastLoginAt: undefined,
      loginCount: 1,
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    mockToken = `mock_token_${newUser._id}`;
    
    return { user: newUser, token: mockToken };
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!mockToken) {
      throw new Error('No token found');
    }
    
    const userId = mockToken.replace('mock_token_', '');
    const user = mockUsers.find(u => u._id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },

  // Logout
  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    mockToken = null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return mockToken !== null;
  },

  // Get current token
  getToken(): string | null {
    return mockToken;
  },
};

// Demo credentials for testing:
// Email: demo@nexushub.com, Password: demo123 (Regular User)
// Email: admin@nexushub.com, Password: admin123 (Admin User)
