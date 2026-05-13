import api from "../../utils/axiosInstance";

export const getProjects    = ()           => api.get("api/projects");
export const createProject  = (data)       => api.post("api/projects", data);
export const updateProject  = (id, data)   => api.patch(`api/projects/${id}`, data);
export const deleteProject  = (id)         => api.delete(`api/projects/${id}`);
