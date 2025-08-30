import { Post, Comment, User } from '../types';

export interface CreatePostData {
  content: string;
  images?: string[];
  tags?: string[];
  visibility?: 'public' | 'friends' | 'private';
}

export interface CreateCommentData {
  content: string;
  postId: string;
  parentCommentId?: string; // for replies
}

export interface LikeData {
  postId: string;
  commentId?: string;
}

export interface ShareData {
  postId: string;
  platform: 'internal' | 'twitter' | 'facebook' | 'linkedin';
  message?: string;
}

export class SocialService {
  private static readonly API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

  // Posts
  static async createPost(data: CreatePostData): Promise<Post> {
    try {
      const response = await fetch(`${this.API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  static async getPosts(page: number = 1, limit: number = 10, userId?: string): Promise<{ posts: Post[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(`${this.API_BASE}/posts?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async getPost(postId: string): Promise<Post> {
    try {
      const response = await fetch(`${this.API_BASE}/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  static async updatePost(postId: string, data: Partial<CreatePostData>): Promise<Post> {
    try {
      const response = await fetch(`${this.API_BASE}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  static async deletePost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Comments
  static async createComment(data: CreateCommentData): Promise<Comment> {
    try {
      const response = await fetch(`${this.API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  static async getComments(postId: string, page: number = 1, limit: number = 20): Promise<{ comments: Comment[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${this.API_BASE}/posts/${postId}/comments?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  static async updateComment(commentId: string, content: string): Promise<Comment> {
    try {
      const response = await fetch(`${this.API_BASE}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  static async deleteComment(commentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Likes
  static async likePost(data: LikeData): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/posts/${data.postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  static async unlikePost(data: LikeData): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/posts/${data.postId}/unlike`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unlike post');
      }
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  static async likeComment(data: LikeData): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/comments/${data.commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  }

  static async unlikeComment(data: LikeData): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/comments/${data.commentId}/unlike`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unlike comment');
      }
    } catch (error) {
      console.error('Error unliking comment:', error);
      throw error;
    }
  }

  // Sharing
  static async sharePost(data: ShareData): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/posts/${data.postId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to share post');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  }

  // Feed and Discovery
  static async getFeed(page: number = 1, limit: number = 10): Promise<{ posts: Post[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${this.API_BASE}/feed?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  }

  static async getTrendingPosts(period: 'day' | 'week' | 'month' = 'week', limit: number = 10): Promise<Post[]> {
    try {
      const params = new URLSearchParams({
        period,
        limit: limit.toString(),
      });

      const response = await fetch(`${this.API_BASE}/posts/trending?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trending posts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      throw error;
    }
  }

  // Search
  static async searchPosts(query: string, page: number = 1, limit: number = 10): Promise<{ posts: Post[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${this.API_BASE}/posts/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search posts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  // User interactions
  static async followUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  static async unfollowUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/users/${userId}/unfollow`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  static async getFollowers(userId: string, page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${this.API_BASE}/users/${userId}/followers?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch followers');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching followers:', error);
      throw error;
    }
  }

  static async getFollowing(userId: string, page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${this.API_BASE}/users/${userId}/following?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch following');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching following:', error);
      throw error;
    }
  }
}
