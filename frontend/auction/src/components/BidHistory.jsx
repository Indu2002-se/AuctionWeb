import { useState, useEffect } from 'react';
import { bidService } from '../services/bidService';
import { DollarSign, User, Clock, Crown, TrendingUp, Award } from 'lucide-react';
import socketService from '../websocket/socket';

const BidHistory = ({ itemId }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBidAnimation, setNewBidAnimation] = useState(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const data = await bidService.getBidsByItem(itemId);
        setBids(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();

    // Listen for real-time bid updates
    socketService.onBidUpdate((data) => {
      if (data.itemId === parseInt(itemId)) {
        fetchBids(); // Refresh bid history
        setNewBidAnimation(data.bidId);
        setTimeout(() => setNewBidAnimation(null), 2000);
      }
    });

    return () => {
      socketService.offBidUpdate();
    };
  }, [itemId]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const bidTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - bidTime) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getBidderRank = (index, totalBids) => {
    if (index === 0) return { icon: Crown, color: 'text-yellow-600', label: 'Leading' };
    if (index === 1 && totalBids > 1) return { icon: Award, color: 'text-gray-500', label: '2nd Place' };
    if (index === 2 && totalBids > 2) return { icon: Award, color: 'text-orange-600', label: '3rd Place' };
    return null;
  };

  if (loading) {
    return (
      <div className="card p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Live Bid History
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {bids.length}
          </span>
        </h3>
      </div>
      
      <div className="p-4">
        {bids.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No bids yet</p>
            <p className="text-gray-400 text-sm">Be the first to place a bid!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {bids.map((bid, index) => {
              const rank = getBidderRank(index, bids.length);
              const isNewBid = newBidAnimation === bid.id;
              
              return (
                <div 
                  key={bid.id} 
                  className={`relative p-3 rounded-xl border transition-all duration-500 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md' 
                      : isNewBid
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 animate-pulse'
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  {/* Rank Badge */}
                  {rank && (
                    <div className="absolute -top-2 -right-2">
                      <div className={`bg-white rounded-full p-1 shadow-lg border-2 ${
                        index === 0 ? 'border-yellow-300' : 'border-gray-300'
                      }`}>
                        <rank.icon className={`h-3 w-3 ${rank.color}`} />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {bid.bidder?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {bid.bidder?.username}
                          </span>
                          {index === 0 && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                              Leading Bid
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 ml-10">
                        {formatTimeAgo(bid.timestamp)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <DollarSign className={`h-4 w-4 ${
                          index === 0 ? 'text-green-600' : 'text-gray-500'
                        }`} />
                        <span className={`font-bold text-lg ${
                          index === 0 ? 'text-green-600' : 'text-gray-700'
                        }`}>
                          {bid.amount}
                        </span>
                      </div>
                      
                      {index > 0 && bids[index - 1] && (
                        <div className="text-xs text-gray-400">
                          +${(bid.amount - bids[index - 1].amount).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* New bid indicator */}
                  {isNewBid && (
                    <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-ping"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {bids.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Total Bids: {bids.length}</span>
              <span>
                Avg: ${bids.length > 0 ? (bids.reduce((sum, bid) => sum + parseFloat(bid.amount), 0) / bids.length).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidHistory;