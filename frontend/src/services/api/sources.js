import api from "../../utils/axiosInstance";

export const getSources    = (projectId)         => api.get(`api/projects/${projectId}/sources`);
export const addSource     = (projectId, formData) =>
  api.post(`api/projects/${projectId}/sources`, formData);
export const deleteSource  = (projectId, sourceId) => api.delete(`api/projects/${projectId}/sources/${sourceId}`);
