import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Play, 
  Users, 
  ShoppingBag, 
  Video, 
  Gamepad2, 
  Star,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Zap,
  Crown,
  Settings,
  BarChart3,
  Activity,
  Clock,
  DollarSign,
  ShoppingCart,
  Live
} from 'lucide-react';

const HomePage: React.FC = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);
  const [gameScore, setGameScore] = useState(0);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 12547,
    totalRevenue: 89420,
    activeOrders: 156,
    contentViews: 234567
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAdminStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        contentViews: prev.contentViews + Math.floor(Math.random() * 50)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: ShoppingBag,
      title: 'E-commerce Hub',
      description: 'Shop for the latest gaming gear, tech accessories, and exclusive merchandise.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Video,
      title: 'Video Platform',
      description: 'Upload, watch, and share gaming content, tutorials, and live streams.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Users,
      title: 'Social Network',
      description: 'Connect with fellow gamers, share achievements, and build communities.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Gamepad2,
      title: 'Gaming Portal',
      description: 'Play multiplayer games, join tournaments, and track your progress.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const stats = [
    { number: '10M+', label: 'Active Users', icon: Users },
    { number: '500K+', label: 'Products Sold', icon: ShoppingBag },
    { number: '2M+', label: 'Videos Uploaded', icon: Video },
    { number: '100K+', label: 'Games Played', icon: Gamepad2 },
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Pro Gamer',
      content: 'NexusHub has everything I need in one place. The community is amazing and the features are top-notch!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
    },
    {
      name: 'Sarah Johnson',
      role: 'Content Creator',
      content: 'The video platform is incredible. Easy to use and great for building my audience.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
    },
    {
      name: 'Mike Rodriguez',
      role: 'Tech Enthusiast',
      content: 'Best e-commerce platform for gaming gear. Fast shipping and great customer service.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
    },
  ];

  // Featured Products Data
  const featuredProducts = [
    {
      id: 1,
      name: 'Pro Gaming Headset',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
      rating: 4.8,
      reviews: 1247,
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'RGB Gaming Keyboard',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop',
      rating: 4.6,
      reviews: 892,
      badge: 'Popular'
    },
    {
      id: 3,
      name: '4K Gaming Monitor',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop',
      rating: 4.9,
      reviews: 567,
      badge: 'Premium'
    },
    {
      id: 4,
      name: 'Wireless Gaming Mouse',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop',
      rating: 4.7,
      reviews: 2341,
      badge: 'Trending'
    }
  ];

  // Real-time Activity Feed
  const activityFeed = [
    { id: 1, user: 'GamerPro123', action: 'purchased Pro Gaming Headset', time: '2 min ago', type: 'purchase' },
    { id: 2, user: 'StreamQueen', action: 'started live stream', time: '5 min ago', type: 'stream' },
    { id: 3, user: 'TechWizard', action: 'uploaded new tutorial', time: '8 min ago', type: 'upload' },
    { id: 4, user: 'PixelHunter', action: 'achieved new high score', time: '12 min ago', type: 'achievement' },
    { id: 5, user: 'GearMaster', action: 'left 5-star review', time: '15 min ago', type: 'review' }
  ];

  // Live Stream Data
  const liveStreams = [
    { id: 1, title: 'Pro Gaming Tournament', streamer: 'EliteGamer', viewers: 1247, thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop' },
    { id: 2, title: 'Tech Review Live', streamer: 'TechReviewer', viewers: 892, thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' }
  ];

  const nextProduct = () => {
    setCurrentProductIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setCurrentProductIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const handleGameClick = () => {
    setGameScore(prev => prev + 10);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  NexusHub
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed">
                The ultimate all-in-one platform for gaming, social media, e-commerce, and video content. 
                Connect, create, and explore in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">Watch Demo</h3>
                    <p className="text-gray-300">See NexusHub in action</p>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-80 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Activity Feed Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Activity className="w-8 h-8 mr-3 text-blue-400" />
              Live Activity Feed
            </h2>
            <p className="text-gray-300">See what's happening on NexusHub right now</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="space-y-4">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <span className="font-semibold text-blue-400">{activity.user}</span>
                    <span className="text-gray-300"> {activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular gaming gear and tech accessories
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentProductIndex * 100}%)` }}>
                {featuredProducts.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-80 object-cover rounded-xl shadow-2xl"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                            {product.badge}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm">{product.rating}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h3>
                          <div className="flex items-center space-x-4 mb-4">
                            <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-lg">
                            {product.reviews.toLocaleString()} reviews • Premium quality gaming gear
                          </p>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                          </button>
                          <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation arrows */}
            <button 
              onClick={prevProduct}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ArrowRight className="w-6 h-6 text-gray-700 rotate-180" />
            </button>
            <button 
              onClick={nextProduct}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ArrowRight className="w-6 h-6 text-gray-700" />
            </button>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProductIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentProductIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Stream Preview Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center">
              <Live className="w-8 h-8 mr-3 text-red-400" />
              Live Now
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Watch live streams from top creators and join the conversation in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {liveStreams.map((stream) => (
              <div key={stream.id} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <img 
                    src={stream.thumbnail} 
                    alt={stream.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">LIVE</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-semibold">{stream.viewers.toLocaleString()} watching</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{stream.title}</h3>
                  <p className="text-purple-200 mb-4">by {stream.streamer}</p>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                      <Play className="w-4 h-4 mr-2 inline" />
                      Watch Now
                    </button>
                    <button className="px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Gaming Demo Section */}
      <section className="py-20 bg-gradient-to-r from-green-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 mr-3 text-green-400" />
              Try Our Gaming Portal
            </h2>
            <p className="text-xl text-green-200 max-w-3xl mx-auto">
              Experience the thrill of our gaming platform with this interactive demo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Quick Game Demo</h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-green-400 mb-2">{gameScore}</div>
                    <div className="text-green-200">Points</div>
                  </div>
                  
                  <button 
                    onClick={handleGameClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <Zap className="w-6 h-6 mr-2 inline" />
                    Click to Score!
                  </button>
                  
                  <div className="text-sm text-green-200">
                    Click as fast as you can to beat your high score!
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="text-xl font-bold mb-4 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                  Leaderboard
                </h4>
                <div className="space-y-3">
                  {[
                    { name: 'ProGamer123', score: 2840, rank: 1 },
                    { name: 'ElitePlayer', score: 2150, rank: 2 },
                    { name: 'GameMaster', score: 1890, rank: 3 }
                  ].map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                        }`}>
                          {player.rank}
                        </div>
                        <span className="font-semibold">{player.name}</span>
                      </div>
                      <span className="text-green-400 font-bold">{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="text-xl font-bold mb-4">Game Features</h4>
                <div className="space-y-3 text-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Multiplayer tournaments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Real-time leaderboards</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Achievement system</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Cross-platform play</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Dashboard Preview Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center">
              <Settings className="w-8 h-8 mr-3 text-blue-400" />
              Admin Dashboard Preview
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful content management system for administrators and content creators
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Stats Overview */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-blue-400">Platform Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Users</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">${adminStats.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Revenue</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <ShoppingCart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{adminStats.activeOrders}</div>
                    <div className="text-sm text-gray-400">Active Orders</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <Eye className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{adminStats.contentViews.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Content Views</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-blue-400">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    <Users className="w-5 h-5 mr-2" />
                    Manage Users
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Manage Products
                  </button>
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                    <Video className="w-5 h-5 mr-2" />
                    Moderate Content
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Recent Admin Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'Approved new product listing', time: '2 min ago', admin: 'AdminUser' },
                  { action: 'Banned user for policy violation', time: '15 min ago', admin: 'Moderator' },
                  { action: 'Updated platform settings', time: '1 hour ago', admin: 'SuperAdmin' },
                  { action: 'Generated monthly report', time: '3 hours ago', admin: 'AdminUser' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">{activity.action}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      by {activity.admin} • {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              NexusHub combines the best features of multiple platforms, giving you a seamless experience 
              across all your digital needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className={`${feature.color} w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-white shadow-md`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 mr-2" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How NexusHub Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps and unlock the full potential of our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up for free and customize your profile to get started.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore Features</h3>
              <p className="text-gray-600">Discover our shop, video platform, social network, and gaming portal.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Create</h3>
              <p className="text-gray-600">Build your community, share content, and enjoy seamless integration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their digital experience with NexusHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the NexusHub community today and experience the future of integrated digital platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
