import React from 'react';
import './Header.css';
const HeaderHoja = ({ paginaActual, totalPaginas }) => {
  return (
    <header className="hoja1-header">
      <div className="hoja1-logo">
        <h1>HealtOS UCI</h1>
      </div>
      <div className="hoja1-title">
        <p>UNIDAD DE CUIDADOS INTENSIVOS E INTERMEDIOS</p>
      </div>
      <div className="hoja1-meta">
        <div className="hoja1-meta-item">VERSIÓN 1.0</div>
        <div className="hoja1-meta-item">
          PÁGINA {paginaActual} DE {totalPaginas}
        </div>
        <div className="hoja1-meta-item">ACTUALIZADA</div>
        <div className="hoja1-meta-item">10/10/2025</div>
      </div>
    </header>
  );
};

export default HeaderHoja;
