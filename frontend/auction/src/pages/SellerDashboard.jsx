import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { itemService } from '../services/itemService';
import { 
  Plus, 
  Package, 
  DollarSign, 
  Users, 
  Eye,
  Edit,
  Trash2,
  Clock,
  Activity
} from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    startingPrice: '',
    endTime: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const data = await itemService.getMyItems();
      
      if (Array.isArray(data)) {
        setMyItems(data);
      } else {
        setMyItems([]);
      }
      setError('');
    } catch (error) {
      setError(`Failed to load items: ${error.response?.data?.error || error.message}`);
      setMyItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    try {
      const itemData = {
        ...newItem,
        startingPrice: parseFloat(newItem.startingPrice),
        endTime: new Date(newItem.endTime).toISOString()
      };
      
      await itemService.createItem(itemData);
      
      // Reset form and close modal
      setNewItem({ name: '', description: '', startingPrice: '', endTime: '', imageUrl: '' });
      setShowAddForm(false);
      
      // Refresh the items list
      await fetchMyItems();
      
    } catch (error) {
      let errorMessage = 'Failed to create item';
      
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
    }
  };

  // Ensure myItems is always an array
  const itemsArray = Array.isArray(myItems) ? myItems : [];
  
  const totalItems = itemsArray.length;
  const activeItems = itemsArray.filter(item => item.status === 'ACTIVE').length;
  const totalRevenue = itemsArray.reduce((sum, item) => sum + parseFloat(item.currentPrice || 0), 0);
  const totalBids = itemsArray.reduce((sum, item) => sum + (item.bidCount || item.bids?.length || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
            <button 
              onClick={fetchMyItems}
              className="ml-4 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
            >
              Retry
            </button>
          </div>
        )}



        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalItems}</div>
            <div className="text-gray-600 font-medium">Total Items</div>
          </div>
          
          <div className="card p-6 text-center">
            <Activity className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{activeItems}</div>
            <div className="text-gray-600 font-medium">Active Auctions</div>
          </div>
          
          <div className="card p-6 text-center">
            <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">${totalRevenue.toFixed(0)}</div>
            <div className="text-gray-600 font-medium">Total Revenue</div>
          </div>
          
          <div className="card p-6 text-center">
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalBids}</div>
            <div className="text-gray-600 font-medium">Total Bids</div>
          </div>
        </div>

        {/* Items List */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">My Auction Items</h2>
          </div>
          
          <div className="p-6">
            {itemsArray.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first auction item</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  Add Your First Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {itemsArray.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              item.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-gray-500">
                              <Clock className="h-4 w-4 inline mr-1" />
                              Ends: {new Date(item.endTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          ${item.currentPrice || item.startingPrice}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          {item.bidCount || item.bids?.length || 0} bids
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Auction Item</h3>
              
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Enter item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    className="input-field"
                    placeholder="Describe your item"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    className="input-field"
                    placeholder="0.00"
                    value={newItem.startingPrice}
                    onChange={(e) => setNewItem({...newItem, startingPrice: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auction End Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="input-field"
                    value={newItem.endTime}
                    onChange={(e) => setNewItem({...newItem, endTime: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;