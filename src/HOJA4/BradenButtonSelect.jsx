// BradenButtonSelect.jsx
import React from "react";


const BradenButtonSelect = ({ campo, opciones, valorActual, onSelect }) => {
  return (
    <div className="braden-row">
      <span className="braden-campo">{campo}</span>
      <div className="braden-opciones">
        {opciones.map((op, idx) => {
          const valorOpcion = idx + 1;
          const isSelected = valorActual === valorOpcion;
          return (
            op !== null && (
              <button
                key={idx}
                className={`braden-btn ${isSelected ? "selected" : ""}`}
                onClick={() => onSelect(campo, valorOpcion)}
              >
                {op}
              </button>
            )
          );
        })}
      </div>
    </div>
  );
};

export default BradenButtonSelect;