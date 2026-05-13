import api from "../../utils/axiosInstance";

export const getNotes    = (projectId)             => api.get(`api/projects/${projectId}/notes`);
export const createNote  = (projectId, data)       => api.post(`api/projects/${projectId}/notes`, data);
export const updateNote  = (projectId, noteId, data) => api.patch(`api/projects/${projectId}/notes/${noteId}`, data);
export const deleteNote  = (projectId, noteId)     => api.delete(`api/projects/${projectId}/notes/${noteId}`);
