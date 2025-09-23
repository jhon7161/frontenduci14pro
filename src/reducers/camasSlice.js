// src/reducers/camasSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// URLs de la API
const API_CAMAS = "http://localhost:3002/api/camas";
const API_PACIENTES = "http://localhost:3002/api/pacientes";

// Función de utilidad para obtener la configuración de autenticación
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No se encontró el token de autenticación.");
    // Devolver un objeto vacío o lanzar un error según la necesidad
    return {};
  }
  return { headers: { Authorization: `Bearer ${token}` } };
};

// --- Thunks para operaciones asíncronas ---

// Obtener todas las camas
export const fetchCamas = createAsyncThunk(
  "camas/fetchCamas",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_CAMAS, getAuthConfig());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Asignar paciente a una cama (versión unificada)
export const asignarPacienteACama = createAsyncThunk(
  "camas/asignarPaciente",
  async ({ pacienteId, camaId }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_PACIENTES}/${pacienteId}/asignar-cama`,
        { camaId },
        getAuthConfig()
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Liberar cama (versión unificada)
export const liberarCama = createAsyncThunk(
  "camas/liberarCama",
  async (camaId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_CAMAS}/${camaId}/liberar`,
        {},
        getAuthConfig()
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Trasladar paciente a otra cama
export const trasladarPacienteACama = createAsyncThunk(
  "camas/trasladarPaciente",
  async ({ pacienteId, nuevaCamaId }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_PACIENTES}/${pacienteId}/trasladar`,
        { nuevaCamaId },
        getAuthConfig()
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- Slice de Redux ---

const camasSlice = createSlice({
  name: "camas",
  initialState: {
    list: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    // Reducers síncronos si fueran necesarios
  },
  extraReducers: (builder) => {
    builder
      // Casos para fetchCamas
      .addCase(fetchCamas.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCamas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCamas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error al cargar las camas.";
      })
      // Casos para asignar y trasladar
      .addCase(asignarPacienteACama.fulfilled, (state, action) => {
        const updatedCama = action.payload.cama;
        const index = state.list.findIndex(cama => cama._id === updatedCama._id);
        if (index !== -1) {
          state.list[index] = updatedCama;
        }
      })
      .addCase(trasladarPacienteACama.fulfilled, (state, action) => {
        const { camaAnterior, camaNueva } = action.payload;

        // Actualizar cama anterior
        const indexAnterior = state.list.findIndex(cama => cama._id === camaAnterior._id);
        if (indexAnterior !== -1) {
          state.list[indexAnterior] = camaAnterior;
        }

        // Actualizar cama nueva
        const indexNueva = state.list.findIndex(cama => cama._id === camaNueva._id);
        if (indexNueva !== -1) {
          state.list[indexNueva] = camaNueva;
        }
      })
      // Casos para liberarCama
      .addCase(liberarCama.fulfilled, (state, action) => {
        const updatedCama = action.payload;
        const index = state.list.findIndex(cama => cama._id === updatedCama._id);
        if (index !== -1) {
          state.list[index] = updatedCama;
        }
      })
      // Manejar rechazos comunes para thunks que modifican el estado
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message || "Error desconocido";
        }
      );
  },
});

export default camasSlice.reducer;