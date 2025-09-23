import React, { useState } from "react";


const DosisUnica = ({ form, setForm }) => {
  const [nuevoDosisUnica, setNuevoDosisUnica] = useState({
    hora: "",
    nombre: "",
    dosis: "",
    via: "",
    ordenadoPor: "",
    hospitalariamente: ""
  });

  const handleChange = (key, value) => {
    setNuevoDosisUnica(prev => ({ ...prev, [key]: value }));
  };

  const agregarDosis = () => {
    if (nuevoDosisUnica.nombre.trim() && nuevoDosisUnica.hora.trim()) {
      setForm({
        ...form,
        dosisUnica: [...(form.dosisUnica || []), nuevoDosisUnica]
      });
      setNuevoDosisUnica({
        hora: "",
        nombre: "",
        dosis: "",
        via: "",
        ordenadoPor: "",
        hospitalariamente: ""
      });
    } else {
      alert("Complete nombre y hora");
    }
  };

  const eliminarDosis = idx => {
    const newDosis = form.dosisUnica?.filter((_, i) => i !== idx) || [];
    setForm({ ...form, dosisUnica: newDosis });
  };

  return (
    <div className="dosis-container">
      <div className="dosis-title">DOSIS ÚNICA</div>

      {/* Cabecera */}
      <div className="dosis-grid header">
        <div>#</div>
        <div>Hora</div>
        <div>Nombre</div>
        <div>Dosis</div>
        <div>Vía</div>
        <div>Ordenado por</div>
        <div></div>
      </div>

      {/* Nueva dosis */}
      <div className="dosis-grid">
        <div>#</div>
        <div>
          <input
            type="time"
            value={nuevoDosisUnica.hora}
            onChange={e => handleChange("hora", e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            value={nuevoDosisUnica.nombre}
            onChange={e => handleChange("nombre", e.target.value)}
            placeholder="Nombre"
          />
        </div>
        <div>
          <input
            type="text"
            value={nuevoDosisUnica.dosis}
            onChange={e => handleChange("dosis", e.target.value)}
            placeholder="Dosis"
          />
        </div>
        <div>
          <input
            type="text"
            value={nuevoDosisUnica.via}
            onChange={e => handleChange("via", e.target.value)}
            placeholder="Vía"
          />
        </div>
        <div>
          <input
            type="text"
            value={nuevoDosisUnica.ordenadoPor}
            onChange={e => handleChange("ordenadoPor", e.target.value)}
            placeholder="Ordenado por"
          />
        </div>
        <div>
          <button onClick={agregarDosis}>➕</button>
        </div>
      </div>

      {/* Listado de dosis */}
      {(form.dosisUnica || []).map((dosis, i) => (
        <div key={i} className="dosis-grid">
          <div>{i + 1}</div>
          <div>{dosis.hora}</div>
          <div>{dosis.nombre}</div>
          <div>{dosis.dosis}</div>
          <div>{dosis.via}</div>
          <div>{dosis.ordenadoPor}</div>
          <div>
            <button onClick={() => eliminarDosis(i)}>❌</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DosisUnica;
