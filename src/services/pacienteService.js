import axios from "axios";

const API_URL = "http://localhost:3002/api/pacientes";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// 📌 Obtener todos los pacientes
export const getPacientes = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeaders() });
  return res.data;
};

// 📌 Crear paciente
export const postPaciente = async (data) => {
  const res = await axios.post(`${API_URL}/crear`, data, {
    headers: getAuthHeaders(),
  });
  return res.data.paciente;
};

// 📌 Actualizar paciente (general)
export const putPaciente = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data.paciente;
};

// 📌 Nuevo: actualizar solo datos clínicos (sin cama)
export const updateDatos = async (id, hoja1Data) => {
  try {
    const url = `${API_URL}/${id}/datos`;

    const res = await axios.put(url, { hoja1: hoja1Data }, {
      headers: {
        Authorization: localStorage.getItem("token") 
          ? `Bearer ${localStorage.getItem("token")}` 
          : "",
        "Content-Type": "application/json"
      }
    });

    return res.data; // backend devuelve paciente actualizado
  } catch (error) {
    console.error("Error updateDatos:", error.response?.data || error.message);
    throw error;
  }
};

// 📌 Asignar cama
export const asignarCama = async (id, camaId) => {
  const res = await axios.put(
    `${API_URL}/${id}/asignar-cama`,
    { camaId },
    { headers: getAuthHeaders() }
  );
  return res.data; // backend devuelve paciente con cama
};

// 📌 Eliminar paciente
export const deletePaciente = async (id) => {
  await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return id;
};
