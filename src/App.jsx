// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Componentes
import Home from "./components/Home";
import Camas from "./components/Camas";
import PacienteForm from "./PacienteForm";
import NuevoPaciente from "./components/NuevoPaciente";
import Login from "./components/Login";
import ListaServicios from "./components/ListaServicios";
import PrivateRoute from "./components/PrivateRoute";
import ListaCamas from "./components/ListaCamas";
import Hoja1 from "./Hoja1/Hoja1basico"; // 
import Hoja2 from "./hoja2/Hoja2";
import Hoja3 from "./HOJA3/Hoja3";
import Hoja4 from "./HOJA4/Hoja4";
import Hoja5 from "./hoja5/ComponenteHoja5";
import Hoja6 from "./HOJA6/Hoja6";
import Notification from "./components/Notification";
function App() {
  return (
    <div>
    <Notification />
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas privadas agrupadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/camas" element={<Camas />} />
        <Route path="/nuevo-paciente" element={<NuevoPaciente />} />
        <Route path="/lista" element={<ListaServicios />} />
        <Route path="/lista/:servicio" element={<ListaCamas />} />
        <Route path="/paciente/:id" element={<PacienteForm />} />
        <Route path="/hoja1/:id" element={<Hoja1 />} /> {/* <-- Hoja1 */}
        <Route path="/hoja2/:id" element={<Hoja2 />} /> {/* 👈 nueva ruta */}
        <Route path="/hoja3/:id" element={<Hoja3 />} /> 
        <Route path="/hoja4/:id" element={<Hoja4 />} />
        <Route path="/hoja5/:id" element={<Hoja5 />} />
        <Route path="/hoja6/:id" element={<Hoja6 />} />

        {/* Redirigir rutas no definidas a "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </div>
  );
}

export default App;
