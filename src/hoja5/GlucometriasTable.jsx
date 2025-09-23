import React from 'react';
import { GLUCOMETRIAS_BASE } from './constants'; 

export default function GlucometriasTable({ glucometrias, handleGlucometriaChange }) {
  // Asegúrate de usar los datos pasados por props.
  const datosGlucometrias = glucometrias;

  return (
    <div className="hoja5-section-card glucometrias-table-wrapper">
      <h3 className="hoja5-section-title">GLUCOMETRÍAS</h3>
      <table className="hoja5-data-table">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Resultado</th>
            <th>Insulina</th>
          </tr>
        </thead>
        <tbody>
          {datosGlucometrias.map((row, idx) => (
            <tr key={idx}>
              <td>{row.hora}</td>
              <td>
                <input
                  type="text"
                  // Asegúrate de que el valor sea siempre un string para evitar errores de React.
                  value={row.valor || ""}
                  onChange={(e) =>
                    handleGlucometriaChange(idx, "valor", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  // Usar 'observacion' si es el campo correcto para la insulina.
                  value={row.observacion || ""}
                  onChange={(e) =>
                    handleGlucometriaChange(idx, "observacion", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}