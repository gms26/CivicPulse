import axiosInstance from './axiosConfig';

export const updateIssueStatus = async (id, status, comment) => {
  const response = await axiosInstance.put(`/admin/issues/${id}/status`, { status, comment });
  return response.data;
};

export const updateIssuePriority = async (id, priority) => {
  const response = await axiosInstance.put(`/admin/issues/${id}/priority`, { priority });
  return response.data;
};

export const assignIssue = async (id, assignedAdminId) => {
  const response = await axiosInstance.put(`/admin/issues/${id}/assign`, { assignedAdminId });
  return response.data;
};

export const getAdminIssues = async (params) => {
  const response = await axiosInstance.get('/admin/issues', { params });
  return response.data;
};
