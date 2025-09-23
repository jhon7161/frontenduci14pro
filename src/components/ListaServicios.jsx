// src/components/ListaServicios.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const servicios = [
  "UCI",
  "UCI Pediátrica",
  "Consulta Externa",
  "Hospitalización",
  "Urgencias"
];

export default function ListaServicios() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Servicios</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {servicios.map((s, i) => (
          <div
            key={i}
            onClick={() => navigate(`/lista/${encodeURIComponent(s)}`)}
            style={{
              cursor: "pointer",
              padding: "20px 30px",
              backgroundColor: "#2196F3",
              color: "#fff",
              borderRadius: "10px",
              minWidth: "180px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
