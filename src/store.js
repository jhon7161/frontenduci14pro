import { configureStore } from "@reduxjs/toolkit";
import camasReducer from "./reducers/camasSlice";
import  pacienteReducer  from "./reducers/pacienteSlice";
import authReducer from "./reducers/authSlice";
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    auth: authReducer,
    camas: camasReducer,
    pacientes: pacienteReducer,
  
  },
});

export default store;
