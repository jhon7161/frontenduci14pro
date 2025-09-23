import React from "react";

const POSICIONES = [
  { nombre: "DLI", ejercicio: "Mov pasiva" },
  { nombre: "DLD", ejercicio: "Ejerc pasivo" },
  { nombre: "Sedente", ejercicio: "Ejerc activo" },
  { nombre: "Prono", ejercicio: "Ejerc asist" },
  { nombre: "Bipedo", ejercicio: "Ejerc resist" },
  { nombre: "Marcha", ejercicio: "FISIOTERAPIA" },
];

const HORAS = ["6","8","10","12","14","16","18","20","22","24","2","4"];
const FERULAS = [
  { nombre: "MMSS", tipos: ["1x1","1x2","2x1"] },
  { nombre: "MMII", tipos: ["1x1","1x2","2x1"] },
];

const HojaPosiciones = ({ form, setForm }) => {
  const hoja = form.hojaPosiciones || { selecciones: {}, observaciones: {}, fisio: "" };
  const { selecciones, observaciones, fisio } = hoja;

  const actualizarHoja = (nuevos) => setForm(prev => ({
    ...prev,
    hojaPosiciones: { ...hoja, ...nuevos }
  }));

  const toggleCelda = (key) => {
    actualizarHoja({ selecciones: { ...selecciones, [key]: !selecciones[key] } });
  };

  const handleObsChange = (ferula, valor) => {
    actualizarHoja({ observaciones: { ...observaciones, [ferula]: valor } });
  };

  const handleFisioChange = (valor) => {
    actualizarHoja({ fisio: valor });
  };

  return (
    <div className="hoja-posiciones-wrapper">
      {/* Tabla posiciones */}
      <table className="hoja-posiciones-table">
        <thead>
          <tr>
            <th>Posición</th>
            {HORAS.map(h => <th key={h}>{h}</th>)}
            <th>Ejercicios</th>
            <th>AM</th>
            <th>PM</th>
          </tr>
        </thead>
        <tbody>
          {POSICIONES.map(pos => (
            <tr key={pos.nombre}>
              <td><strong>{pos.nombre}</strong></td>
              {HORAS.map(h => {
                const key = `${pos.nombre}-${h}`;
                return (
                  <td
                    key={h}
                    className={`clickable-cell ${selecciones[key] ? 'checked' : ''}`}
                    onClick={() => toggleCelda(key)}
                  >
                    {selecciones[key] ? '✔' : ''}
                  </td>
                );
              })}
              <td>{pos.ejercicio}</td>
              {pos.nombre !== "Marcha" ? ["AM","PM"].map(turno => {
                const key = `${pos.nombre}-${turno}`;
                return (
                  <td
                    key={turno}
                    className={`clickable-cell ${selecciones[key] ? 'checked' : ''}`}
                    onClick={() => toggleCelda(key)}
                  >
                    {selecciones[key] ? '✔' : ''}
                  </td>
                );
              }) : <td colSpan={2}></td>}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla férulas */}
      <h3 style={{ marginTop: "20px" }}>Posición Férulas</h3>
      <table className="hoja-posiciones-table">
        <thead>
          <tr>
            <th>Miembro</th>
            <th>1x1</th>
            <th>1x2</th>
            <th>2x1</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {FERULAS.map(f => (
            <tr key={f.nombre}>
              <td>{f.nombre}</td>
              {f.tipos.map(tipo => {
                const key = `${f.nombre}-${tipo}`;
                return (
                  <td
                    key={tipo}
                    className={`clickable-cell ${selecciones[key] ? 'checked' : ''}`}
                    onClick={() => toggleCelda(key)}
                  >
                    {selecciones[key] ? '✔' : ''}
                  </td>
                );
              })}
              <td>
                <input
                  type="text"
                  value={observaciones[f.nombre] || ""}
                  onChange={(e) => handleObsChange(f.nombre, e.target.value)}
                  placeholder="Observaciones"
                  style={{ width: "100%" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Fisioterapeuta */}
      <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontWeight: "bold" }}>Fisioterapeuta:</label>
        <input
          type="text"
          value={fisio || ""}
          onChange={e => handleFisioChange(e.target.value)}
          placeholder="Nombre del fisioterapeuta"
        />
      </div>
    </div>
  );
};

export default HojaPosiciones;
