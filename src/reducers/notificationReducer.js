// src/reducers/notificationReducer.js
import { createSlice } from '@reduxjs/toolkit';

// Estado inicial con mensaje y tipo
const initialState = {
  message: '',
  type: '', // 'success', 'error', 'info', etc.
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const { message, type } = action.payload;
      state.message = message;
      state.type = type || 'info';
    },
    clearNotification(state) {
      state.message = '';
      state.type = '';
    },
  },
});

// Variable para guardar el timeout activo
let timeoutId = null;

// Acción con timeout incluida
export const notifyWithTimeout = (message, type = 'info', timeout = 5000) => {
  return async (dispatch) => {
    // Limpia timeout anterior si existe
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    dispatch(setNotification({ message, type }));

    // Programa limpieza
    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
      timeoutId = null;
    }, timeout);
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
