import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// URL base de la API
const API_PACIENTES = "http://localhost:3002/api/pacientes";

// Función de utilidad para obtener la configuración de autenticación
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// --- Thunks para operaciones asíncronas (CRUD) ---
// Añadir un nuevo Thunk para crear un paciente
export const createPaciente = createAsyncThunk(
  "pacientes/create",
  async (newPacienteData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        API_PACIENTES,
        newPacienteData,
        getAuthConfig()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// Obtener todos los pacientes
export const fetchPacientes = createAsyncThunk(
  "pacientes/fetchPacientes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_PACIENTES, getAuthConfig());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Obtener un paciente por ID
export const fetchPacienteById = createAsyncThunk(
  "pacientes/fetchPacienteById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_PACIENTES}/${id}`, getAuthConfig());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Actualizar un paciente existente
export const updatePaciente = createAsyncThunk(
  "pacientes/update",
  async ({ id, hoja, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_PACIENTES}/${id}/${hoja}`, data, getAuthConfig());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// --- Slice de Redux ---
const initialState = {
  pacienteSeleccionado: {
    id: null,
    nombre: "",
    hoja1: {},
    hoja2: {},
    hoja3: {},
    hoja4: {},
    hoja5: {},
    hoja6: {},
  },
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  allPacientes: [],
};

const pacienteSlice = createSlice({
  name: "pacientes",
  initialState,
  reducers: {
    clearPacienteSeleccionado: (state) => {
      state.pacienteSeleccionado = initialState.pacienteSeleccionado;
      state.error = null;
    },
    updateHojaLocal: (state, action) => {
      const { hoja, datos } = action.payload;
      const hojaKey = hoja.toLowerCase();
      if (state.pacienteSeleccionado[hojaKey] !== undefined) {
        state.pacienteSeleccionado[hojaKey] = datos;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPacientes
      .addCase(fetchPacientes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPacientes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allPacientes = action.payload;
      })
      .addCase(fetchPacientes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error al cargar los pacientes.";
      })
      // fetchPacienteById
      .addCase(fetchPacienteById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPacienteById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pacienteSeleccionado = action.payload;
      })
      .addCase(fetchPacienteById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "No se pudo encontrar el paciente.";
        state.pacienteSeleccionado = initialState.pacienteSeleccionado;
      })
      // updatePaciente
      .addCase(updatePaciente.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePaciente.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pacienteSeleccionado = action.payload;
      })
      .addCase(updatePaciente.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error al actualizar el paciente.";
      })
      // createPaciente
      .addCase(createPaciente.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPaciente.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allPacientes.push(action.payload);
        state.pacienteSeleccionado = action.payload;
      })
      .addCase(createPaciente.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error al crear el paciente.";
      });
  },
});

export const { clearPacienteSeleccionado, updateHojaLocal } = pacienteSlice.actions;

export default pacienteSlice.reducer;