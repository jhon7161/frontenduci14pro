import React, { useState } from "react";


export default function DiagnosticosProblemas({ form, setForm }) {
  const [nuevoDiagnostico, setNuevoDiagnostico] = useState("");
  const [nuevoProblema, setNuevoProblema] = useState("");

  const agregarDiagnostico = () => {
    if (!nuevoDiagnostico.trim()) return;
    setForm({ ...form, diagnosticos: [...(form.diagnosticos || []), nuevoDiagnostico.trim()] });
    setNuevoDiagnostico("");
  };

  const eliminarDiagnostico = index => {
    const newDiagnosticos = form.diagnosticos?.filter((_, i) => i !== index) || [];
    setForm({ ...form, diagnosticos: newDiagnosticos });
  };

  const agregarProblema = () => {
    if (!nuevoProblema.trim()) return;
    setForm({ ...form, problemas: [...(form.problemas || []), nuevoProblema.trim()] });
    setNuevoProblema("");
  };

  const eliminarProblema = index => {
    const newProblemas = form.problemas?.filter((_, i) => i !== index) || [];
    setForm({ ...form, problemas: newProblemas });
  };

  const handleEnfermeroChange = (turno, valor) => {
    setForm({ ...form, enfermeroJefe: { ...form.enfermeroJefe, [turno]: valor } });
  };

  return (
    <div className="diagnosticos-container">
      {/* Diagnósticos */}
      <div className="diagnosticos-row header">
        <div>📋 Diagnósticos</div>
        <div>
          <input
            value={nuevoDiagnostico}
            onChange={e => setNuevoDiagnostico(e.target.value)}
            placeholder="Nuevo diagnóstico"
          />
        </div>
        <div>
          <button onClick={agregarDiagnostico}>➕</button>
        </div>
      </div>

      {(form.diagnosticos || []).map((diag, i) => (
        <div key={i} className="diagnosticos-row">
          <div>{i + 1}</div>
          <div>{diag}</div>
          <div>
            <button onClick={() => eliminarDiagnostico(i)}>❌</button>
          </div>
        </div>
      ))}

      {/* Problemas */}
      <div className="diagnosticos-row header">
        <div>⚠ Problemas</div>
        <div>
          <input
            value={nuevoProblema}
            onChange={e => setNuevoProblema(e.target.value)}
            placeholder="Nuevo problema"
          />
        </div>
        <div>
          <button onClick={agregarProblema}>➕</button>
        </div>
      </div>

      {(form.problemas || []).map((prob, i) => (
        <div key={i} className="diagnosticos-row">
          <div>{i + 1}</div>
          <div>{prob}</div>
          <div>
            <button onClick={() => eliminarProblema(i)}>❌</button>
          </div>
        </div>
      ))}

      {/* Enfermero jefe */}
      <div className="enfermero-jefe-row">
        {["manana", "tarde", "noche"].map(turno => (
          <div key={turno} className="enfermero-jefe-col">
            <label>{turno.charAt(0).toUpperCase() + turno.slice(1)}</label>
            <input
              value={form.enfermeroJefe?.[turno] || ""}
              onChange={e => handleEnfermeroChange(turno, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
