import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../reducers/authSlice";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Redirige al login si no hay token
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  const opciones = [
    { titulo: "Gestión de Camas", descripcion: "Asignar y liberar pacientes en UCI", color: "#4CAF50", ruta: "/camas" },
    { titulo: "Lista de Pacientes", descripcion: "Ver y buscar pacientes ingresados", color: "#2196F3", ruta: "/lista" },
    { titulo: "Nuevo Paciente", descripcion: "Registrar un paciente nuevo", color: "#FF9800", ruta: "/nuevo-paciente" },
  ];

  // Funciones para animación de botones
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "translateY(-5px)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  };

  const btnLogoutStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.2s",
  };

  const cardStyle = {
    cursor: "pointer",
    color: "#fff",
    padding: "30px 40px",
    borderRadius: "12px",
    minWidth: "220px",
    maxWidth: "260px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "transform 0.2s, box-shadow 0.2s",
    textAlign: "center",
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px", color: "#333" }}>Sistema UCI</h1>
        <p style={{ fontSize: "18px", color: "#555" }}>Seleccione una opción para continuar</p>
        <button
          onClick={handleLogout}
          style={btnLogoutStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e53935")}
        >
          Cerrar Sesión
        </button>
      </header>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "30px" }}>
        {opciones.map((opcion, index) => (
          <div
            key={index}
            onClick={() => navigate(opcion.ruta)}
            style={{ ...cardStyle, backgroundColor: opcion.color }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>{opcion.titulo}</h2>
            <p style={{ fontSize: "14px", lineHeight: "1.5" }}>{opcion.descripcion}</p>
          </div>
        ))}
      </div>

      <footer style={{ textAlign: "center", marginTop: "60px", color: "#999" }}>
        &copy; {new Date().getFullYear()} Unidad de Cuidados Intensivos
      </footer>
    </div>
  );
}
