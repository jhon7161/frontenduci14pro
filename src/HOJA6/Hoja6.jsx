 import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import {

  fetchPacienteById,

  updatePaciente,

  updateHojaLocal,

} from "../reducers/pacienteSlice";

import "./Hoja6.css";

import HeaderHoja from "../Hoja1/Reutilizables/HeaderHoja";

import HojaNav from "../Hoja1/Reutilizables/HojaNav";





const Hoja6 = () => {

  const dispatch = useDispatch();

  const { id } = useParams();



  const { pacienteSeleccionado, status, error } = useSelector(

    (state) => state.pacientes

  );



  const [monitoreoData, setMonitoreoData] = useState([]);

  const [gasesData, setGasesData] = useState([]);

  const [neumoniaData, setNeumoniaData] = useState({});

  const [terapeutaData, setTerapeutaData] = useState({});

  const [posicionesData, setPosicionesData] = useState({});

  const [ejerciciosData, setEjerciciosData] = useState({});

  const [ferulasData, setFerulasData] = useState({});

  const [dpData, setDpData] = useState("");

  const [fisioData, setFisioData] = useState("");

  const [isSaving, setIsSaving] = useState(false);



  useEffect(() => {

    if (id) {

      dispatch(fetchPacienteById(id));

    }

  }, [id, dispatch]);



  useEffect(() => {

    if (pacienteSeleccionado?.hoja6) {

      setMonitoreoData(pacienteSeleccionado.hoja6.datos || []);

      setGasesData(pacienteSeleccionado.hoja6.gases || []);

      setNeumoniaData(pacienteSeleccionado.hoja6.neumonia || {});

      setTerapeutaData(pacienteSeleccionado.hoja6.terapeuta || {});

      setPosicionesData(pacienteSeleccionado.hoja6.posiciones?.posiciones || {});

      setEjerciciosData(pacienteSeleccionado.hoja6.posiciones?.ejercicios || {});

      setFerulasData(pacienteSeleccionado.hoja6.posiciones?.posicionFerulas || {});

      setDpData(pacienteSeleccionado.hoja6.posiciones?.dp || "");

      setFisioData(pacienteSeleccionado.hoja6.posiciones?.fisio || "");

    }

  }, [pacienteSeleccionado]);



  const monitoreoColumns = [

    "MODO",

    "FR TTL",

    "FR VENT",

    "FIO2",

    "PEEP",

    "VT",

    "VM",

    "PS",

    "PIM",

    "PPL",

    "PMA EDI",

    "DISTENS",

    "PNO EUM",

    "DRIVI NG PRESS",

    "CANULA",

    "VENTURI",

    "VENT",

  ];



  const gasesColumns = [

    "ART",

    "VEN",

    "YUG",

    "PH",

    "PCO2",

    "PO2",

    "BTO",

    "DB",

    "SAT",

    "H+",

    "CSO2",

    "PAO/FIO2",

    "QS/QT",

    "DavO2",

    "REO2",

    "IDO2",

    "IVO2",

  ];



  const posicionesFilas = ["DLI", "DLD", "Sedente", "Prono", "Bipedo", "Marcha"];

  const horasColumnas = ["6", "8", "10", "12", "14", "16", "18", "20", "22", "24", "2", "4"];

  const ejerciciosFilas = ["Mov pasiva", "Ejerc pasivo", "Ejerc activo", "Ejerc asist", "Ejerc resist"];



  const handleTableChange = (table, rowIndex, column, value) => {

    if (table === "monitoreo") {

      const newMonitoreoData = [...monitoreoData];

      const hour = (rowIndex + 7) % 24 || 24;

      const existingRowIndex = newMonitoreoData.findIndex(

        (d) => d.HORA === String(hour)

      );



      if (existingRowIndex > -1) {

        newMonitoreoData[existingRowIndex] = {

          ...newMonitoreoData[existingRowIndex],

          [column]: value,

        };

      } else {

        newMonitoreoData.push({

          HORA: String(hour),

          [column]: value,

        });

      }

      setMonitoreoData(newMonitoreoData);

    } else if (table === "gases") {

      const newGasesData = [...gasesData];

      newGasesData[rowIndex] = {

        ...(newGasesData[rowIndex] || {}),

        [column]: value,

      };

      setGasesData(newGasesData);

    }

  };



  const handleNeumoniaChange = (e) => {

    const { name, value } = e.target;

    setNeumoniaData((prev) => ({ ...prev, [name]: value }));

  };



  const handleTerapeutaChange = (e) => {

    const { name, value } = e.target;

    setTerapeutaData((prev) => ({ ...prev, [name]: value }));

  };



  const handlePosicionesToggle = (row, col) => {

    setPosicionesData((prev) => {

      const newPosiciones = JSON.parse(JSON.stringify(prev));

      posicionesFilas.forEach(p => {

        if (newPosiciones[p]) {

          newPosiciones[p][col] = false;

        }

      });

      if (!prev[row] || !prev[row][col]) {

        if (!newPosiciones[row]) {

          newPosiciones[row] = {};

        }

        newPosiciones[row][col] = true;

      }

      return newPosiciones;

    });

  };



  const handleEjerciciosToggle = (row, col) => {

    setEjerciciosData((prev) => {

      const newEjercicios = JSON.parse(JSON.stringify(prev));

      if (!newEjercicios[row]) {

        newEjercicios[row] = {};

      }

      newEjercicios[row][col] = !newEjercicios[row]?.[col];

      return newEjercicios;

    });

  };



  const handleSave = async () => {

    if (!pacienteSeleccionado || !pacienteSeleccionado._id) {

      alert("Por favor, selecciona un paciente antes de guardar.");

      return;

    }



    setIsSaving(true);

    try {

      const updatedHoja6 = {

        ...(pacienteSeleccionado.hoja6 || {}),

        datos: monitoreoData,

        gases: gasesData,

        neumonia: neumoniaData,

        terapeuta: terapeutaData,

        posiciones: {

          posiciones: posicionesData,

          ejercicios: ejerciciosData,

          posicionFerulas: ferulasData,

          dp: dpData,

          fisio: fisioData,

        },

      };



      dispatch(updateHojaLocal({ hoja: "hoja6", datos: updatedHoja6 }));



      await dispatch(

        updatePaciente({

          id: pacienteSeleccionado._id,

          hoja: "hoja6",

          data: updatedHoja6,

        })

      ).unwrap();



      alert("Datos de la Hoja 6 guardados correctamente.");

    } catch (err) {

      console.error("Error al guardar los datos:", err);

      alert("Hubo un error al guardar los datos de la Hoja 6.");

    } finally {

      setIsSaving(false);

    }

  };



  if (status === "loading" && !pacienteSeleccionado) {

    return <p>Cargando datos del paciente...</p>;

  }

  if (status === "failed") {

    return <p>Error al cargar los datos: {error}</p>;

  }

  if (!pacienteSeleccionado) {

    return <p>No se ha encontrado un paciente para esta hoja.</p>;

  }



  return (

    <div className="hoja6-container">

      <HeaderHoja paginaActual={6} totalPaginas={6} />

      



      {/* TABLA DE MONITOREO */}

      <div className="seccion">

        

        <table className="data-table monitoreo-table">

          <thead>

            <tr>

              <th rowSpan="2">HORA</th>

              <th colSpan="5">Ventilación Mecánica</th>

              <th colSpan="8">Monitoria Respiratoria</th>

              <th colSpan="4">Oxigenoterapia</th>

            </tr>

            <tr>

              {monitoreoColumns.map((col) => (

                <th key={col}>{col}</th>

              ))}

            </tr>

          </thead>

          <tbody>

            {Array.from({ length: 24 }).map((_, i) => {

              const hour = (i + 7) % 24 || 24;

              const rowData =

                monitoreoData.find((d) => d.HORA === String(hour)) || {};

              return (

                <tr key={hour}>

                  <td>{hour}</td>

                  {monitoreoColumns.map((col) => (

                    <td key={`${hour}-${col}`}>

                      <input

                        type="text"

                        value={rowData[col] || ""}

                        onChange={(e) =>

                          handleTableChange("monitoreo", i, col, e.target.value)

                        }

                      />

                    </td>

                  ))}

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>



      {/* TABLA GASES */}

      <div className="seccion">

        <h3>Gases Sanguíneos</h3>

        <table className="data-table gases-table">

          <thead>

            <tr>

              <th>Hora</th>

              {gasesColumns.map((col) => (

                <th key={col}>{col}</th>

              ))}

            </tr>

          </thead>

          <tbody>

            {Array.from({ length: 4 }).map((_, i) => {

              const rowData = gasesData[i] || {};

              return (

                <tr key={i}>

                  <td>

                    <input

                      type="text"

                      value={rowData.Hora || ""}

                      onChange={(e) =>

                        handleTableChange("gases", i, "Hora", e.target.value)

                      }

                    />

                  </td>

                  {gasesColumns.map((col) => (

                    <td key={`${i}-${col}`}>

                      <input

                        type="text"

                        value={rowData[col] || ""}

                        onChange={(e) =>

                          handleTableChange("gases", i, col, e.target.value)

                        }

                      />

                    </td>

                  ))}

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>



      {/* TABLA UNIFICADA */}

      <div className="seccion">

        <table className="data-table combined-table">

          <thead>

            <tr>

              <th colSpan="2">Neumonía</th>

              <th colSpan="2">Días en VM</th>

              <th colSpan="2">Terapeuta Respiratoria</th>

            </tr>

          </thead>

          <tbody>

            {/* Fila 1 */}

            <tr>

              <td>NN</td>

              <td>

                <input

                  type="text"

                  name="NN"

                  value={neumoniaData.NN || ""}

                  onChange={handleNeumoniaChange}

                />

              </td>



              <td>DÍAS EN VM</td>

              <td>

                <input

                  type="text"

                  className="dias-vm-input"

                  maxLength="3"

                  name="DIAS_VM"

                  value={neumoniaData.DIAS_VM || ""}

                  onChange={handleNeumoniaChange}

                />

              </td>



              <td>MAÑANA</td>

              <td>

                <input

                  type="text"

                  name="mañana"

                  value={terapeutaData.mañana || ""}

                  onChange={handleTerapeutaChange}

                />

              </td>

            </tr>

            {/* Fila 2 */}

            <tr>

              <td>NAC</td>

              <td>

                <input

                  type="text"

                  name="NAC"

                  value={neumoniaData.NAC || ""}

                  onChange={handleNeumoniaChange}

                />

              </td>



              <td></td>

              <td></td>



              <td>TARDE</td>

              <td>

                <input

                  type="text"

                  name="tarde"

                  value={terapeutaData.tarde || ""}

                  onChange={handleTerapeutaChange}

                />

              </td>

            </tr>

            {/* Fila 3 */}

            <tr>

              <td>NAN</td>

              <td>

                <input

                  type="text"

                  name="NAN"

                  value={neumoniaData.NAN || ""}

                  onChange={handleNeumoniaChange}

                />

              </td>



              <td></td>

              <td></td>



              <td>NOCHE</td>

              <td>

                <input

                  type="text"

                  name="noche"

                  value={terapeutaData.noche || ""}

                  onChange={handleTerapeutaChange}

                />

              </td>

            </tr>

            {/* Fila 4 */}

            <tr>

              <td>NBA</td>

              <td>

                <input

                  type="text"

                  name="NBA"

                  value={neumoniaData.NBA || ""}

                  onChange={handleNeumoniaChange}

                />

              </td>

              <td colSpan="4"></td>

            </tr>

          </tbody>

        </table>

      </div>



      {/* POSICIONES Y EJERCICIOS */}

      <h2>Hoja de Posiciones y Fisioterapia</h2>

      <div className="seccion">

        <table className="data-table">

          <thead>

            <tr>

              <th>Posicion</th>

              {horasColumnas.map((hora) => (

                <th key={hora}>{hora}</th>

              ))}

              <th colSpan="2">EJERCICIOS</th>

              <th>AM</th>

              <th>PM</th>

            </tr>

          </thead>

          <tbody>

            {posicionesFilas.map((pos, i) => (

              <tr key={pos}>

                <td>{pos}</td>

                {horasColumnas.map((hora, j) => (

                  <td key={j}>

                    <div

                      className={`toggle-button ${posicionesData[pos]?.[hora] ? "active" : ""}`}

                      onClick={() => handlePosicionesToggle(pos, hora)}

                    >

                      {posicionesData[pos]?.[hora] ? "✔" : ""}

                    </div>

                  </td>

                ))}

                {i < ejerciciosFilas.length ? (

                  <>

                    <td colSpan="2">{ejerciciosFilas[i]}</td>

                    <td>

                      <div

                        className={`toggle-button ${ejerciciosData[ejerciciosFilas[i]]?.["AM"] ? "active" : ""}`}

                        onClick={() => handleEjerciciosToggle(ejerciciosFilas[i], "AM")}

                      >

                        {ejerciciosData[ejerciciosFilas[i]]?.["AM"] ? "✔" : ""}

                      </div>

                    </td>

                    <td>

                      <div

                        className={`toggle-button ${ejerciciosData[ejerciciosFilas[i]]?.["PM"] ? "active" : ""}`}

                        onClick={() => handleEjerciciosToggle(ejerciciosFilas[i], "PM")}

                      >

                        {ejerciciosData[ejerciciosFilas[i]]?.["PM"] ? "✔" : ""}

                      </div>

                    </td>

                  </>

                ) : (

                  <td colSpan="4"></td>

                )}

              </tr>

            ))}

          </tbody>

        </table>

      </div>


{/* SECCIÓN DE FÉRULAS Y FISIOTERAPIA */}
<div className="seccion">
  <div className="ferulas-and-fisio-container">
    {/* Contenedor de Férulas - AHORA VA PRIMERO */}
    <div className="ferulas-subsection">
      <h4 className="ferulas-title">POSICIÓN FÉRULAS</h4>
      
      <div className="ferulas-opciones-group">
        <label>MMSS</label>
        <div className="opciones-ferulas-group">
          {["1x1", "1x2", "2x1"].map((op) => (
            <div
              key={op}
              className={`opcion-ferula ${ferulasData.MMSS === op ? "active" : ""}`}
              onClick={() => setFerulasData((prev) => ({ ...prev, MMSS: op }))}
            >
              {op}
            </div>
          ))}
        </div>
      </div>
      
      <div className="ferulas-opciones-group">
        <label>MMII</label>
        <div className="opciones-ferulas-group">
          {["1x1", "1x2", "2x1"].map((op) => (
            <div
              key={op}
              className={`opcion-ferula ${ferulasData.MMII === op ? "active" : ""}`}
              onClick={() => setFerulasData((prev) => ({ ...prev, MMII: op }))}
            >
              {op}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div>
    <label className="dp-label-cell">DP = Ppl - PEEP</label>
    </div>
    {/* Contenedor de Fisioterapia - AHORA VA DESPUÉS */}
    <div className="fisio-dp-subsection">
      <h4 className="ferulas-title">FISIOTERAPIA</h4>
      <div className="fisio-input-cell">
        <span className="label-above-input">Observaciones de Fisioterapia</span>
        <input
          type="text"
          value={fisioData || ""}
          onChange={(e) => setFisioData(e.target.value)}
          placeholder="Observaciones de fisioterapia"
        />
      </div>
    </div>
  </div>
</div>



      {/* BOTON GUARDAR */}

      <div className="button">

        <button className="btn btn--success btn--lg" onClick={handleSave} disabled={isSaving}>

          {isSaving ? "Guardando..." : "Guardar Hoja 6"}

        </button>

      



      {/* Botones de navegación agregados aquí */}

      <HojaNav pacienteId={id} />

    </div>

    </div>

  );

};



export default Hoja6;