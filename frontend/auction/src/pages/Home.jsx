import { useState, useEffect } from 'react';
import { itemService } from '../services/itemService';
import ItemCard from '../components/ItemCard';
import { Search, Filter, TrendingUp, Users, Clock, Gavel, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('endTime');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getAllItems();
        // Ensure data is an array
        const itemsArray = Array.isArray(data) ? data : [];
        setItems(itemsArray);
        setFilteredItems(itemsArray);
      } catch (error) {
        console.error('Error fetching items:', error);
        // Set empty array on error
        setItems([]);
        setFilteredItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.currentPrice - a.currentPrice;
        case 'bids':
          return (b.bidCount || b.bids?.length || 0) - (a.bidCount || a.bids?.length || 0);
        case 'endTime':
          return new Date(a.endTime) - new Date(b.endTime);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, statusFilter, sortBy]);

  const activeAuctions = items.filter(item => item.status === 'ACTIVE').length;
  const totalBids = items.reduce((sum, item) => sum + (item.bidCount || item.bids?.length || 0), 0);
  const hotAuctions = items.filter(item => (item.bidCount || item.bids?.length || 0) > 5).length;

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading amazing auctions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                <Gavel className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Live Auction
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover unique items, place competitive bids, and win amazing treasures in our real-time auction platform
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Start Bidding Today
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-8 rounded-xl transition-all duration-300">
                  Learn More
                </button>
              </div>
            )}

            {isAuthenticated && user?.userType === 'SELLER' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/seller-dashboard')}
                  className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Manage Your Auctions
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <Sparkles className="h-8 w-8 text-yellow-400" />
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse">
          <TrendingUp className="h-10 w-10 text-green-400" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-effect rounded-2xl p-6 text-center">
            <Clock className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{activeAuctions}</div>
            <div className="text-gray-600 font-medium">Active Auctions</div>
          </div>
          <div className="glass-effect rounded-2xl p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalBids}</div>
            <div className="text-gray-600 font-medium">Total Bids Placed</div>
          </div>
          <div className="glass-effect rounded-2xl p-6 text-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{hotAuctions}</div>
            <div className="text-gray-600 font-medium">Hot Auctions</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Search and Filter Section */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for amazing items..."
                className="input-field pl-12 bg-white/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="input-field pl-10 pr-8 bg-white/50 min-w-[140px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">🟢 Active</option>
                  <option value="PENDING">🟡 Pending</option>
                  <option value="CLOSED">🔴 Closed</option>
                </select>
              </div>

              <select
                className="input-field bg-white/50 min-w-[140px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="endTime">⏰ Ending Soon</option>
                <option value="price">💰 Highest Price</option>
                <option value="bids">🔥 Most Bids</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-12 max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No auctions found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new items</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredItems.length} Auction{filteredItems.length !== 1 ? 's' : ''} Found
              </h2>
              <div className="text-sm text-gray-600">
                Showing {filteredItems.length} of {items.length} total auctions
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;