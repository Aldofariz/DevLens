import api from "../../utils/axiosInstance";

export const getMessages = (projectId)       => api.get(`api/projects/${projectId}/messages`);
export const sendMessage = (projectId, data) => api.post(`api/projects/${projectId}/messages`, data);
