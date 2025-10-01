import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams} from "react-router-dom";
import { updateHojaLocal, updatePaciente, fetchPacienteById } from "../reducers/pacienteSlice";

import TablaConvenciones from "./Convenciones";
import RichmondRass from "./RichmondRass";
import "./Hoja4.css";
import HeaderHoja from "../Hoja1/Reutilizables/HeaderHoja";
import HojaNav from "../Hoja1/Reutilizables/HojaNav";

const HORAS = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
    "19:00", "20:00", "21:00", "22:00", "23:00", "00:00",
    "01:00", "02:00", "03:00", "04:00", "05:00", "06:00"
];

const defaultData = {
    sedacionRass: "", pupilasOD: "", pupilasOI: "", reaccionOD: "", reaccionOI: "",
    estadoConciencia: "", fuerzaDer: "", fuerzaIzq: "", convulsiones: "",
    glasgowAO: "", glasgowRV: "", glasgowRM: "", glasgowTotal: ""
};

const defaultBraden = {
    percepcion: null, humedad: null, actividad: null, movilidad: null,
    nutricion: null, friccion: null, total: "", riesgo: "",
    upp: [{ der: "", izq: "" }, { der: "", izq: "" }, { der: "", izq: "" }]
};

const bradenOptions = {
    percepcion: ["Completamente limitada", "Muy limitada", "Levemente limitada", "Sin alteración"],
    humedad: ["Constantemente húmeda", "Muy húmeda", "Ocasionalmente húmeda", "Raramente húmeda"],
    actividad: ["Confinado a la cama", "Confinado a la silla", "Ocasionalmente camina", "Camina frecuentemente"],
    movilidad: ["Completamente inmóvil", "Muy limitada", "Ligeramente limitada", null],
    nutricion: ["Muy inadecuada", "Probablemente inadecuada", "Adecuada", "Excelente"],
    friccion: ["Es un problema", "Problema potencial", "Sin problema aparente", "Buena"]
};

const bradenRiesgo = [
    { rango: "Sin riesgo", puntaje: "19 - 23" },
    { rango: "Riesgo bajo", puntaje: "15 - 18" },
    { rango: "Riesgo moderado", puntaje: "13 - 14" },
    { rango: "Alto riesgo", puntaje: "≤ 12" },
];


