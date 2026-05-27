import axiosInstance from './axiosConfig';

export const createIssue = async (issueData, imageFile) => {
  const formData = new FormData();
  
  // Convert JSON to Blob for multipart/form-data
  const jsonBlob = new Blob([JSON.stringify(issueData)], { type: 'application/json' });
  formData.append('request', jsonBlob);
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await axiosInstance.post('/issues', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
