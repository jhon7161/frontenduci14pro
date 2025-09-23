// src/components/EquiposRow.jsx
import React from "react";

const EquiposRow = ({ row, idx, handleEquiposChange, handleRemoveEquipo }) => {
  return (
    <tr>
      <td data-label="ITEM">
        <input
          type="text"
          value={row.item}
          onChange={(e) => handleEquiposChange(idx, "item", e.target.value)}
        />
      </td>
      <td data-label="M">
        <input
          type="text"
          value={row.mtn.m}
          onChange={(e) => handleEquiposChange(idx, "mtn_m", e.target.value)}
        />
      </td>
      <td data-label="T">
        <input
          type="text"
          value={row.mtn.t}
          onChange={(e) => handleEquiposChange(idx, "mtn_t", e.target.value)}
        />
      </td>
      <td data-label="N">
        <input
          type="text"
          value={row.mtn.n}
          onChange={(e) => handleEquiposChange(idx, "mtn_n", e.target.value)}
        />
      </td>
      <td data-label="TOTAL 24 HORAS">
        <input
          type="text"
          value={row.total}
          onChange={(e) => handleEquiposChange(idx, "total", e.target.value)}
        />
      </td>
      <td data-label="Acción">
        <button className="hoja5-btn-remove" onClick={() => handleRemoveEquipo(idx)}>
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default EquiposRow;