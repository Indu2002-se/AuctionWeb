import axiosInstance from './axiosConfig';

export const itemService = {
  getAllItems: async () => {
    const response = await axiosInstance.get('/items/all');
    return response.data;
  },

  getActiveItems: async () => {
    const response = await axiosInstance.get('/items/active');
    return response.data;
  },

  getItemById: async (id) => {
    const response = await axiosInstance.get(`/items/${id}`);
    return response.data;
  },

  createItem: async (item) => {
    const response = await axiosInstance.post('/items', item);
    return response.data;
  },

  getMyItems: async () => {
    const response = await axiosInstance.get('/items/my-items');
    return response.data;
  }
};