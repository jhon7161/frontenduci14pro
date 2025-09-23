import React from "react";

const DataRow = ({
  fila,
  idx,
  camposSignosVitales,
  camposVigileo,
  otrosNombres,
  handleChange,
}) => {
  return (
    <tr key={idx}>
      <td className="time-cell">{fila.Hora}</td>
      {camposSignosVitales.map((campo) => (
        <td key={`${campo}-${idx}`}>
          <input
            type="text"
            value={fila[campo] || ""}
            onChange={(e) => handleChange(e, idx, campo)}
          />
        </td>
      ))}
      {camposVigileo.map((campo) => (
        <td key={`${campo}-${idx}`}>
          <input
            type="text"
            value={fila[campo] || ""}
            onChange={(e) => handleChange(e, idx, campo)}
          />
        </td>
      ))}
      {otrosNombres.map((nombre, index) => {
        const valorOtro = fila.otros?.[index]?.valor || "";
        return (
          <td key={`otro-${index}-${idx}`}>
            <input
              type="text"
              value={valorOtro}
              onChange={(e) => handleChange(e, idx, nombre)}
            />
          </td>
        );
      })}
    </tr>
  );
};

export default DataRow;