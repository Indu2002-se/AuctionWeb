import axiosInstance from '../services/axiosConfig';

export const testAPI = {
  // Test basic backend connectivity
  testHealth: async () => {
    try {
      const response = await axiosInstance.get('/test/health');
      console.log('Health check response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Test items endpoint
  testItems: async () => {
    try {
      const response = await axiosInstance.get('/test/items');
      console.log('Items test response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Items test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Test database connectivity
  testDatabase: async () => {
    try {
      const response = await axiosInstance.get('/test/database');
      console.log('Database test response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Database test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Test bid placement (requires authentication)
  testBidPlacement: async (itemId, amount) => {
    try {
      const response = await axiosInstance.post('/bids', {
        itemId: itemId,
        amount: amount
      });
      console.log('Bid placement test response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Bid placement test failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message,
        status: error.response?.status
      };
    }
  },

  // Run all tests
  runAllTests: async () => {
    console.log('🧪 Running API Tests...');
    
    const results = {
      health: await testAPI.testHealth(),
      items: await testAPI.testItems(),
      database: await testAPI.testDatabase()
    };

    console.log('📊 Test Results:', results);
    return results;
  }
};

// Auto-run tests in development
if (import.meta.env.DEV) {
  window.testAPI = testAPI;
  console.log('🔧 API test utilities available at window.testAPI');
}