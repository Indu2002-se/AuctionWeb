import { Link } from 'react-router-dom';
import Timer from './Timer';
import { DollarSign, Users, Eye, TrendingUp, Award } from 'lucide-react';

const ItemCard = ({ item }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'PENDING': return 'status-pending';
      case 'CLOSED': return 'status-closed';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const bidCount = item.bidCount || item.bids?.length || 0;
  const isHotAuction = bidCount > 10;
  const priceIncrease = ((item.currentPrice - item.startingPrice) / item.startingPrice * 100).toFixed(1);

  return (
    <div className="auction-card group">
      <div className="relative overflow-hidden">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop'}
          alt={item.name}
          className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(item.status)} shadow-lg`}>
            {item.status}
          </span>
        </div>
        
        {/* Hot Auction Badge */}
        {isHotAuction && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg animate-pulse">
              🔥 HOT
            </span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick View Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/auction/${item.id}`}
            className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-full font-semibold flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <Eye className="h-4 w-4" />
            <span>Quick View</span>
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-1">
            {item.name}
          </h3>
          {priceIncrease > 0 && (
            <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold">
              <TrendingUp className="h-3 w-3" />
              <span>+{priceIncrease}%</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
        
        {/* Price Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Current Bid</p>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">${item.currentPrice}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Starting</p>
              <span className="text-sm text-gray-400 line-through">${item.startingPrice}</span>
            </div>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{bidCount} bids</span>
          </div>
          
          {item.winner && (
            <div className="flex items-center space-x-1 text-amber-600">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Won</span>
            </div>
          )}
        </div>
        
        {/* Timer */}
        <div className="mb-4">
          <Timer endTime={item.endTime} />
        </div>
        
        {/* Action Button */}
        <Link
          to={`/auction/${item.id}`}
          className={`w-full block text-center transition-all duration-300 ${
            item.status === 'ACTIVE' 
              ? 'btn-primary' 
              : item.status === 'CLOSED' 
                ? 'btn-secondary cursor-not-allowed' 
                : 'btn-secondary'
          }`}
        >
          {item.status === 'ACTIVE' ? 'Place Bid' : item.status === 'CLOSED' ? 'View Results' : 'View Details'}
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;