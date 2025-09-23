import React, { useState, useMemo, useEffect } from "react";


const ITEMS_TISS28 = [
  { id: 1, label: "Monitorización estandar, constantes horarias, balance hídrico", points: 1 },
  { id: 2, label: "Análisis de bioquímica y hematología", points: 1 },
  { id: 3, label: "Medicación única iv, im, sc, oral o por SNG", points: 1 },
  { id: 4, label: "Medicación múltiple o continua intravenosa", points: 3 },
  { id: 5, label: "Cambios rutinarios de apósitos, cuidados y prevención de decúbitos", points: 1 },
  { id: 6, label: "Cambios frecuentes de apósitos. Cura de heridas extensas", points: 2 },
  { id: 7, label: "Cuidados de drenajes, excepto SNG", points: 1 },
  { id: 8, label: "Ventilación Mecánica (cualquier modalidad), con o sin PEEP o relajantes", points: 5 },
  { id: 9, label: "Ventilación espontánea por TOT/traqueostomía sin CPAP, oxigenoterapia", points: 2 },
  { id: 10, label: "Cuidados de la vía aérea artificial", points: 1 },
  { id: 11, label: "Fisioterapia resp., aerosolterapia, aspiración secreciones por TOT", points: 1 },
  { id: 12, label: "Una medicación vasoactiva", points: 3 },
  { id: 13, label: "Múltiples drogas vasoactivas", points: 4 },
  { id: 14, label: "Reposición IV de gran cantidad de líquidos (> 3 L/m²/día)", points: 4 },
  { id: 15, label: "Catéter arterial periférico", points: 1 },
  { id: 16, label: "Catéter de Swan-Ganz (con o sin GC)", points: 3 },
  { id: 17, label: "Catéter venoso central", points: 2 },
  { id: 18, label: "RCP en las últimas 24 h", points: 4 },
  { id: 19, label: "Técnicas de hemofiltración", points: 4 },
  { id: 20, label: "Monitorización de diuresis por sonda vesical", points: 1 },
  { id: 21, label: "Diuresis forzada por sobrecarga de fluídos", points: 2 },
  { id: 22, label: "Monitorización de Presión Intracraneal", points: 3 },
  { id: 23, label: "Tratamiento de complicaciones metabólicas (acidosis/ alcalosis)", points: 2 },
  { id: 24, label: "Nutrición Parenteral", points: 3 },
  { id: 25, label: "Nutrición Enteral", points: 2 },
  { id: 26, label: "Intervención única en UCI (*)", points: 3 },
  { id: 27, label: "Intervenciones múltiples en UCI", points: 5 },
  { id: 28, label: "Intervenciones específicas fuera de la UCI", points: 6 },
];

export default function Tiss28Form({ onClose, onSave, defaultSelected = [] }) {
  const [selected, setSelected] = useState(defaultSelected);

  const total = useMemo(
    () => selected.reduce((acc, id) => acc + (ITEMS_TISS28.find(i => i.id === id)?.points || 0), 0),
    [selected]
  );

  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const toggle = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <>
      <div className="tiss28-backdrop" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="tiss28-modal">
        <h3 className="tiss28-title">🧾 Valoración TISS-28</h3>

        <div className="tiss28-head" style={{ display: 'flex', fontWeight: 'bold', padding: '5px 0' }}>
          <div style={{ flex: 0.1 }}></div>
          <div style={{ flex: 1 }}>Intervención</div>
          <div style={{ flex: 0.2 }}>Puntos</div>
        </div>

        <div className="tiss28-list">
          {ITEMS_TISS28.map(item => (
            <div key={item.id} className="tiss28-row" style={{ display: 'flex', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #eee' }}>
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggle(item.id)}
                style={{ flex: 0.1 }}
              />
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ flex: 0.2, textAlign: 'center', fontWeight: 'bold' }}>{item.points}</span>
            </div>
          ))}
        </div>

        <div className="tiss28-total" style={{ marginTop: 10, fontWeight: 'bold', textAlign: 'right' }}>
          Total TISS-28: {total}
        </div>

        <div className="tiss28-btnbar" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, gap: 10 }}>
          <button type="button" onClick={onClose}>Cancelar</button>
          <button
            type="button"
            className="primary"
            onClick={() => onSave?.(total, selected)}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}
