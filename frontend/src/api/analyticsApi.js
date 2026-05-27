import axiosInstance from './axiosConfig';

export const getSummary = async () => {
  const response = await axiosInstance.get('/analytics/summary');
  return response.data;
};

export const getByCategory = async () => {
  const response = await axiosInstance.get('/analytics/by-category');
  return response.data;
};

export const getByStatus = async () => {
  const response = await axiosInstance.get('/analytics/by-status');
  return response.data;
};

export const getTrends = async () => {
  const response = await axiosInstance.get('/analytics/trends');
  return response.data;
};
