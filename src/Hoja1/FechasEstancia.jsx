import React, { useEffect } from "react";

const FechasEstancia = ({ form, onChange }) => {
  useEffect(() => {
    if (form.fechaIngreso && form.fechaActual) {
      const ingreso = new Date(form.fechaIngreso);
      const actual = new Date(form.fechaActual);
      const dias = Math.ceil((actual - ingreso) / (1000 * 60 * 60 * 24));
      if (form.diasEstancia !== dias) {
        onChange({ target: { name: "diasEstancia", value: dias } });
      }
    }
  }, [form.fechaIngreso, form.fechaActual, form.diasEstancia, onChange]);

  return (
    <div className="fechas-estancia-row">
      <div className="fechas-estancia-group">
        <label>Fecha de Ingreso:</label>
        <input
          type="date"
          name="fechaIngreso"
          value={form.fechaIngreso || ""}
          onChange={onChange}
        />
      </div>

      <div className="fechas-estancia-group">
        <label>Fecha Actual:</label>
        <input
          type="date"
          name="fechaActual"
          value={form.fechaActual || ""}
          onChange={onChange}
        />
      </div>

      <div className="fechas-estancia-group">
        <label>Días de Estancia:</label>
        <input
          type="text"
          name="diasEstancia"
          value={form.diasEstancia || ""}
          readOnly
        />
      </div>
    </div>
  );
};

export default FechasEstancia;
