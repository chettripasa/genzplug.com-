import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Video, Users, GamepadIcon, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      name: 'eCommerce',
      description: 'Shop for products with secure checkout and order tracking',
      icon: ShoppingCart,
      href: '/shop',
      color: 'bg-blue-500',
    },
    {
      name: 'Video Streaming',
      description: 'Upload, watch, and share videos with the community',
      icon: Video,
      href: '/videos',
      color: 'bg-red-500',
    },
    {
      name: 'Social Network',
      description: 'Connect with friends, share posts, and chat in real-time',
      icon: Users,
      href: '/social',
      color: 'bg-green-500',
    },
    {
      name: 'Gaming Portal',
      description: 'Play HTML5 games, track progress, and compete on leaderboards',
      icon: GamepadIcon,
      href: '/games',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to NexusHub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              The all-in-one platform combining eCommerce, video streaming, social networking, and gaming.
            </p>
            {user ? (
              <Link
                to="/profile"
                className="inline-flex items-center btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="inline-flex items-center btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold rounded-lg"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              NexusHub brings together the best features of multiple platforms into a seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.name}
                  to={feature.href}
                  className="group card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} text-white mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                  <div className="mt-4 inline-flex items-center text-primary-600 group-hover:underline">
                    Explore
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-xl text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-xl text-gray-600">Videos Streamed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">100K+</div>
              <div className="text-xl text-gray-600">Products Sold</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join the Community?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Create your free account today and start exploring all that NexusHub has to offer.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg"
            >
              Sign Up Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
