import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../stores/cartStore';
import { useNotificationStore } from '../stores/notificationStore';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showActions = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const { addItem, getItemQuantity } = useCartStore();
  const { addNotification } = useNotificationStore();
  
  const currentQuantity = getItemQuantity(product._id);
  
  const handleAddToCart = () => {
    addItem(product, 1);
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart`,
      duration: 3000,
    });
  };
  
  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    addNotification({
      type: 'info',
      title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
      message: `${product.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
      duration: 3000,
    });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    
    return stars;
  };
  
  return (
    <div
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Quick Actions Overlay */}
        {showActions && (
          <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center space-x-2`}>
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full transition-all duration-200 ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            <Link
              to={`/shop/product/${product._id}`}
              className="p-2 rounded-full bg-white text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        )}
        
        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        
        {/* Sale Badge (if applicable) */}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Low Stock
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </div>
        
        {/* Product Name */}
        <Link
          to={`/shop/product/${product._id}`}
          className="block text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200 mb-2"
        >
          {product.name}
        </Link>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-600 ml-1">
            ({product.reviewCount})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          
          {currentQuantity > 0 && (
            <span className="text-sm text-primary-600 font-medium">
              In cart: {currentQuantity}
            </span>
          )}
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
