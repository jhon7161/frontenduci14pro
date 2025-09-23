import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Nav.css';

const HojaNav = ({ pacienteId }) => {
  const navigate = useNavigate();

  return (
    <div className="button-container-nav">
      <button onClick={() => navigate(`/hoja1/${pacienteId}`)} className="btn-nav">
        Ir a Hoja 1
      </button>
      <button onClick={() => navigate(`/hoja2/${pacienteId}`)} className="btn-nav">
        Ir a Hoja 2
      </button>
      <button onClick={() => navigate(`/hoja3/${pacienteId}`)} className="btn-nav">
        Ir a Hoja 3
      </button>
      <button onClick={() => navigate(`/hoja4/${pacienteId}`)} className="btn-nav">
        Ir a Hoja 4
      </button>
      <button onClick={() => navigate(`/hoja5/${pacienteId}`)} className="btn-nav">
        Ir a Hoja 5
      </button>
      <button onClick={() => navigate(`/hoja6/${pacienteId}`)} className="btn-nav">
        Ir a Hoja 6
      </button>
      <button onClick={() => navigate(`/paciente/${pacienteId}`)} className="btn-nav">
        Volver a Datos del Paciente
      </button>
    </div>
  );
};

export default HojaNav;