const Hoja4 = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const paciente = useSelector((state) => state.pacientes.pacienteSeleccionado);

    const [hoja4Datos, setHoja4Datos] = useState([]);
    const [bradenData, setBradenData] = useState(defaultBraden);
    const [activeCategory, setActiveCategory] = useState(null); // Nuevo estado

    useEffect(() => {
        if (id) dispatch(fetchPacienteById(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (paciente?.hoja4?.datos) {
            const tablaBase = HORAS.map(hora => {
                const datoExistente = paciente.hoja4.datos.find(d => d.hora === hora) || {};
                return { ...defaultData, ...datoExistente, hora };
            });
            setHoja4Datos(tablaBase);
        } else {
            setHoja4Datos(HORAS.map(hora => ({ ...defaultData, hora })));
        }
        setBradenData(paciente?.hoja4?.braden || defaultBraden);
    }, [paciente]);

    const handleChange = (horaIndex, campo, valor) => {
        const nuevosDatos = [...hoja4Datos];
        const datoActualizado = { ...nuevosDatos[horaIndex], [campo]: valor };
        nuevosDatos[horaIndex] = datoActualizado;

        if (["glasgowAO", "glasgowRV", "glasgowRM"].includes(campo)) {
            const ao = parseInt(datoActualizado.glasgowAO) || 0;
            const rv = parseInt(datoActualizado.glasgowRV) || 0;
            const rm = parseInt(datoActualizado.glasgowRM) || 0;
            const total = ao + rv + rm;
            nuevosDatos[horaIndex].glasgowTotal = total > 0 ? `${total}/15` : "";
        }
        setHoja4Datos(nuevosDatos);
    };

    const handleBradenChange = (campo, valor) => {
        const nuevaBraden = { ...bradenData, [campo]: valor };
        let total = 0;
        // La lógica de puntuación debe basarse en el valor numérico (1, 2, 3 o 4)
        Object.keys(bradenOptions).forEach((k) => {
            const puntuacion = nuevaBraden[k];
            // Asegúrate de sumar solo si el valor es un número (diferente de null)
            if (typeof puntuacion === 'number') total += puntuacion;
        });
        
        nuevaBraden.total = total > 0 ? `${total}/23` : "";
        
        // La lógica de riesgo debe basarse en el total numérico (no en la cadena)
        if (total <= 12 && total > 0) nuevaBraden.riesgo = "Alto riesgo"; // total > 0 para evitar que 0 sea "Alto riesgo"
        else if (total <= 14 && total > 0) nuevaBraden.riesgo = "Riesgo moderado";
        else if (total <= 18 && total > 0) nuevaBraden.riesgo = "Riesgo bajo"; // Corregido: el rango es 15-18
        else if (total >= 19) nuevaBraden.riesgo = "Sin riesgo";
        else nuevaBraden.riesgo = ""; // Si total es 0 o no se ha completado

        setBradenData(nuevaBraden);
    };

    const handleSitioChange = (index, lado, valor) => {
        const nuevosSitios = [...(bradenData.upp || defaultBraden.upp)];
        nuevosSitios[index] = { ...nuevosSitios[index], [lado]: valor };
        setBradenData({ ...bradenData, upp: nuevosSitios });
    };

    const guardarHojaManualmente = () => {
        if (!id) return;
        const datosParaGuardar = { datos: hoja4Datos, braden: bradenData };
        dispatch(updateHojaLocal({ hoja: "hoja4", datos: datosParaGuardar }));
        dispatch(updatePaciente({ id, hoja: "hoja4", data: datosParaGuardar }));
        alert("✅ Hoja 4 guardada con éxito");
    };

    return (
        <div className="hoja4-container"> {/* Aquí se corrigió el error de sintaxis '<' */}
            <HeaderHoja paginaActual={4} totalPaginas={6} />
            <h2 className="header-title center">Control Neurológico</h2>

            {/* Tabla de Control Neurológico */}
            <div className="hoja4-table-wrapper">
                <table className="hoja4-table">
                    <thead>
                        <tr>
                            <th rowSpan="2">Hora</th>
                            <th colSpan="1">Sedación</th>
                            <th colSpan="4">Pupilas</th>
                            <th colSpan="2">Fuerza</th>
                            <th rowSpan="2">Convulsiones</th>
                            <th colSpan="4">Glasgow</th>
                        </tr>
                        <tr>
                            <th>RASS</th>
                            <th>OD</th>
                            <th>OI</th>
                            <th>R-OD</th>
                            <th>R-OI</th>
                            <th>Der.</th>
                            <th>Izq.</th>
                            <th>AO</th>
                            <th>RV</th>
                            <th>RM</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hoja4Datos.map((dato, index) => (
                            <tr key={index}>
                                <td>{dato.hora}</td>
                                <td><input type="text" value={dato.sedacionRass} onChange={e => handleChange(index, "sedacionRass", e.target.value)} /></td>
                                <td><input type="text" value={dato.pupilasOD} onChange={e => handleChange(index, "pupilasOD", e.target.value)} /></td>
                                <td><input type="text" value={dato.pupilasOI} onChange={e => handleChange(index, "pupilasOI", e.target.value)} /></td>
                                <td><input type="text" value={dato.reaccionOD} onChange={e => handleChange(index, "reaccionOD", e.target.value)} /></td>
                                <td><input type="text" value={dato.reaccionOI} onChange={e => handleChange(index, "reaccionOI", e.target.value)} /></td>
                                <td><input type="text" value={dato.fuerzaDer} onChange={e => handleChange(index, "fuerzaDer", e.target.value)} /></td>
                                <td><input type="text" value={dato.fuerzaIzq} onChange={e => handleChange(index, "fuerzaIzq", e.target.value)} /></td>
                                <td><input type="text" value={dato.convulsiones} onChange={e => handleChange(index, "convulsiones", e.target.value)} /></td>
                                <td><input type="text" value={dato.glasgowAO} onChange={e => handleChange(index, "glasgowAO", e.target.value)} /></td>
                                <td><input type="text" value={dato.glasgowRV} onChange={e => handleChange(index, "glasgowRV", e.target.value)} /></td>
                                <td><input type="text" value={dato.glasgowRM} onChange={e => handleChange(index, "glasgowRM", e.target.value)} /></td>
                                <td><input type="text" value={dato.glasgowTotal} onChange={e => handleChange(index, "glasgowTotal", e.target.value)} disabled /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <TablaConvenciones hoja4Datos={hoja4Datos} setHoja4Datos={setHoja4Datos} />
                <RichmondRass value={hoja4Datos} onChange={setHoja4Datos} className="section-richmond" />
            </div> {/* Cierre correcto de hoja4-table-wrapper */}

            {/* INICIO: Contenedor principal de Braden y UPP */}
            <div className="braden-upp-container">
                <div className="braden-container">
                    <h3>Escala de Braden</h3>

                    <table className="braden-table">
                        <thead>
                            <tr>
                                <th>Condición</th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(bradenOptions).map(([campo, opciones]) => {
                                const opcionesAMostrar =
                                    campo === "movilidad" ? opciones.slice(0, 3) : opciones;

                                return (
                                    <tr key={campo}>
                                        <td className="braden-condicion">{campo}</td>
                                        {opcionesAMostrar.map((op, idx) => (
                                            <td key={idx} className="braden-radio-cell">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={campo}
                                                        checked={bradenData[campo] === idx + 1}
                                                        onChange={() => handleBradenChange(campo, idx + 1)}
                                                    />
                                                    <span className="opcion-texto">{op}</span>
                                                </label>
                                            </td>
                                        ))}
                                        {/* Si movilidad solo tiene 3 opciones, dejamos un <td> vacío */}
                                        {campo === "movilidad" && <td></td>}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="braden-total">
                        <strong>Total:</strong> {bradenData.total || "--"}{" "}
                        ({bradenData.riesgo || ""})
                    </div>
                </div>

                <div className="clasificacion-upp-container">
                    <div className="braden-clasificacion-container">
                        <h3>Clasificación del Riesgo</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Rango</th>
                                    <th>Puntaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bradenRiesgo.map((fila, index) => (
                                    <tr key={index}>
                                        <td>{fila.rango}</td>
                                        <td>{fila.puntaje}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="upp-container">
                        <h3>UPP</h3>
                        {(bradenData.upp || defaultBraden.upp).map((fila, i) => (
                            <div key={i} className="upp-row">
                                <label>
                                    D(
                                    <input
                                        type="text"
                                        value={fila.der}
                                        onChange={(e) =>
                                            handleSitioChange(i, "der", e.target.value)
                                        }
                                    />
                                    )
                                </label>
                                <label>
                                    I(
                                    <input
                                        type="text"
                                        value={fila.izq}
                                        onChange={(e) =>
                                            handleSitioChange(i, "izq", e.target.value)
                                        }
                                    />
                                    )
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div> {/* FIN: Cierre de .braden-upp-container */}

            {/* SECCIÓN DE BOTONES: Aparece DEBAJO de la sección Braden/UPP */}
            <div className="button">
                <button className="btn btn--lg btn--success" onClick={guardarHojaManualmente}>Guardar Hoja 4</button>
                <HojaNav pacienteId={id} />
            </div>
        </div>
    );
};

export default Hoja4;