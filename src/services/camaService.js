// src/services/camaService.js
import axios from "axios";

const API_URL = "http://localhost:3002/api/camas";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: token ? `Bearer ${token}` : "" };
};

export const getCamas = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeaders() });
  // Filtrar solo UCI si quieres
  return res.data.filter(cama => cama.servicio === "UCI");
};
