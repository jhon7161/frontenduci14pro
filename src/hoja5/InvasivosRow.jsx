// src/components/InvasivosRow.jsx
import React from "react";
import { CONVENCIONES } from "./constants";

const InvasivosRow = ({ row, idx, handleInvasivoChange, handleRemoveInvasivo }) => {
  return (
    <tr>
      <td data-label="Tipo">
        <input
          type="text"
          value={row.tipo || ""}
          onChange={(e) => handleInvasivoChange(idx, "tipo", e.target.value)}
        />
      </td>
      <td data-label="Sitio">
        <input
          type="text"
          value={row.sitio || ""}
          onChange={(e) => handleInvasivoChange(idx, "sitio", e.target.value)}
        />
      </td>
      {["m", "t", "n"].map((turno) => (
        <td key={turno} data-label={`Turno ${turno.toUpperCase()}`}>
          <select
            value={row.mtn?.[`convencion_${turno}`] || ""}
            onChange={(e) =>
              handleInvasivoChange(idx, `convencion_${turno}`, e.target.value)
            }
          >
            <option value="">Seleccione</option>
            {CONVENCIONES.map((c) => (
              <option key={c.value} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>
        </td>
      ))}
      <td data-label="Fecha">
        <input
          type="date"
          value={row.fecha ? row.fecha.split("T")[0] : ""}
          onChange={(e) => handleInvasivoChange(idx, "fecha", e.target.value)}
        />
      </td>
      <td data-label="Días">{row.dias}</td>
      <td data-label="Obs">
        <input
          type="text"
          value={row.observaciones || ""}
          onChange={(e) => handleInvasivoChange(idx, "observaciones", e.target.value)}
        />
      </td>
      <td data-label="Acción">
        {row.isRemovable && (
          <button className="hoja5-btn-remove" onClick={() => handleRemoveInvasivo(idx)}>
            Eliminar
          </button>
        )}
      </td>
    </tr>
  );
};

export default InvasivosRow;