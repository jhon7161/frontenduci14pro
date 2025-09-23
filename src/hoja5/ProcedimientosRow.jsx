// src/components/ProcedimientosRow.jsx
import React from "react";

const ProcedimientosRow = ({ row, idx, handleProcedimientoChange }) => {
  return (
    <tr>
      <td data-label="Tipo">{row.tipo}</td>
      {["m", "t", "n"].map((turno) => (
        <td key={turno} data-label={`Turno ${turno.toUpperCase()}`}>
          <input
            type="checkbox"
            checked={row.registroTurno?.[turno] || false}
            onChange={() => handleProcedimientoChange(idx, turno)}
          />
        </td>
      ))}
    </tr>
  );
};

export default ProcedimientosRow;