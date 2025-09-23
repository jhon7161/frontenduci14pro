// src/hoja2/InsumosForm.jsx
import React, { useState } from "react";

const INSUMOS_BASE = [
  "XL 5000",
  "Buretrol SSN 0.9%",
  "Lactato de Ringer",
];

const InsumosForm = ({ form, setForm }) => {
  // Tomar los insumos de form.hoja2 o inicializar con base
  const insumos = form.hoja2?.insumos || INSUMOS_BASE.map((item) => ({
    nombre: item,
    M: 0,
    T: 0,
    N: 0
  }));

  const [nuevoInsumo, setNuevoInsumo] = useState("");

  // Actualiza la cantidad de cada turno
  const handleChange = (idx, turno, value) => {
    const nuevos = insumos.map((item, i) =>
      i === idx ? { ...item, [turno]: Number(value) } : item
    );
    setForm(prev => ({
      ...prev,
      hoja2: { ...prev.hoja2, insumos: nuevos }
    }));
  };

  // Agregar un insumo nuevo
  const agregarInsumo = () => {
    if (!nuevoInsumo.trim()) return;
    const nuevos = [...insumos, { nombre: nuevoInsumo.trim(), M: 0, T: 0, N: 0 }];
    setForm(prev => ({
      ...prev,
      hoja2: { ...prev.hoja2, insumos: nuevos }
    }));
    setNuevoInsumo("");
  };

  // Calcular total diario de un insumo
  const calcularTotal = (item) => item.M + item.T + item.N;

  return (
    <div className="insumos-wrapper">
      <h2>Control de Insumos y Medicamentos</h2>
      <table className="insumos-table">
        <thead>
          <tr>
            <th>LISTA DE EQUIPOS Y MEDICAMENTOS</th>
            <th>M</th>
            <th>T</th>
            <th>N</th>
            <th>TOTAL 24 HORAS</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((item, idx) => (
            <tr key={idx}>
              <td>{item.nombre}</td>
              {["M", "T", "N"].map((turno) => (
                <td key={turno}>
                  <input
                    type="number"
                    min="0"
                    value={item[turno]}
                    onChange={(e) => handleChange(idx, turno, e.target.value)}
                  />
                </td>
              ))}
              <td style={{ fontWeight: "bold" }}>{calcularTotal(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Agregar nuevo insumo"
          value={nuevoInsumo}
          onChange={(e) => setNuevoInsumo(e.target.value)}
          style={{ width: 200, marginRight: 10 }}
        />
        <button type="button" onClick={agregarInsumo}>Agregar</button>
      </div>
    </div>
  );
};

export default InsumosForm;
