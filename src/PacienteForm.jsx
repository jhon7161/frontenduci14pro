import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPacienteById } from "./reducers/pacienteSlice";
import HojaNav from "./Hoja1/Reutilizables/HojaNav";

export default function PacienteForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pacienteSeleccionado: paciente, status, error } = useSelector(
    (state) => state.pacientes
  );

  useEffect(() => {
    if (id) dispatch(fetchPacienteById(id));
  }, [id, dispatch]);

  if (status === "loading") return <p>Cargando paciente...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!paciente?._id) return <p>Paciente no encontrado.</p>;

  const fechaIngreso = new Date(paciente.fechaIngreso).toLocaleString();
  const fechaActual = paciente.updatedAt
    ? new Date(paciente.updatedAt).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Datos del paciente</h2>
      <div>
        <label>Nombres:</label>
        <input type="text" value={paciente.nombres} readOnly />
      </div>
      <div>
        <label>Apellidos:</label>
        <input type="text" value={paciente.apellidos} readOnly />
      </div>
      <div>
        <label>Historia Clínica:</label>
        <input type="text" value={paciente.historiaClinica} readOnly />
      </div>
      <div>
        <label>Cama:</label>
        <input
          type="text"
          value={`${paciente.cama.numero} - ${paciente.cama.servicio}`}
          readOnly
        />
      </div>
      <div>
        <label>Fecha de ingreso:</label>
        <input type="text" value={fechaIngreso} readOnly />
      </div>
      <div>
        <label>Fecha actual:</label>
        <input type="text" value={fechaActual} readOnly />
      </div>
      <div>
        <label>Número de ingreso:</label>
        <input type="text" value={paciente.ingreso} readOnly />
      </div>

      {/* BOTONES DE NAVEGACIÓN */}
      <HojaNav pacienteId={id} />
      
    </div>
  );
}
