import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemService } from '../services/itemService';
import { bidService } from '../services/bidService';
import BidHistory from '../components/BidHistory';
import Timer from '../components/Timer';
import socketService from '../websocket/socket';
import {
  DollarSign,
  Gavel,
  Users,
  Heart,
  Share2,
  AlertCircle,
  TrendingUp,
  Crown,
  Zap,
  ArrowLeft,
  Plus,
  Minus
} from 'lucide-react';

const AuctionRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bidCount, setBidCount] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(12);
  const [recentBids, setRecentBids] = useState([]);
  const bidInputRef = useRef(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await itemService.getItemById(id);
        setItem(data);
        setBidAmount((parseFloat(data.currentPrice) + 1).toString());

        const count = await bidService.getBidCount(id);
        setBidCount(count);

        const bids = await bidService.getBidsByItem(id);
        setRecentBids(bids.slice(0, 3));
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();

    if (isAuthenticated) {
      socketService.connect();
      socketService.joinAuction(id);

      socketService.onBidUpdate(id, (data) => {
        if (data.itemId === parseInt(id)) {
          setItem(prev => ({ ...prev, currentPrice: data.amount }));
          setBidCount(prev => prev + 1);
          setSuccess('New bid placed! 🎉');
          setTimeout(() => setSuccess(''), 3000);
        }
      });
    }

    return () => {
      if (isAuthenticated) {
        socketService.leaveAuction(id);
        socketService.offBidUpdate();
      }
    };
  }, [id, isAuthenticated]);

  const handleBid = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setBidding(true);
    setError('');
    setSuccess('');

    try {
      const bid = await bidService.placeBid({
        itemId: parseInt(id),
        amount: parseFloat(bidAmount)
      });

      setItem(prev => ({ ...prev, currentPrice: bid.amount }));
      setBidAmount((parseFloat(bid.amount) + 1).toString());
      setSuccess('Bid placed successfully! 🎉');

      // Add visual feedback
      bidInputRef.current?.classList.add('bid-animation');
      setTimeout(() => {
        bidInputRef.current?.classList.remove('bid-animation');
      }, 1000);

    } catch (error) {
      console.error('Error placing bid:', error);
      let errorMessage = 'Failed to place bid. Please try again.';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setBidding(false);
    }
  };

  const quickBidAmounts = [1, 5, 10, 25];

  const adjustBidAmount = (increment) => {
    const current = parseFloat(bidAmount) || parseFloat(item.currentPrice);
    const newAmount = current + increment;
    setBidAmount(newAmount.toFixed(2));
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading auction room...</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center glass-effect rounded-2xl p-12 max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Auction Not Found</h2>
          <p className="text-gray-600 mb-6">The auction you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  const timeLeft = new Date(item.endTime) - new Date();
  const isEnding = timeLeft < 300000; // 5 minutes
  const isHighValue = item.currentPrice > 1000;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Auctions</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{onlineUsers} watching</span>
              </div>

              <button
                onClick={() => setIsWatching(!isWatching)}
                className={`p-2 rounded-full transition-colors ${isWatching ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`h-5 w-5 ${isWatching ? 'fill-current' : ''}`} />
              </button>

              <button className="p-2 rounded-full text-gray-400 hover:text-blue-500 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image and Basic Info */}
            <div className="card overflow-hidden">
              <div className="relative">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=500&fit=crop'}
                  alt={item.name}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />

                {/* Status Overlay */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.status === 'ACTIVE' ? 'status-active' :
                    item.status === 'PENDING' ? 'status-pending' : 'status-closed'
                    }`}>
                    {item.status}
                  </span>

                  {isHighValue && (
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Crown className="h-3 w-3 inline mr-1" />
                      Premium
                    </span>
                  )}
                </div>

                {/* Timer Overlay */}
                <div className="absolute top-4 right-4">
                  <Timer endTime={item.endTime} size="lg" />
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{item.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">{item.description}</p>

                {/* Price Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Current Bid</p>
                    <p className="text-2xl font-bold text-green-600">${item.currentPrice}</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Total Bids</p>
                    <p className="text-2xl font-bold text-blue-600">{bidCount}</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Starting Price</p>
                    <p className="text-2xl font-bold text-purple-600">${item.startingPrice}</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Increase</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {(((item.currentPrice - item.startingPrice) / item.startingPrice) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bidding Section */}
            {isAuthenticated && item.status === 'ACTIVE' && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Gavel className="h-6 w-6 mr-3 text-primary-600" />
                    Place Your Bid
                  </h3>
                  {isEnding && (
                    <div className="flex items-center space-x-2 text-red-600 animate-pulse">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-semibold">Ending Soon!</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {error}
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      {success}
                    </div>
                  </div>
                )}

                <form onSubmit={handleBid} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        ref={bidInputRef}
                        type="number"
                        step="0.01"
                        min={parseFloat(item.currentPrice) + 0.01}
                        className="input-field pl-10 text-lg font-semibold"
                        placeholder="Enter bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => adjustBidAmount(-1)}
                      className="p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => adjustBidAmount(1)}
                      className="p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quick Bid Buttons */}
                  <div className="flex space-x-2">
                    {quickBidAmounts.map(amount => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => adjustBidAmount(amount)}
                        className="px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        +${amount}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={bidding || parseFloat(bidAmount) <= parseFloat(item.currentPrice)}
                    className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 ${bidding
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'btn-primary transform hover:scale-105'
                      }`}
                  >
                    {bidding ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Placing Bid...
                      </div>
                    ) : (
                      `Place Bid - $${bidAmount}`
                    )}
                  </button>
                </form>
              </div>
            )}

            {!isAuthenticated && item.status === 'ACTIVE' && (
              <div className="card p-6 text-center">
                <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Join the Auction</h3>
                <p className="text-gray-600 mb-4">Sign in to place bids and participate in this exciting auction</p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Sign In to Bid
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BidHistory itemId={id} />

            {/* Recent Activity */}
            {recentBids.length > 0 && (
              <div className="card p-4">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-2">
                  {recentBids.map((bid, index) => (
                    <div key={bid.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{bid.bidder?.username}</span>
                      <span className="font-semibold text-green-600">${bid.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;