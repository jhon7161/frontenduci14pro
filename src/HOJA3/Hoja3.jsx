import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateHojaLocal, updatePaciente, fetchPacienteById } from "../reducers/pacienteSlice";
import "./Hoja3.css"; // Importa el archivo CSS
import HeaderHoja from "../Hoja1/Reutilizables/HeaderHoja";
import HojaNav from "../Hoja1/Reutilizables/HojaNav";

export default function Hoja3() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const paciente = useSelector((state) => state.pacientes.pacienteSeleccionado);

  const [hoja3Datos, setHoja3Datos] = useState([]);
  const [otrosNombres, setOtrosNombres] = useState(["Otro 1", "Otro 2", "Otro 3"]);

  const camposSignosVitales = ["FC", "TAS", "TAD", "TAM", "FR", "SAT", "TEMP"];
  const camposVigileo = ["PVC", "GC", "IC", "VVS", "IVS", "VS", "VRS", "IRVS", "ScvO2", "PCP", "TAMAP"];

  const generarHoras = () => {
    const horas = [];
    for (let i = 7; i < 24; i++) {
      horas.push(`${String(i).padStart(2, "0")}:00`);
    }
    for (let i = 0; i < 7; i++) {
      horas.push(`${String(i).padStart(2, "0")}:00`);
    }
    return horas;
  };

  const horasDelDia = generarHoras();

  const nuevaFila = {
    ...camposSignosVitales.reduce((acc, campo) => ({ ...acc, [campo]: "" }), {}),
    ...camposVigileo.reduce((acc, campo) => ({ ...acc, [campo]: "" }), {}),
    otros: otrosNombres.map((nombre) => ({ nombre, valor: "" })),
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchPacienteById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const tablaBase = horasDelDia.map((hora) => ({ ...nuevaFila, Hora: hora }));

    if (
      paciente &&
      paciente.hoja3 &&
      Array.isArray(paciente.hoja3.datos) &&
      paciente.hoja3.datos.length > 0
    ) {
      const datosPaciente = paciente.hoja3.datos;

      datosPaciente.forEach((filaPaciente) => {
        const idx = tablaBase.findIndex((filaBase) => filaBase.Hora === filaPaciente.Hora);
        if (idx !== -1) {
          tablaBase[idx] = { ...tablaBase[idx], ...filaPaciente };
        }
      });

      const nombresGuardados = datosPaciente[0]?.otros?.map((o) => o.nombre);
      if (nombresGuardados && nombresGuardados.length === otrosNombres.length) {
        setOtrosNombres(nombresGuardados);
      }
    }

    setHoja3Datos(tablaBase);
  }, [paciente]);

  const handleOtrosNameChange = (e, index) => {
    const nuevosNombres = [...otrosNombres];
    nuevosNombres[index] = e.target.value;
    setOtrosNombres(nuevosNombres);
  };

  const handleChange = (e, filaIdx, campo) => {
    const actualizado = hoja3Datos.map((fila, i) => {
      if (i === filaIdx) {
        const esOtroCampo = otrosNombres.includes(campo);
        if (esOtroCampo) {
          const otroIdx = otrosNombres.indexOf(campo);
          const nuevosOtros = [...(fila.otros || [])];

          const otroActualizado = {
            ...(nuevosOtros[otroIdx] || { nombre: otrosNombres[otroIdx] }),
            valor: e.target.value,
          };
          nuevosOtros[otroIdx] = otroActualizado;

          return { ...fila, otros: nuevosOtros };
        }
        return { ...fila, [campo]: e.target.value };
      }
      return fila;
    });
    setHoja3Datos(actualizado);
  };

  const guardarHoja = () => {
    const datosFinales = hoja3Datos.map((fila) => ({
      ...fila,
      otros: fila.otros.map((o, i) => ({ ...o, nombre: otrosNombres[i] })),
    }));
    dispatch(updateHojaLocal({ hoja: "hoja3", datos: datosFinales }));
    dispatch(updatePaciente({ id, hoja: "hoja3", data: { datos: datosFinales } }));
  };

  return (
    <div className="hoja3-container">
    <HeaderHoja paginaActual={3} totalPaginas={6} />
      <h2 className="main-title">Hoja 3: Signos Vitales y Hemodinámicos</h2>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th colSpan={22} className="table-title">MONITORIA HEMODINÁMICA</th>
            </tr>
            <tr>
              <th colSpan={8} className="table-subtitle">SIGNOS VITALES</th>
              <th colSpan={11} className="table-subtitle">VIGILEO / SWAN GANZ</th>
              <th colSpan={3} className="table-subtitle">OTROS</th>
            </tr>
            <tr>
              <th className="sticky-header">Hora</th>
              {camposSignosVitales.map((c) => (
                <th key={c} className="sticky-header">{c}</th>
              ))}
              {camposVigileo.map((c) => (
                <th key={c} className="sticky-header">{c}</th>
              ))}
              {otrosNombres.map((nombre, index) => (
                <th key={index} className="sticky-header">
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => handleOtrosNameChange(e, index)}
                    className="input-header"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hoja3Datos.map((fila, idx) => (
              <tr key={idx}>
                <td className="time-cell">{fila.Hora}</td>
                {camposSignosVitales.map((campo) => (
                  <td key={`${campo}-${idx}`}>
                    <input
                      type="text"
                      value={fila[campo] || ""}
                      onChange={(e) => handleChange(e, idx, campo)}
                    />
                  </td>
                ))}
                {camposVigileo.map((campo) => (
                  <td key={`${campo}-${idx}`}>
                    <input
                      type="text"
                      value={fila[campo] || ""}
                      onChange={(e) => handleChange(e, idx, campo)}
                    />
                  </td>
                ))}
                {otrosNombres.map((nombre, index) => {
                  const valorOtro = fila.otros?.[index]?.valor || "";
                  return (
                    <td key={`otro-${index}-${idx}`}>
                      <input
                        type="text"
                        value={valorOtro}
                        onChange={(e) => handleChange(e, idx, nombre)}
                      />
                  </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button">
        <button onClick={guardarHoja} className="btn btn--success btn--lg">
          Guardar Hoja 3
        </button>
          <>
        <HojaNav pacienteId={id} />
          </>
      </div>
    </div>
  );
}