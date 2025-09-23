// Hoja4DataRow.jsx
import React from "react";

const Hoja4DataRow = ({ dato, index, handleChange }) => {
  return (
    <tr>
      <td className="hora-cell" data-label="Hora">{dato.hora}</td>
      <td data-label="RASS">
        <input
          type="text"
          value={dato.sedacionRass}
          onChange={e => handleChange(index, "sedacionRass", e.target.value)}
        />
      </td>
      <td data-label="Pupilas OD">
        <input
          type="text"
          value={dato.pupilasOD}
          onChange={e => handleChange(index, "pupilasOD", e.target.value)}
        />
      </td>
      <td data-label="Pupilas OI">
        <input
          type="text"
          value={dato.pupilasOI}
          onChange={e => handleChange(index, "pupilasOI", e.target.value)}
        />
      </td>
      <td data-label="R-OD">
        <input
          type="text"
          value={dato.reaccionOD}
          onChange={e => handleChange(index, "reaccionOD", e.target.value)}
        />
      </td>
      <td data-label="R-OI">
        <input
          type="text"
          value={dato.reaccionOI}
          onChange={e => handleChange(index, "reaccionOI", e.target.value)}
        />
      </td>
      <td data-label="Fuerza Der.">
        <input
          type="text"
          value={dato.fuerzaDer}
          onChange={e => handleChange(index, "fuerzaDer", e.target.value)}
        />
      </td>
      <td data-label="Fuerza Izq.">
        <input
          type="text"
          value={dato.fuerzaIzq}
          onChange={e => handleChange(index, "fuerzaIzq", e.target.value)}
        />
      </td>
      <td data-label="Convulsiones">
        <input
          type="text"
          value={dato.convulsiones}
          onChange={e => handleChange(index, "convulsiones", e.target.value)}
        />
      </td>
      <td data-label="Glasgow AO">
        <input
          type="text"
          value={dato.glasgowAO}
          onChange={e => handleChange(index, "glasgowAO", e.target.value)}
        />
      </td>
      <td data-label="Glasgow RV">
        <input
          type="text"
          value={dato.glasgowRV}
          onChange={e => handleChange(index, "glasgowRV", e.target.value)}
        />
      </td>
      <td data-label="Glasgow RM">
        <input
          type="text"
          value={dato.glasgowRM}
          onChange={e => handleChange(index, "glasgowRM", e.target.value)}
        />
      </td>
      <td data-label="Glasgow Total">
        <input
          type="text"
          value={dato.glasgowTotal}
          onChange={e => handleChange(index, "glasgowTotal", e.target.value)}
          disabled
        />
      </td>
    </tr>
  );
};

export default Hoja4DataRow;