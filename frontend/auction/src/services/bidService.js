import axiosInstance from './axiosConfig';

export const bidService = {
  placeBid: async (bidData) => {
    const response = await axiosInstance.post('/bids', bidData);
    return response.data;
  },

  getBidsByItem: async (itemId) => {
    const response = await axiosInstance.get(`/bids/item/${itemId}`);
    return response.data;
  },

  getMyBids: async () => {
    const response = await axiosInstance.get('/bids/my-bids');
    return response.data;
  },

  getHighestBid: async (itemId) => {
    const response = await axiosInstance.get(`/bids/highest/${itemId}`);
    return response.data;
  },

  getBidCount: async (itemId) => {
    const response = await axiosInstance.get(`/bids/count/${itemId}`);
    return response.data;
  }
};