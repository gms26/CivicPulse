import axiosInstance from './axiosConfig';

export const createIssue = async (formData) => {
  const response = await axiosInstance.post('/issues', formData);
  return response.data;
};

export const getAllIssues = async (params) => {
  const response = await axiosInstance.get('/issues', { params });
  return response.data;
};

export const getMyIssues = async (params) => {
  const response = await axiosInstance.get('/issues/my', { params });
  return response.data;
};

export const getIssueById = async (id) => {
  const response = await axiosInstance.get(`/issues/${id}`);
  return response.data;
};

export const deleteIssue = async (id) => {
  await axiosInstance.delete(`/issues/${id}`);
};
