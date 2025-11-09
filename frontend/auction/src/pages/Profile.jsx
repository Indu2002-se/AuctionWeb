import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bidService } from '../services/bidService';
import { 
  User, 
  Trophy, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Award, 
  Calendar,
  Eye,
  Star,
  Target,
  Activity,
  Crown,
  Medal,
  Zap
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const data = await bidService.getMyBids();
        setMyBids(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  const totalBids = myBids.length;
  const totalSpent = myBids.reduce((sum, bid) => sum + parseFloat(bid.amount), 0);
  const wonAuctions = myBids.filter(bid => bid.item?.winner?.id === user?.id).length;
  const activeBids = myBids.filter(bid => bid.item?.status === 'ACTIVE').length;
  const winRate = totalBids > 0 ? ((wonAuctions / totalBids) * 100).toFixed(1) : 0;
  const avgBidAmount = totalBids > 0 ? (totalSpent / totalBids).toFixed(2) : 0;

  const memberSince = new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const getBadgeLevel = () => {
    if (wonAuctions >= 10) return { level: 'Diamond', color: 'from-blue-400 to-purple-500', icon: Crown };
    if (wonAuctions >= 5) return { level: 'Gold', color: 'from-yellow-400 to-orange-500', icon: Trophy };
    if (wonAuctions >= 2) return { level: 'Silver', color: 'from-gray-300 to-gray-500', icon: Medal };
    if (totalBids >= 5) return { level: 'Bronze', color: 'from-orange-300 to-red-400', icon: Award };
    return { level: 'Newcomer', color: 'from-green-300 to-blue-400', icon: Star };
  };

  const badge = getBadgeLevel();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading your profile...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'bids', label: 'My Bids', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600"></div>
          </div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                
                {/* Badge */}
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <badge.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{user?.username}</h1>
                    <p className="text-gray-600 text-lg mb-2">{user?.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {memberSince}</span>
                      </div>
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} text-white font-semibold`}>
                        <badge.icon className="h-4 w-4" />
                        <span>{badge.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="card p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalBids}</div>
            <div className="text-xs text-gray-600 font-medium">Total Bids</div>
          </div>
          
          <div className="card p-4 text-center">
            <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{wonAuctions}</div>
            <div className="text-xs text-gray-600 font-medium">Auctions Won</div>
          </div>
          
          <div className="card p-4 text-center">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(0)}</div>
            <div className="text-xs text-gray-600 font-medium">Total Spent</div>
          </div>
          
          <div className="card p-4 text-center">
            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{winRate}%</div>
            <div className="text-xs text-gray-600 font-medium">Win Rate</div>
          </div>
          
          <div className="card p-4 text-center">
            <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{activeBids}</div>
            <div className="text-xs text-gray-600 font-medium">Active Bids</div>
          </div>
          
          <div className="card p-4 text-center">
            <Zap className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">${avgBidAmount}</div>
            <div className="text-xs text-gray-600 font-medium">Avg Bid</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  {myBids.length === 0 ? (
                    <div className="text-center py-8">
                      <Eye className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No bidding activity yet</p>
                      <p className="text-gray-400 text-sm">Start bidding on auctions to see your activity here!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myBids.slice(0, 5).map(bid => (
                        <div key={bid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                              <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{bid.item?.name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(bid.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">${bid.amount}</p>
                            <p className={`text-sm ${
                              bid.item?.status === 'ACTIVE' ? 'text-green-600' : 
                              bid.item?.winner?.id === user?.id ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {bid.item?.status === 'ACTIVE' ? 'Active' : 
                               bid.item?.winner?.id === user?.id ? 'Won' : 'Lost'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bids' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All My Bids</h3>
                {myBids.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No bids placed yet</p>
                    <p className="text-gray-400 text-sm">Start bidding on auctions to build your history!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myBids.map(bid => (
                      <div key={bid.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <img
                            src={bid.item?.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}
                            alt={bid.item?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{bid.item?.name}</p>
                            <p className="text-sm text-gray-500 mb-1">{bid.item?.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <span>{new Date(bid.timestamp).toLocaleDateString()}</span>
                              <span className={`px-2 py-1 rounded-full ${
                                bid.item?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                bid.item?.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {bid.item?.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-gray-900">${bid.amount}</p>
                          <p className={`text-sm font-medium ${
                            bid.item?.winner?.id === user?.id ? 'text-green-600' : 
                            bid.item?.status === 'ACTIVE' ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {bid.item?.winner?.id === user?.id ? '🏆 Won' : 
                             bid.item?.status === 'ACTIVE' ? '🔄 Active' : '❌ Lost'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Current Badge */}
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${badge.color} text-white text-center`}>
                    <badge.icon className="h-12 w-12 mx-auto mb-3" />
                    <h4 className="text-xl font-bold mb-2">{badge.level}</h4>
                    <p className="text-sm opacity-90">Your current level</p>
                  </div>

                  {/* Achievements */}
                  <div className={`p-6 rounded-2xl border-2 text-center ${
                    totalBids >= 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Target className={`h-12 w-12 mx-auto mb-3 ${
                      totalBids >= 1 ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <h4 className="text-lg font-bold mb-2">First Bid</h4>
                    <p className="text-sm text-gray-600">Place your first bid</p>
                    {totalBids >= 1 && <p className="text-xs text-green-600 mt-2">✓ Completed</p>}
                  </div>

                  <div className={`p-6 rounded-2xl border-2 text-center ${
                    wonAuctions >= 1 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Trophy className={`h-12 w-12 mx-auto mb-3 ${
                      wonAuctions >= 1 ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                    <h4 className="text-lg font-bold mb-2">First Win</h4>
                    <p className="text-sm text-gray-600">Win your first auction</p>
                    {wonAuctions >= 1 && <p className="text-xs text-yellow-600 mt-2">✓ Completed</p>}
                  </div>

                  <div className={`p-6 rounded-2xl border-2 text-center ${
                    totalBids >= 10 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Activity className={`h-12 w-12 mx-auto mb-3 ${
                      totalBids >= 10 ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <h4 className="text-lg font-bold mb-2">Active Bidder</h4>
                    <p className="text-sm text-gray-600">Place 10 bids</p>
                    <p className="text-xs text-gray-500 mt-1">{totalBids}/10</p>
                    {totalBids >= 10 && <p className="text-xs text-blue-600 mt-2">✓ Completed</p>}
                  </div>

                  <div className={`p-6 rounded-2xl border-2 text-center ${
                    wonAuctions >= 5 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Crown className={`h-12 w-12 mx-auto mb-3 ${
                      wonAuctions >= 5 ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <h4 className="text-lg font-bold mb-2">Champion</h4>
                    <p className="text-sm text-gray-600">Win 5 auctions</p>
                    <p className="text-xs text-gray-500 mt-1">{wonAuctions}/5</p>
                    {wonAuctions >= 5 && <p className="text-xs text-purple-600 mt-2">✓ Completed</p>}
                  </div>

                  <div className={`p-6 rounded-2xl border-2 text-center ${
                    totalSpent >= 1000 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <DollarSign className={`h-12 w-12 mx-auto mb-3 ${
                      totalSpent >= 1000 ? 'text-red-600' : 'text-gray-400'
                    }`} />
                    <h4 className="text-lg font-bold mb-2">Big Spender</h4>
                    <p className="text-sm text-gray-600">Spend $1,000 total</p>
                    <p className="text-xs text-gray-500 mt-1">${totalSpent.toFixed(0)}/1000</p>
                    {totalSpent >= 1000 && <p className="text-xs text-red-600 mt-2">✓ Completed</p>}
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

export default Profile;