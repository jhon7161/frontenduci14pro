import React from "react";

const DatosBasicos = ({ paciente, fechaActual }) => {
  if (!paciente) return null;

  return (
    <div className="datos-basicos-container">
      <h3>Datos Básicos</h3>

      <div className="datos-basicos-row">
        <label>Nombre:</label>
        <input
          type="text"
          value={`${paciente?.nombres || ""} ${paciente?.apellidos || ""}`}
          readOnly
          className="datos-basicos-input"
        />
      </div>

      <div className="datos-basicos-row">
        <label>Historia Clínica:</label>
        <input
          type="text"
          value={paciente?.historiaClinica || ""}
          readOnly
          className="datos-basicos-input"
        />
      </div>

      <div className="datos-basicos-row">
        <label>Fecha de ingreso:</label>
        <input
          type="text"
          value={paciente?.fechaIngreso ? new Date(paciente.fechaIngreso).toLocaleDateString() : ""}
          readOnly
          className="datos-basicos-input"
        />
      </div>

      <div className="datos-basicos-row">
        <label>Número de ingreso:</label>
        <input
          type="text"
          value={paciente?.ingreso || ""}
          readOnly
          className="datos-basicos-input"
        />
      </div>

      <div className="datos-basicos-row">
        <label>Fecha actual:</label>
        <input
          type="text"
          value={fechaActual || ""}
          readOnly
          className="datos-basicos-input"
        />
      </div>

      <div className="datos-basicos-row">
        <label>Cama:</label>
        <input
          type="text"
          value={`Cama ${paciente?.cama?.numero || ""} - Servicio: ${paciente?.cama?.servicio || ""}`}
          readOnly
          className="datos-basicos-input"
        />
      </div>
    </div>
  );
};

export default DatosBasicos;
