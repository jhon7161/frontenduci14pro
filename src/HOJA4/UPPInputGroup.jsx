// UPPInputGroup.jsx
import React from "react";

const UPPInputGroup = ({ fila, index, handleSitioChange }) => {
  return (
    <div className="upp-row">
      <label className="upp-label">
        D(
        <input
          type="text"
          value={fila.der}
          onChange={(e) => handleSitioChange(index, "der", e.target.value)}
          className="upp-input"
        />
        )
      </label>
      <label className="upp-label">
        I(
        <input
          type="text"
          value={fila.izq}
          onChange={(e) => handleSitioChange(index, "izq", e.target.value)}
          className="upp-input"
        />
        )
      </label>
    </div>
  );
};

export default UPPInputGroup;