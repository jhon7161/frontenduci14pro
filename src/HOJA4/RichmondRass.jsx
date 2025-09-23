// src/components/RichmondRass.jsx
import React from "react";
// ✅ Importa el archivo CSS para Hoja4


const datosRASS = [
  { puntuacion: "+4", termino: "Combativo", descripcion: "Agresivo, violento" },
  { puntuacion: "+3", termino: "Muy agitado", descripcion: "Agresivo, retira tubo o catéteres" },
  { puntuacion: "+2", termino: "Agitado", descripcion: "Movimientos frecuentes, no agresivo" },
  { puntuacion: "+1", termino: "Inquieto", descripcion: "Movimientos ansiosos, no agresivos" },
  { puntuacion: "0", termino: "Alerta y tranquilo", descripcion: "" },
  { puntuacion: "-1", termino: "Somnoliento", descripcion: "No completamente alerta, mantiene la conciencia" },
  { puntuacion: "-2", termino: "Sedación ligera", descripcion: "Despierta al contacto verbal o visual" },
  { puntuacion: "-3", termino: "Sedación moderada", descripcion: "Despierta con estímulo verbal fuerte o sacudida" },
  { puntuacion: "-4", termino: "Sedación profunda", descripcion: "No responde a estímulos verbales o visuales" },
  { puntuacion: "-5", termino: "No detectable", descripcion: "No despierta a ningún estímulo" },
];

const RichmondRass = ({ className = "" }) => {
  return (
    <div className={`richmond-rass-container ${className}`}>
      <div className="hoja-header">
        <h3 className="header-title">AGITACION SEDACION RICHMOND RASS</h3>
      </div>
      <div className="hoja4-table-wrapper">
        <table className="hoja4-table">
          <thead>
            <tr>
              <th>PUNTUACION</th>
              <th>TERMINO</th>
              <th>DESCRIPCION</th>
            </tr>
          </thead>
          <tbody>
            {datosRASS.map((item, index) => (
              <tr key={index}>
                <td>{item.puntuacion}</td>
                <td>{item.termino}</td>
                <td>{item.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RichmondRass;