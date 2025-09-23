import React from "react";

const COLUMNAS = [
  "Hora","ART","VEN","YUG","PH","PCO2","PO2","BTO","DB","SAT",
  "H+","CSO2","PAO/FIO2","QS/QT","DavO2","REO2","IDO2","IVO2",
];

const FILAS_INICIALES = Array.from({ length: 6 }, (_, i) =>
  COLUMNAS.reduce((acc, col) => ({ ...acc, [col]: "" }), { Hora: i + 1 })
);

const ComponenteGasesSanguineos = ({ form, setForm }) => {

  // Inicializa las filas si no existen
  React.useEffect(() => {
    if (!form.hoja6.gases || form.hoja6.gases.length === 0) {
      setForm(prev => ({ 
        ...prev, 
        hoja6: { 
          ...prev.hoja6, 
          gases: FILAS_INICIALES,
          neumonia: { NN: "", NAC: {M:"",T:"",N:""}, NAN: {M:"",T:"",N:""}, NBA: {M:"",T:"",N:""} },
          terapeuta: ""
        }
      }));
    }
  }, []);

  const handleChange = (index, col, value) => {
    const nuevas = [...form.hoja6.gases];
    nuevas[index][col] = value;
    setForm(prev => ({ ...prev, hoja6: { ...prev.hoja6, gases: nuevas } }));
  };

  const handleTerapeutaChange = (value) => {
    setForm(prev => ({ ...prev, hoja6: { ...prev.hoja6, terapeuta: value } }));
  };

  return (
    <div className="hoja6-container">
      <h2 className="titulo">Gases Sanguíneos</h2>
      <table className="tabla">
        <thead>
          <tr>
            {COLUMNAS.map((col) => (
              <th
                key={col}
                style={col === "YUG" ? { width: "50px" } : {}}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {form.hoja6.gases?.map((fila, i) => (
            <tr key={i}>
              {COLUMNAS.map((col) => (
                <td
                  key={col}
                  style={col === "YUG" ? { width: "50px" } : {}}
                >
                  <input
                    type="text"
                    value={fila[col] || ""}
                    onChange={(e) => handleChange(i, col, e.target.value)}
                    style={col === "YUG" ? { width: "40px" } : { width: "100%" }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        <label>Terapeuta:</label>
        <input
          type="text"
          value={form.hoja6.terapeuta || ""}
          onChange={(e) => handleTerapeutaChange(e.target.value)}
          style={{ width: 200 }}
        />
      </div>
    </div>
  );
};

export default ComponenteGasesSanguineos;
