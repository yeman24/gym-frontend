import axios from "axios";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api" });
api.interceptors.request.use((config) => { const token = localStorage.getItem("ironhouse_token"); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
const unwrap = (promise) => promise.then((response) => response.data.data);
export const getPlans = () => unwrap(api.get("/plans"));
export const getClasses = () => unwrap(api.get("/classes"));
export const bookClass = (data) => unwrap(api.post("/bookings", data));
export const getTrainers = () => unwrap(api.get("/trainers"));
export const sendInquiry = (data) => unwrap(api.post("/inquiries", data));
export const sendChatMessage = (messages) => unwrap(api.post("/chat", { messages }));
export const login = (data) => unwrap(api.post("/auth/login", data));
export const getAdminResource = (resource) => unwrap(api.get(`/admin/${resource}`));
export const createAdminResource = (resource, data) => unwrap(api.post(`/admin/${resource}`, data));
export const updateAdminResource = (resource, id, data) => unwrap(api.patch(`/admin/${resource}/${id}`, data));
export const deleteAdminResource = (resource, id) => unwrap(api.delete(`/admin/${resource}/${id}`));
