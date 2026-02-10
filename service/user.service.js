import instance from "@/lib/axios/instance";
import endpoint from "./endpoint";

const UserService = {
  getUser: (params) => instance.get(`${endpoint.USER}?${params}`),
  getUserById: (id) => instance.get(`${endpoint.USER}/${id}`),
  createUser: (data) => instance.post(`${endpoint.USER}`, data),
  updateUser: (id, data) => instance.put(`${endpoint.USER}/${id}`, data),
  deleteUser: (id) => instance.delete(`${endpoint.USER}/${id}`),
};

export default UserService;
