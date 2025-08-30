import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminStats, ContentReport, ModerationAction } from '../services/adminService';
import { MockAdminService } from '../services/mockAdminService';

// Use MockAdminService for testing - replace with AdminService when backend is ready
const AdminService = MockAdminService;
import { useNotificationStore } from '../stores/notificationStore';
import { 
  Users, 
  ShoppingBag, 
  Video, 
  MessageSquare, 
  TrendingUp, 
  Settings, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  BarChart3,
  Activity,
  DollarSign,
  FileText,
  UserCheck,
  UserX,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [pendingContent, setPendingContent] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    contentType: '',
    period: 'week'
  });

  const tabs: TabData[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" />, count: stats?.totalUsers },
    { id: 'content', label: 'Content', icon: <FileText className="w-5 h-5" />, count: stats?.pendingApprovals },
    { id: 'reports', label: 'Reports', icon: <AlertTriangle className="w-5 h-5" />, count: reports.length },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardStats();
    } else if (activeTab === 'reports') {
      loadReports();
    } else if (activeTab === 'content') {
      loadPendingContent();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const checkAdminAccess = async () => {
    try {
      const hasAccess = await AdminService.checkAdminAccess();
      if (!hasAccess) {
        addNotification({
          type: 'error',
          title: 'Access Denied',
          message: 'You do not have admin privileges',
          duration: 5000,
        });
        // Redirect to home or show access denied message
        return;
      }
      setLoading(false);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to verify admin access',
        duration: 5000,
      });
    }
  };

  const loadDashboardStats = async () => {
    try {
      const dashboardStats = await AdminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard statistics',
        duration: 5000,
      });
    }
  };

  const loadReports = async () => {
    try {
      const reportsData = await AdminService.getContentReports(1, 50, filters.status);
      setReports(reportsData.reports);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load content reports',
        duration: 5000,
      });
    }
  };

  const loadPendingContent = async () => {
    try {
      const content = await AdminService.getPendingContent('posts', 1, 50);
      setPendingContent(content);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load pending content',
        duration: 5000,
      });
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await AdminService.getUsers(1, 50, filters);
      setUsers(usersData.users);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load users',
        duration: 5000,
      });
    }
  };

  const handleModerationAction = async (contentId: string, action: ModerationAction) => {
    try {
      if (action.action === 'approve') {
        await AdminService.approveContent('posts', contentId);
        addNotification({
          type: 'success',
          title: 'Content Approved',
          message: 'Content has been approved successfully',
          duration: 3000,
        });
      } else if (action.action === 'reject') {
        await AdminService.rejectContent('posts', contentId, action.reason || 'Violates community guidelines');
        addNotification({
          type: 'warning',
          title: 'Content Rejected',
          message: 'Content has been rejected',
          duration: 3000,
        });
      } else if (action.action === 'delete') {
        await AdminService.deleteContent('posts', contentId, action.reason || 'Violates community guidelines');
        addNotification({
          type: 'success',
          title: 'Content Deleted',
          message: 'Content has been deleted successfully',
          duration: 3000,
        });
      }

      // Refresh data
      if (activeTab === 'content') {
        loadPendingContent();
      } else if (activeTab === 'reports') {
        loadReports();
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to perform moderation action',
        duration: 5000,
      });
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedItems.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Selection',
        message: 'Please select items to perform bulk action',
        duration: 3000,
      });
      return;
    }

    try {
      if (action === 'approve') {
        await AdminService.bulkApproveContent('posts', selectedItems);
        addNotification({
          type: 'success',
          title: 'Bulk Approval',
          message: `${selectedItems.length} items approved successfully`,
          duration: 3000,
        });
      } else {
        await AdminService.bulkRejectContent('posts', selectedItems, 'Bulk rejection');
        addNotification({
          type: 'warning',
          title: 'Bulk Rejection',
          message: `${selectedItems.length} items rejected successfully`,
          duration: 3000,
        });
      }

      setSelectedItems([]);
      loadPendingContent();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to perform bulk action',
        duration: 5000,
      });
    }
  };

  const handleUserAction = async (userId: string, action: ModerationAction) => {
    try {
      await AdminService.updateUserStatus(userId, action);
      addNotification({
        type: 'success',
        title: 'User Status Updated',
        message: 'User status has been updated successfully',
        duration: 3000,
      });
      loadUsers();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update user status',
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your platform, users, and content</p>
        </div>

        {/* Stats Cards */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Videos</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalVideos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingApprovals}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-100 text-gray-900 py-1 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">New user registration</span>
                        <span className="text-xs text-gray-400">2 min ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Product uploaded</span>
                        <span className="text-xs text-gray-400">15 min ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Content reported</span>
                        <span className="text-xs text-gray-400">1 hour ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-white rounded-lg border hover:border-primary-300 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-primary-600" />
                          <span className="text-sm font-medium">Review Pending Content</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 bg-white rounded-lg border hover:border-primary-300 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-primary-600" />
                          <span className="text-sm font-medium">Manage Users</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 bg-white rounded-lg border hover:border-primary-300 transition-colors">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="w-5 h-5 text-primary-600" />
                          <span className="text-sm font-medium">View Analytics</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Export Users
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.slice(0, 10).map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.username?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUserAction(user._id, { action: 'warn' })}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user._id, { action: 'ban' })}
                                className="text-red-600 hover:text-red-900"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Pending Content Review</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBulkAction('approve')}
                      disabled={selectedItems.length === 0}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Approve Selected
                    </button>
                    <button
                      onClick={() => handleBulkAction('reject')}
                      disabled={selectedItems.length === 0}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="w-4 h-4 inline mr-2" />
                      Reject Selected
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingContent.slice(0, 5).map((content) => (
                    <div key={content._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(content._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems([...selectedItems, content._id]);
                                } else {
                                  setSelectedItems(selectedItems.filter(id => id !== content._id));
                                }
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-gray-900">{content.title || 'Untitled'}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {content.type || 'Post'}
                            </span>
                          </div>
                                                     <p className="text-sm text-gray-600 overflow-hidden text-ellipsis display-webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">
                             {content.content || content.description || 'No content available'}
                           </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>By: {content.author?.username || 'Unknown'}</span>
                            <span>{new Date(content.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleModerationAction(content._id, { action: 'approve' })}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleModerationAction(content._id, { action: 'reject', reason: 'Violates guidelines' })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleModerationAction(content._id, { action: 'delete', reason: 'Inappropriate content' })}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Content Reports</h3>
                  <div className="flex space-x-2">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                    <button
                      onClick={loadReports}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {reports.slice(0, 10).map((report) => (
                    <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {report.contentType.charAt(0).toUpperCase() + report.contentType.slice(1)} Report
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              report.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Reason:</strong> {report.reason}
                          </p>
                          {report.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Description:</strong> {report.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Reported: {new Date(report.createdAt).toLocaleDateString()}</span>
                            {report.reviewedAt && (
                              <span>Reviewed: {new Date(report.reviewedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleModerationAction(report.contentId, { action: 'delete', reason: report.reason })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleModerationAction(report.contentId, { action: 'warn' })}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Content Analytics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Posts Created</span>
                        <span className="text-sm font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Videos Uploaded</span>
                        <span className="text-sm font-medium">567</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Products Added</span>
                        <span className="text-sm font-medium">89</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Analytics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">New Users</span>
                        <span className="text-sm font-medium">234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="text-sm font-medium">1,567</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Premium Users</span>
                        <span className="text-sm font-medium">89</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$12,345</div>
                      <div className="text-sm text-gray-600">This Month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">$45,678</div>
                      <div className="text-sm text-gray-600">This Quarter</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">$123,456</div>
                      <div className="text-sm text-gray-600">This Year</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Moderation
                      </label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="auto">Automatic</option>
                        <option value="manual">Manual Review</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Registration
                      </label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="open">Open</option>
                        <option value="invite">Invite Only</option>
                        <option value="approval">Requires Approval</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default User Role
                      </label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="user">User</option>
                        <option value="creator">Creator</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Database</span>
                        <span className="text-sm font-medium text-green-600">Healthy</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Storage</span>
                        <span className="text-sm font-medium text-yellow-600">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
