import { AdminStats, ContentReport, ModerationAction } from './adminService';

// Mock data for testing
const mockStats: AdminStats = {
  totalUsers: 1247,
  totalProducts: 89,
  totalVideos: 567,
  totalPosts: 2341,
  activeUsers: 892,
  revenue: 45678.90,
  pendingApprovals: 23,
};

const mockUsers = [
  {
    _id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'active',
  },
  {
    _id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    createdAt: '2024-01-20T14:45:00Z',
    status: 'active',
  },
  {
    _id: '3',
    username: 'bob_wilson',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    createdAt: '2024-02-01T09:15:00Z',
    status: 'suspended',
  },
];

const mockPendingContent = [
  {
    _id: '1',
    title: 'Amazing Product Review',
    content: 'This is a fantastic product that I highly recommend to everyone...',
    type: 'post',
    author: { username: 'john_doe' },
    createdAt: '2024-01-25T16:20:00Z',
  },
  {
    _id: '2',
    title: 'New Gaming Setup',
    content: 'Just finished setting up my new gaming rig and it\'s incredible...',
    type: 'post',
    author: { username: 'gamer_pro' },
    createdAt: '2024-01-26T11:30:00Z',
  },
  {
    _id: '3',
    title: 'Tech Tutorial: React Best Practices',
    content: 'Here are some essential React patterns that every developer should know...',
    type: 'post',
    author: { username: 'dev_expert' },
    createdAt: '2024-01-27T08:45:00Z',
  },
];

const mockReports = [
  {
    id: '1',
    contentType: 'post',
    contentId: 'post_123',
    reporterId: 'user_456',
    reason: 'Inappropriate content',
    description: 'This post contains offensive language',
    status: 'pending',
    createdAt: '2024-01-28T10:00:00Z',
  },
  {
    id: '2',
    contentType: 'comment',
    contentId: 'comment_789',
    reporterId: 'user_789',
    reason: 'Spam',
    description: 'Repeated promotional messages',
    status: 'pending',
    createdAt: '2024-01-28T14:30:00Z',
  },
];

export class MockAdminService {
  // Check if user has admin privileges
  static async checkAdminAccess(): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true; // Always return true for testing
  }

  // Get admin dashboard statistics
  static async getDashboardStats(): Promise<AdminStats> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockStats;
  }

  // User Management
  static async getUsers(_page: number = 1, _limit: number = 20, _filters?: any): Promise<{ users: any[]; total: number; hasMore: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      users: mockUsers,
      total: mockUsers.length,
      hasMore: false,
    };
  }

  static async getUserDetails(userId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u._id === userId);
    return user ? {
      ...user,
      activity: [],
      reports: [],
    } : null;
  }

  static async updateUserStatus(userId: string, action: ModerationAction): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // In a real app, this would update the user status
    console.log(`Updating user ${userId} with action:`, action);
  }

  static async deleteUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Deleting user ${userId}`);
  }

  // Content Management
  static async getPendingContent(_type: 'posts' | 'videos' | 'products', _page: number = 1, _limit: number = 20): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockPendingContent;
  }

  static async approveContent(contentType: string, contentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Approving ${contentType} ${contentId}`);
  }

  static async rejectContent(contentType: string, contentId: string, reason: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Rejecting ${contentType} ${contentId} with reason: ${reason}`);
  }

  static async deleteContent(contentType: string, contentId: string, reason: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Deleting ${contentType} ${contentId} with reason: ${reason}`);
  }

  // Content Reports
  static async getContentReports(_page: number = 1, _limit: number = 20, status?: string): Promise<{ reports: ContentReport[]; total: number; hasMore: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const filteredReports = status ? mockReports.filter(r => r.status === status) : mockReports;
    return {
      reports: filteredReports as ContentReport[],
      total: filteredReports.length,
      hasMore: false,
    };
  }

  static async reviewReport(reportId: string, action: ModerationAction): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Reviewing report ${reportId} with action:`, action);
  }

  // Analytics and Insights
  static async getContentAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      posts: 1234,
      videos: 567,
      products: 89,
      period,
    };
  }

  static async getUserAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      newUsers: 234,
      activeUsers: 1567,
      premiumUsers: 89,
      period,
    };
  }

  static async getRevenueAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      monthly: 12345,
      quarterly: 45678,
      yearly: 123456,
      period,
    };
  }

  // Platform Settings
  static async getPlatformSettings(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      contentModeration: 'manual',
      userRegistration: 'open',
      defaultUserRole: 'user',
    };
  }

  static async updatePlatformSettings(settings: any): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('Updating platform settings:', settings);
  }

  // Bulk Operations
  static async bulkApproveContent(contentType: string, contentIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log(`Bulk approving ${contentIds.length} ${contentType}`);
  }

  static async bulkRejectContent(contentType: string, contentIds: string[], reason: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log(`Bulk rejecting ${contentIds.length} ${contentType} with reason: ${reason}`);
  }

  // System Health
  static async getSystemHealth(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      database: { status: 'healthy', uptime: '99.9%' },
      storage: { status: 'warning', usage: '75%' },
      api: { status: 'healthy', responseTime: '120ms' },
    };
  }

  static async getSystemLogs(_page: number = 1, _limit: number = 50, _level?: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      logs: [
        { level: 'info', message: 'User login successful', timestamp: new Date().toISOString() },
        { level: 'warning', message: 'High memory usage detected', timestamp: new Date().toISOString() },
        { level: 'error', message: 'Database connection timeout', timestamp: new Date().toISOString() },
      ],
      total: 3,
      hasMore: false,
    };
  }
}
