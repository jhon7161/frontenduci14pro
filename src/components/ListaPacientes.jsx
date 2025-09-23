// src/components/ListaPacientes.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function ListaPacientes() {
  const { servicio } = useParams();
  return (
    <div style={{ padding: "40px" }}>
      <h1>Pacientes en {servicio}</h1>
    </div>
  );
}
