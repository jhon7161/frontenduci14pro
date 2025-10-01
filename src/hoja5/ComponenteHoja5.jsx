import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPacienteById,
  updatePaciente,
  updateHojaLocal,
} from "../reducers/pacienteSlice";
import {
  PROCEDIMIENTOS_BASE,
  INVASIVOS_BASE,
  CONVENCIONES, // Asegúrate de que esta constante esté bien definida
  GLUCOMETRIAS_BASE,
} from "./constants";
import "./Hoja5.css";
import HeaderHoja from "../Hoja1/Reutilizables/HeaderHoja";
import HojaNav from "../Hoja1/Reutilizables/HojaNav";

// Función auxiliar para calcular el total
// Parsea y suma los valores de m, t y n. Si un valor no es un número válido, se trata como 0.
const calcularTotal = (mtn) => {
  const m = parseInt(mtn.m) || 0;
  const t = parseInt(mtn.t) || 0;
  const n = parseInt(mtn.n) || 0;
  const suma = m + t + n;
  // Retorna la suma como string para que concuerde con el tipo de dato en el estado
  return suma > 0 ? suma.toString() : ''; 
};

export default function Hoja5() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pacienteSeleccionado: paciente, status, error } = useSelector(
    (state) => state.pacientes
  );

  const [invasivos, setInvasivos] = useState([]);
  const [procedimientos, setProcedimientos] = useState([]);
  const [glucometrias, setGlucometrias] = useState([]);
  const [equipos, setEquipos] = useState([{
    item: '',
    mtn: { m: '', t: '', n: '' },
    total: ''
  }, {
    item: '',
    mtn: { m: '', t: '', n: '' },
    total: ''
  }, {
    item: '',
    mtn: { m: '', t: '', n: '' },
    total: ''
  }]);

  const isInitialMount = useRef(true);

  // Cargar paciente
  useEffect(() => {
    if (id && !paciente?._id) {
      dispatch(fetchPacienteById(id));
    }
  }, [id, dispatch, paciente]);

  // Inicializar estados locales desde Redux
  useEffect(() => {
    if (paciente?._id) {
      setInvasivos(
        paciente.hoja5?.invasivos?.length > 0
          ? paciente.hoja5.invasivos
          : INVASIVOS_BASE
      );

      const procedimientosDelPaciente = paciente.hoja5?.procedimientos || [];
      const procedimientosCompletos = PROCEDIMIENTOS_BASE.map(pBase => {
          const pExistente = procedimientosDelPaciente.find(p => p.tipo === pBase.tipo);
          return {
            ...pBase,
            registroTurno: pExistente?.registroTurno || { m: false, t: false, n: false }
          };
      });
      setProcedimientos(procedimientosCompletos);

      if (paciente.hoja5?.glucometrias?.length > 0) {
        const glucometriasCompletas = GLUCOMETRIAS_BASE.map((base) => {
          const existente = paciente.hoja5.glucometrias.find(
            (g) => g.hora === base.hora
          );
          return existente ? { ...existente } : { ...base };
        });
        setGlucometrias(glucometriasCompletas);
      } else {
        setGlucometrias(GLUCOMETRIAS_BASE.map(g => ({ ...g })));
      }

      // Inicialización de equipos: Recalcula los totales si hay datos guardados
      const equiposGuardados = paciente.hoja5?.equipos || [{
        item: '',
        mtn: { m: '', t: '', n: '' },
        total: ''
      }, {
        item: '',
        mtn: { m: '', t: '', n: '' },
        total: ''
      }, {
        item: '',
        mtn: { m: '', t: '', n: '' },
        total: ''
      }];

      // Asegurarse de que el total esté correcto al cargar (opcional, pero buena práctica)
      const equiposConTotalRecalculado = equiposGuardados.map(equipo => ({
          ...equipo,
          total: calcularTotal(equipo.mtn)
      }));

      setEquipos(equiposConTotalRecalculado);

      isInitialMount.current = true;
    }
  }, [paciente]);

  // Sincronizar estados locales con Redux
  useEffect(() => {
    if (!paciente?._id) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    dispatch(
      updateHojaLocal({
        hoja: "hoja5",
        datos: { invasivos, procedimientos, glucometrias, equipos },
      })
    );
  }, [invasivos, procedimientos, glucometrias, equipos, dispatch, paciente?._id]);

  /* ------------------------------------------------------------- */
  /* HANDLERS CORREGIDOS */
  /* ------------------------------------------------------------- */
  
  const handleInvasivoChange = (index, field, value) => {
    setInvasivos((prevInvasivos) => {
        const nuevos = [...prevInvasivos];
        const item = { ...nuevos[index] };
        
        // CORRECCIÓN: Asegura que se accede a la propiedad correcta dentro del objeto mtn
        if (field.startsWith("convencion_")) {
          const turno = field.slice(-1);
          // La clave es `convencion_m`, `convencion_t` o `convencion_n`
          item.mtn = { ...item.mtn, [`convencion_${turno}`]: value };
        } else {
          item[field] = value;
          if (field === "fecha" && value) {
            const dias = Math.floor(
              (new Date() - new Date(value)) / (1000 * 60 * 60 * 24)
            );
            item.dias = Math.max(0, dias);
          }
        }
        nuevos[index] = item;
        return nuevos;
    });
  };

  const handleProcedimientoChange = (index, turno) => {
    setProcedimientos((prevProcedimientos) => {
      const nuevos = [...prevProcedimientos];
      nuevos[index] = {
        ...nuevos[index],
        registroTurno: {
          ...nuevos[index].registroTurno,
          [turno]: !nuevos[index].registroTurno[turno],
        },
      };
      return nuevos;
    });
  };
  
  const handleAddInvasivo = () => {
    setInvasivos((prevInvasivos) => [
        ...prevInvasivos,
        {
          tipo: "",
          sitio: "",
          // Estructura inicial de mtn (claves completas)
          mtn: { convencion_m: "", convencion_t: "", convencion_n: "" },
          fecha: "",
          dias: 0,
          observaciones: "",
          isRemovable: true,
        },
    ]);
  };

  const handleRemoveInvasivo = (index) => {
    setInvasivos((prevInvasivos) => prevInvasivos.filter((_, i) => i !== index));
  };


  const handleGlucometriaChange = (index, field, value) => {
    const nuevos = [...glucometrias];
    nuevos[index][field] = value;
    setGlucometrias(nuevos);
  };
  
  // 🚨 FUNCIÓN MODIFICADA PARA CALCULAR EL TOTAL
  const handleEquiposChange = (index, field, value) => {
    setEquipos(prevEquipos => {
      const nuevos = [...prevEquipos];
      let nuevoEquipo = { ...nuevos[index] };

      if (field.startsWith("mtn_")) {
        const turno = field.slice(-1);
        // 1. Actualiza el valor del turno (m, t, o n)
        nuevoEquipo.mtn = { ...nuevoEquipo.mtn, [turno]: value };
        
        // 2. Calcula el nuevo total usando la función auxiliar
        nuevoEquipo.total = calcularTotal(nuevoEquipo.mtn);
      } else {
        // Si no es un campo de mtn (ej: 'item' o 'total' directo), lo actualiza
        nuevoEquipo = { ...nuevoEquipo, [field]: value };
      }
      
      nuevos[index] = nuevoEquipo;
      return nuevos;
    });
  };

  const handleAddEquipo = () => {
    setEquipos(prevEquipos => [
      ...prevEquipos,
      { item: '', mtn: { m: '', t: '', n: '' }, total: '' }
    ]);
  };

  const handleRemoveEquipo = (index) => {
    setEquipos(prevEquipos => prevEquipos.filter((_, i) => i !== index));
  };

  const guardarHoja5 = async () => {
    if (!paciente?._id) return alert("No se encontró el ID del paciente.");
    try {
      await dispatch(
        updatePaciente({
          id: paciente._id,
          hoja: "hoja5",
          data: paciente.hoja5, 
        })
      ).unwrap();
      alert("Hoja 5 guardada correctamente ✅");
    } catch (err) {
      console.error(err);
      alert(`Error al guardar: ${err.message || "Error desconocido"}`);
    }
  };

  if (status === "loading") return <p>Cargando hoja...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!paciente?._id) return <p>Paciente no encontrado.</p>;

  return (
    <div className="hoja5-container">
      <HeaderHoja paginaActual={5} totalPaginas={6} />
      <div className="hoja5-grid">
        <div className="hoja5-top-tables-wrapper">
          <div className="hoja5-left-tables">
            <div className="hoja5-section-card invasivos-table-wrapper">
              <h3 className="hoja5-section-title">DISPOSITIVOS INVASIVOS</h3>
              <table className="hoja5-data-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Sitio</th>
                    <th>M</th>
                    <th>T</th>
                    <th>N</th>
                    <th>Fecha</th>
                    <th>Días</th>
                    <th>Obs</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {invasivos.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="text"
                          value={row.tipo || ""}
                          onChange={(e) => handleInvasivoChange(idx, "tipo", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.sitio || ""}
                          onChange={(e) => handleInvasivoChange(idx, "sitio", e.target.value)}
                        />
                      </td>
                      {["m", "t", "n"].map((turno) => (
                        <td key={turno}>
                          {/* INICIO DEL AJUSTE CLAVE PARA LA VISIBILIDAD DE LOS SÍMBOLOS */}
                          <select
                            value={row.mtn?.[`convencion_${turno}`] || ""}
                            onChange={(e) =>
                              handleInvasivoChange(
                                idx,
                                `convencion_${turno}`,
                                e.target.value
                              )
                            }
                            // Estilos en línea para forzar tamaño de fuente y alineación central del símbolo.
                            style={{ 
                              fontSize: '1.2rem', // Aumenta el tamaño para que el símbolo ocupe más espacio
                              lineHeight: '1', // Reduce la altura de línea para evitar corte vertical
                              padding: '2px 0' // Ajusta el padding para centrarlo mejor
                            }}
                          >
                            <option value=""></option>
                            {CONVENCIONES.map((c) => (
                              <option key={c.value} value={c.label}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          {/* FIN DEL AJUSTE CLAVE */}
                        </td>
                      ))}
                      <td>
                        <input
                          type="date"
                          value={row.fecha ? row.fecha.split("T")[0] : ""}
                          onChange={(e) => handleInvasivoChange(idx, "fecha", e.target.value)}
                        />
                      </td>
                      <td>{row.dias}</td>
                      <td>
                        <input
                          type="text"
                          value={row.observaciones || ""}
                          onChange={(e) => handleInvasivoChange(idx, "observaciones", e.target.value)}
                        />
                      </td>
                      <td>
                        {row.isRemovable && (
                          <button className="hoja5-btn-remove" onClick={() => handleRemoveInvasivo(idx)}>
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={handleAddInvasivo} className="btn btn--add">
              Agregar Dispositivo
            </button>
          </div>

          <div className="hoja5-right-tables-wrapper">
            <div className="hoja5-section-card procedimientos-table-wrapper">
              <h3 className="hoja5-section-title">PROCEDIMIENTOS</h3>
              <table className="hoja5-data-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>M</th>
                    <th>T</th>
                    <th>N</th>
                  </tr>
                </thead>
                <tbody>
                  {procedimientos
                    .filter(
                      (p) =>
                        PROCEDIMIENTOS_BASE.findIndex((x) => x.tipo === p.tipo) <=
                        PROCEDIMIENTOS_BASE.findIndex((x) => x.tipo === "higiene oral")
                    )
                    .map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.tipo}</td>
                        {["m", "t", "n"].map((turno) => (
                          <td key={turno}>
                            <input
                              type="checkbox"
                              checked={row.registroTurno?.[turno] || false}
                              onChange={() => handleProcedimientoChange(idx, turno)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="hoja5-section-card glucometrias-table-wrapper">
              <h3 className="hoja5-section-title">GLUCOMETRÍAS</h3>
              <table className="hoja5-data-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Valor</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {glucometrias.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.hora}</td>
                      <td>
                        <input
                          type="text"
                          value={row.valor}
                          onChange={(e) => handleGlucometriaChange(idx, "valor", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.observacion}
                          onChange={(e) => handleGlucometriaChange(idx, "observacion", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="hoja5-section-card convenciones-table-wrapper">
              <div className="hoja5-convenciones-legend">
                <h4>CONVENCIONES</h4>
                <table className="hoja5-convenciones-table hoja5-data-table">
                  <thead>
                    <tr>
                      <th>viene</th>
                      <th>inicia</th>
                      <th>cambia</th>
                      <th>susp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>→</td>
                      <td>↑</td>
                      <td>▲</td>
                      <td>↓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hoja5-section-card">
        <h3 className="hoja5-section-title">LISTA DE EQUIPOS Y MEDICAMENTOS</h3>
        <table className="hoja5-data-table">
          <thead>
            <tr>
              <th>ITEM</th>
              <th>M</th>
              <th>T</th>
              <th>N</th>
              <th>TOTAL 24 HORAS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="text"
                    value={row.item}
                    onChange={(e) => handleEquiposChange(idx, "item", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.mtn.m}
                    onChange={(e) => handleEquiposChange(idx, "mtn_m", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.mtn.t}
                    onChange={(e) => handleEquiposChange(idx, "mtn_t", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.mtn.n}
                    onChange={(e) => handleEquiposChange(idx, "mtn_n", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    // EL VALOR AHORA SE CALCULA EN handleEquiposChange, solo se muestra aquí
                    value={row.total} 
                    readOnly // Se hace de solo lectura para evitar edición manual y forzar el cálculo automático
                  />
                </td>
                <td>
                  <button className="btn btn--danger" onClick={() => handleRemoveEquipo(idx)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddEquipo} className="btn btn--add">
          Agregar Equipo o Medicamento
        </button>
      </div>

      <div className="button">
        <button className="btn btn--success btn--lg" onClick={guardarHoja5}>
          Guardar Hoja 5
        </button>
        <HojaNav pacienteId={id} />
      </div>
    </div>
  );
}