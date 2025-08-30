import { User, Product, Video, Post } from '../types';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalVideos: number;
  totalPosts: number;
  activeUsers: number;
  revenue: number;
  pendingApprovals: number;
}

export interface ContentReport {
  id: string;
  contentType: 'post' | 'video' | 'comment' | 'user';
  contentId: string;
  reporterId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ModerationAction {
  action: 'approve' | 'reject' | 'delete' | 'warn' | 'ban';
  reason?: string;
  duration?: number; // for temporary bans
}

export class AdminService {
  private static readonly API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin`;

  // Check if user has admin privileges
  static async checkAdminAccess(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/access`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }

  // Get admin dashboard statistics
  static async getDashboardStats(): Promise<AdminStats> {
    try {
      const response = await fetch(`${this.API_BASE}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  // User Management
  static async getUsers(page: number = 1, limit: number = 20, filters?: any): Promise<{ users: User[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await fetch(`${this.API_BASE}/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserDetails(userId: string): Promise<User & { activity: any[]; reports: any[] }> {
    try {
      const response = await fetch(`${this.API_BASE}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }

  static async updateUserStatus(userId: string, action: ModerationAction): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(action),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Content Management
  static async getPendingContent(type: 'posts' | 'videos' | 'products', page: number = 1, limit: number = 20): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${this.API_BASE}/content/${type}/pending?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pending ${type}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching pending ${type}:`, error);
      throw error;
    }
  }

  static async approveContent(contentType: string, contentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/content/${contentType}/${contentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve content');
      }
    } catch (error) {
      console.error('Error approving content:', error);
      throw error;
    }
  }

  static async rejectContent(contentType: string, contentId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/content/${contentType}/${contentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject content');
      }
    } catch (error) {
      console.error('Error rejecting content:', error);
      throw error;
    }
  }

  static async deleteContent(contentType: string, contentId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/content/${contentType}/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }

  // Content Reports
  static async getContentReports(page: number = 1, limit: number = 20, status?: string): Promise<{ reports: ContentReport[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`${this.API_BASE}/reports?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content reports');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching content reports:', error);
      throw error;
    }
  }

  static async reviewReport(reportId: string, action: ModerationAction): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/reports/${reportId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(action),
      });

      if (!response.ok) {
        throw new Error('Failed to review report');
      }
    } catch (error) {
      console.error('Error reviewing report:', error);
      throw error;
    }
  }

  // Analytics and Insights
  static async getContentAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<any> {
    try {
      const params = new URLSearchParams({ period });

      const response = await fetch(`${this.API_BASE}/analytics/content?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching content analytics:', error);
      throw error;
    }
  }

  static async getUserAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<any> {
    try {
      const params = new URLSearchParams({ period });

      const response = await fetch(`${this.API_BASE}/analytics/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  }

  static async getRevenueAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<any> {
    try {
      const params = new URLSearchParams({ period });

      const response = await fetch(`${this.API_BASE}/analytics/revenue?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch revenue analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  // Platform Settings
  static async getPlatformSettings(): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch platform settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching platform settings:', error);
      throw error;
    }
  }

  static async updatePlatformSettings(settings: any): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update platform settings');
      }
    } catch (error) {
      console.error('Error updating platform settings:', error);
      throw error;
    }
  }

  // Bulk Operations
  static async bulkApproveContent(contentType: string, contentIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/content/${contentType}/bulk-approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ contentIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to bulk approve content');
      }
    } catch (error) {
      console.error('Error bulk approving content:', error);
      throw error;
    }
  }

  static async bulkRejectContent(contentType: string, contentIds: string[], reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/content/${contentType}/bulk-reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ contentIds, reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to bulk reject content');
      }
    } catch (error) {
      console.error('Error bulk rejecting content:', error);
      throw error;
    }
  }

  // System Health
  static async getSystemHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE}/system/health`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system health');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }

  static async getSystemLogs(page: number = 1, limit: number = 50, level?: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (level) {
        params.append('level', level);
      }

      const response = await fetch(`${this.API_BASE}/system/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  }
}
