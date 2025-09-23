import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
    fetchPacienteById,
    updateHojaLocal,
    updatePaciente,
} from "../reducers/pacienteSlice";
import Tiss28Form from "./Tiss28Form";
import HeaderHoja from "./Reutilizables/HeaderHoja";
import HojaNav from "./Reutilizables/HojaNav";
import ListSection from "./ListSection";
import "./Hoja1.css";
import { notifyWithTimeout } from '../reducers/notificationReducer'

// FUNCIONES DE LÓGICA
const calcularDiasEstancia = (fechaIngreso, fechaActual) => {
    if (!fechaIngreso || !fechaActual) return "";
    const ingreso = new Date(fechaIngreso);
    const actual = new Date(fechaActual);
    const diffTime = Math.abs(actual - ingreso);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const calcularSC = (peso, tallaMetros) => {
    const p = parseFloat(peso);
    const tM = parseFloat(tallaMetros) * 100;
    if (isNaN(p) || isNaN(tM) || p <= 0 || tM <= 0) return "";
    return (0.007184 * Math.pow(p, 0.425) * Math.pow(tM, 0.725)).toFixed(2);
};

// COMPONENTE PRINCIPAL
export default function Hoja1() {
    // 1. HOOKS Y ESTADO LOCAL
    const { id } = useParams();
    const dispatch = useDispatch();
    const { pacienteSeleccionado: paciente, status, error } = useSelector(
        (state) => state.pacientes
    );

    const [form, setForm] = useState({
        fechaActual: new Date().toISOString().split("T")[0],
        peso: "",
        talla: "",
        sc: "",
        tipoUCI: "",
        apache: "",
        tiss: "",
        laboratorios: {},
        diagnosticos: [],
        problemas: [],
        dosisUnica: [],
        medicamentosHorarios: [],
        medicamentosInfusion: [],
        nuevoDiagnostico: "",
        nuevoProblema: "",
        nuevaDosisUnica: { hora: "", nombre: "", dosis: "", via: "", ordenadoPor: "" },
        nuevoMedHorario: { fechaInicio: "", nombre: "", horas: "", dosis: "", via: "" },
        nuevoMedInfusion: { nombre: "", dosis: "" },
        enfermeroJefe: { manana: "", tarde: "", noche: "" },
    });

    const [showTiss28Form, setShowTiss28Form] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchPacienteById(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (paciente?._id) {
            const hoja1Data = paciente.hoja1 || {};
            const initialPeso = hoja1Data.peso || "";
            const initialTalla = hoja1Data.talla || "";
            const calculatedSC = initialPeso && initialTalla ? calcularSC(initialPeso, initialTalla) : "";

            setForm({
                ...hoja1Data,
                fechaActual: hoja1Data.fechaActual || new Date().toISOString().split("T")[0],
                peso: initialPeso,
                talla: initialTalla,
                sc: calculatedSC,
                laboratorios: hoja1Data.laboratorios || {},
                diagnosticos: hoja1Data.diagnosticos || [],
                problemas: hoja1Data.problemas || [],
                dosisUnica: hoja1Data.dosisUnica || [],
                medicamentosHorarios: hoja1Data.medicamentosHorarios || [],
                medicamentosInfusion: hoja1Data.medicamentosInfusion || [],
                nuevoDiagnostico: "",
                nuevoProblema: "",
                nuevaDosisUnica: { hora: "", nombre: "", dosis: "", via: "", ordenadoPor: "" },
                nuevoMedHorario: { fechaInicio: "", nombre: "", horas: "", dosis: "", via: "" },
                nuevoMedInfusion: { nombre: "", dosis: "" },
                enfermeroJefe: hoja1Data.enfermeroJefe || { manana: "", tarde: "", noche: "" },
            });
        }
    }, [paciente]);



    // 2. CONSTANTES Y FUNCIONES DE LÓGICA
    const gruposLaboratorios = [
        ["hb", "hto", "leuc", "neut", "linf", "cay", "plaq", "bun", "creat"],
        ["glicemia", "na", "k", "cl", "ca", "mg", "pt", "ptt", "inr"],
        ["rx", "cultivos", "hemo", "uro", "ekg", "pdeo"],
    ];

    // 3. MANEJADORES DE EVENTOS
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedForm = { ...form, [name]: value };
        if (name === "fechaActual") {
            updatedForm.diasEstancia = calcularDiasEstancia(paciente.fechaIngreso, value);
        }
        if (name === "peso" || name === "talla") {
            const peso = name === "peso" ? value : updatedForm.peso;
            const talla = name === "talla" ? value : updatedForm.talla;
            updatedForm.sc = calcularSC(peso, talla);
        }
        setForm(updatedForm);
        dispatch(updateHojaLocal({ hoja: "Hoja1", datos: updatedForm }));
    };

    // Nuevo manejador para el grupo de 'enfermeroJefe'
    const handleEnfermeroJefeChange = (e) => {
        const { name, value } = e.target;
        const updatedEnfermeroJefe = {
            ...form.enfermeroJefe,
            [name]: value,
        };
        const updatedForm = {
            ...form,
            enfermeroJefe: updatedEnfermeroJefe,
        };
        setForm(updatedForm);
        dispatch(updateHojaLocal({ hoja: "Hoja1", datos: updatedForm }));
    };

    const handleTissInputClick = () => {
        setShowTiss28Form(true);
    };

    const handleTissValueSelected = (tissValue) => {
        const newForm = { ...form, tiss: tissValue };
        setForm(newForm);
        dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
        setShowTiss28Form(false);
    };

    const addDiagnostico = () => {
        if (form.nuevoDiagnostico?.trim()) {
            const updatedDiagnosticos = [...(form.diagnosticos || []), form.nuevoDiagnostico.trim()];
            const newForm = { ...form, diagnosticos: updatedDiagnosticos, nuevoDiagnostico: "" };
            setForm(newForm);
            dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
            dispatch(notifyWithTimeout('¡Diagnóstico agregado con éxito!', 'success', 4000));
            

        }
    };

    const removeDiagnostico = (idx) => {
        const updatedDiagnosticos = form.diagnosticos.filter((_, i) => i !== idx);
        const newForm = { ...form, diagnosticos: updatedDiagnosticos };
        setForm(newForm);
        dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
        dispatch(notifyWithTimeout('¡Diagnostico removido con éxito!', 'success', 4000))
    };

    const addProblema = () => {
        if (form.nuevoProblema?.trim()) {
            const updatedProblemas = [...(form.problemas || []), form.nuevoProblema.trim()];
            const newForm = { ...form, problemas: updatedProblemas, nuevoProblema: "" };
            setForm(newForm);
            dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
            dispatch(notifyWithTimeout('¡Problema agregado con éxito!', 'success', 4000))
        }
    };

    const removeProblema = (idx) => {
        const updatedProblemas = form.problemas.filter((_, i) => i !== idx);
        const newForm = { ...form, problemas: updatedProblemas };
        setForm(newForm);
        dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
        dispatch(notifyWithTimeout('¡Problema removido con éxito!', 'success', 4000))
    };

    const handleLaboratoriosChange = (e) => {
        const { name, value } = e.target;
        const updatedLaboratorios = { ...form.laboratorios, [name]: value };
        const newForm = { ...form, laboratorios: updatedLaboratorios };
        setForm(newForm);
        dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
    };

    const addDosisUnica = () => {
        const d = form.nuevaDosisUnica;
        if (d?.nombre?.trim() && d?.hora?.trim()) {
            const updatedDosis = [...(form.dosisUnica || []), d];
            const newForm = {
                ...form,
                dosisUnica: updatedDosis,
                nuevaDosisUnica: { hora: "", nombre: "", dosis: "", via: "", ordenadoPor: "" },
            };
            setForm(newForm);
            dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
            dispatch(notifyWithTimeout('¡DosisUnica agregado con éxito!', 'success', 4000))
        }
    };

    const removeDosisUnica = (idx) => {
        const updatedDosis = form.dosisUnica.filter((_, i) => i !== idx);
        const newForm = { ...form, dosisUnica: updatedDosis };
        setForm(newForm);
        dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
        dispatch(notifyWithTimeout('¡DosisUnica Removido con éxito!', 'success', 4000))
    };

    const addMedHorario = () => {
        const m = form.nuevoMedHorario;
        if (m?.nombre?.trim() && m?.fechaInicio?.trim() && m?.dosis?.trim()) {
            const updatedMeds = [...(form.medicamentosHorarios || []), m];
            const newForm = {
                ...form,
                medicamentosHorarios: updatedMeds,
                nuevoMedHorario: { fechaInicio: "", nombre: "", horas: "", dosis: "", via: "" },
            };
            setForm(newForm);
            dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
            dispatch(notifyWithTimeout('¡Medicamento agregado con éxito!', 'success', 4000))
        }
    };

    const removeMedHorario = (idx) => {
        const updatedMeds = form.medicamentosHorarios.filter((_, i) => i !== idx);
        const newForm = { ...form, medicamentosHorarios: updatedMeds };
        setForm(newForm);
        dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
        dispatch(notifyWithTimeout('¡Medicamento removido con éxito!', 'success', 4000))
    };

    const addMedInfusion = () => {
        const m = form.nuevoMedInfusion;
        if (m?.nombre?.trim() && m?.dosis?.trim()) {
            const updatedMeds = [...(form.medicamentosInfusion || []), m];
            const newForm = {
                ...form,
                medicamentosInfusion: updatedMeds,
                nuevoMedInfusion: { nombre: "", dosis: "" },
            };
            setForm(newForm);
            dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
            dispatch(notifyWithTimeout('¡MedInfusion agregado con éxito!', 'success', 4000))
        }
    };

    const removeMedInfusion = (idx) => {
        const updatedMeds = form.medicamentosInfusion.filter((_, i) => i !== idx);
        const newForm = { ...form, medicamentosInfusion: updatedMeds };
        setForm(newForm);
        dispatch(updateHojaLocal({ hoja: "Hoja1", datos: newForm }));
        dispatch(notifyWithTimeout('¡MedInfusion removido con éxito!', 'success', 4000))
    };

    const guardarHoja1 = async () => {
        try {
            await dispatch(
                updatePaciente({ id: paciente._id, hoja: "hoja1", data: form })
            ).unwrap();
            dispatch(notifyWithTimeout('datos agregado con éxito!', 'success', 4000))
        } catch (err) {
            console.error(err);
            dispatch(notifyWithTimeout('¡Error al guardar la Hoja 1 ❌!', 'error', 4000));
        }
    };

    // 4. RENDERIZADO CONDICIONAL Y JSX
    if (status === "loading") {
        return <p className="status-message status-message--loading">Cargando paciente...</p>;
    }
    if (status === "failed") {
        return <p className="status-message status-message--error">Error: {error}</p>;
    }
    if (!paciente?._id) {
        return <p className="status-message status-message--not-found">Paciente no encontrado.</p>;
    }

    return (
        <div className="hoja-papel-container">
            <HeaderHoja paginaActual={1} totalPaginas={6} />
            {/* Sección de Datos del Paciente */}
            <section className="section">
                <h2 className="section-title">Datos del Paciente</h2>
                <div className="grid grid--responsive">
                    <div className="input-group">
                        <label>Nombres</label>
                        <input type="text" value={paciente.nombres} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                    <div className="input-group">
                        <label>Apellidos</label>
                        <input type="text" value={paciente.apellidos} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                    <div className="input-group">
                        <label>Historia Clínica</label>
                        <input type="text" value={paciente.historiaClinica} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                    <div className="input-group">
                        <label>Ingreso</label>
                        <input type="text" value={paciente.ingreso} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                </div>
                <div className="grid grid--responsive">
                    <div className="input-group">
                        <label>Edad</label>
                        <input type="text" value={paciente.edad || ""} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                    <div className="input-group">
                        <label>Sexo</label>
                        <input type="text" value={paciente.sexo} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                    <div className="input-group">
                        <label>EPS</label>
                        <input type="text" value={paciente.eps} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                    <div className="input-group">
                        <label>Cama</label>
                        <input type="text" value={paciente.cama?.numero || ""} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                </div>
                <div className="grid grid--responsive">
                    <div className="input-group">
                        <label>Fecha de ingreso</label>
                        <input type="date" value={paciente.fechaIngreso?.split("T")[0]} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                    <div className="input-group">
                        <label>Fecha actual</label>
                        <input type="date" name="fechaActual" value={form.fechaActual} onChange={handleInputChange} className="input-group__input" />
                    </div>
                    <div className="input-group">
                        <label>Días de estancia</label>
                        <input type="text" value={calcularDiasEstancia(paciente.fechaIngreso, form.fechaActual)} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                </div>
            </section>

            {/* Sección de Tipo de UCI y Mediciones */}
            <section className="section">
                <h2 className="section-title">Tipo de UCI y Mediciones</h2>
                <div className="grid grid--responsive">
                    <div className="input-group">
                        <label>Tipo de UCI</label>
                        <select name="tipoUCI" value={form.tipoUCI} onChange={handleInputChange} className="input-group__select">
                            <option value="">Seleccione...</option>
                            <option value="UCI">UCI</option>
                            <option value="UCI INTERMEDIOS">UCI INTERMEDIOS</option>
                            <option value="UCIP">UCIP</option>
                            <option value="UCIA">UCIA</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Peso (kg)</label>
                        <input type="number" step="0.1" name="peso" value={form.peso} onChange={handleInputChange} className="input-group__input" />
                    </div>
                    <div className="input-group">
                        <label>Talla (m)</label>
                        <input type="number" step="0.01" name="talla" value={form.talla} onChange={handleInputChange} className="input-group__input" />
                    </div>
                    <div className="input-group">
                        <label>Superficie Corporal</label>
                        <input type="text" name="sc" value={form.sc} readOnly className="input-group__input input-group__input--read-only" />
                    </div>
                    <div className="input-group">
                        <label>APACHE</label>
                        <input type="text" name="apache" value={form.apache} onChange={handleInputChange} className="input-group__input" />
                    </div>
                    <div className="input-group">
                        <label>TISS</label>
                        <input type="text" name="tiss" value={form.tiss} readOnly onClick={handleTissInputClick} className="input-group__input input-group__input--read-only cursor-pointer" />
                    </div>
                </div>
            </section>

            {/* Sección de Diagnósticos y Problemas */}
            <section className="section">
                <h2 className="section-title">Diagnósticos y Problemas</h2>
                <div className="grid grid--responsive">
                    <ListSection
                        title="Diagnósticos"
                        value={form.nuevoDiagnostico}
                        onChange={(e) => setForm({ ...form, nuevoDiagnostico: e.target.value })}
                        onAdd={addDiagnostico}
                        onRemove={removeDiagnostico}
                        items={form.diagnosticos || []}
                        placeholder="Nuevo diagnóstico"
                    />
                    <ListSection
                        title="Problemas"
                        value={form.nuevoProblema}
                        onChange={(e) => setForm({ ...form, nuevoProblema: e.target.value })}
                        onAdd={addProblema}
                        onRemove={removeProblema}
                        items={form.problemas || []}
                        placeholder="Nuevo problema"
                    />
                </div>
            </section>
            
            {/* Sección de Enfermero Jefe */}
            <section className="section">
                <h2 className="section-title">Enfermero Jefe</h2>
                <div className="grid grid--responsive">
                    <div className="input-group">
                        <label>Turno Mañana</label>
                        <input
                            type="text"
                            name="manana"
                            value={form.enfermeroJefe.manana}
                            onChange={handleEnfermeroJefeChange}
                            className="input-group__input"
                        />
                    </div>
                    <div className="input-group">
                        <label>Turno Tarde</label>
                        <input
                            type="text"
                            name="tarde"
                            value={form.enfermeroJefe.tarde}
                            onChange={handleEnfermeroJefeChange}
                            className="input-group__input"
                        />
                    </div>
                    <div className="input-group">
                        <label>Turno Noche</label>
                        <input
                            type="text"
                            name="noche"
                            value={form.enfermeroJefe.noche}
                            onChange={handleEnfermeroJefeChange}
                            className="input-group__input"
                        />
                    </div>
                </div>
            </section>

            {/* Sección de Laboratorios y Estudios */}
            <section className="section">
                <h2 className="section-title">Laboratorios y Estudios</h2>
                {gruposLaboratorios.map((grupo, i) => (
                    <div key={i} className="grid grid--responsive">
                        {grupo.map((campo) => (
                            <div key={campo} className="input-group">
                                <label className="input-group__label">{campo.toUpperCase()}</label>
                                <input name={campo} value={form.laboratorios?.[campo] || ""} onChange={handleLaboratoriosChange} placeholder="Valor" className="input-group__input" />
                            </div>
                        ))}
                    </div>
                ))}
            </section>

            {/* Sección de Medicamentos por Horario */}
            <section className="section">
                <h2 className="section-title">Medicamentos por Horario</h2>
                <div className="grid grid--responsive">
                    <input type="text" placeholder="Fecha de Inicio" value={form.nuevoMedHorario.fechaInicio} onChange={(e) => setForm({ ...form, nuevoMedHorario: { ...form.nuevoMedHorario, fechaInicio: e.target.value } })} className="input-group__input" />
                    <input type="text" placeholder="Nombre" value={form.nuevoMedHorario.nombre} onChange={(e) => setForm({ ...form, nuevoMedHorario: { ...form.nuevoMedHorario, nombre: e.target.value } })} className="input-group__input" />
                    <input type="text" placeholder="Horas" value={form.nuevoMedHorario.horas} onChange={(e) => setForm({ ...form, nuevoMedHorario: { ...form.nuevoMedHorario, horas: e.target.value } })} className="input-group__input" />
                    <input type="text" placeholder="Dosis" value={form.nuevoMedHorario.dosis} onChange={(e) => setForm({ ...form, nuevoMedHorario: { ...form.nuevoMedHorario, dosis: e.target.value } })} className="input-group__input" />
                    <input type="text" placeholder="Vía" value={form.nuevoMedHorario.via} onChange={(e) => setForm({ ...form, nuevoMedHorario: { ...form.nuevoMedHorario, via: e.target.value } })} className="input-group__input" />
                    <button onClick={addMedHorario} className="btn btn--add">
                        Agregar
                    </button>
                </div>
                <div className="table-wrapper">
    <table className="data-table">
        <thead className="hoja1-table-header">
            <tr>
                <th className="col-fecha">Fecha Inicio</th>
                <th className="col-nombre">Nombre</th>
                <th className="col-horas">Horas</th>
                <th className="col-dosis">Dosis</th>
                <th className="col-via">Vía</th>
                <th className="col-acciones">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {(form.medicamentosHorarios || []).map((m, i) => (
                <tr key={i} className="data-table__tr">
                    <td className="col-fecha">{m.fechaInicio}</td>
                    <td className="col-nombre">{m.nombre}</td>
                    <td className="col-horas">{m.horas}</td>
                    <td className="col-dosis">{m.dosis}</td>
                    <td className="col-via">{m.via}</td>
                    <td className="col-acciones">
                        <button onClick={() => removeMedHorario(i)} className="btn btn--danger">
                            Eliminar
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
               
        
            </section>btn

            {/* Sección de Medicamentos por Infusión */}
            <section className="section">
                <h2 className="section-title">Medicamentos por Infusión</h2>
                <div className="grid grid--responsive">
                    <input type="text" placeholder="Nombre" value={form.nuevoMedInfusion.nombre} onChange={(e) => setForm({ ...form, nuevoMedInfusion: { ...form.nuevoMedInfusion, nombre: e.target.value } })} className="input-group__input" />
                    <input type="text" placeholder="Dosis" value={form.nuevoMedInfusion.dosis} onChange={(e) => setForm({ ...form, nuevoMedInfusion: { ...form.nuevoMedInfusion, dosis: e.target.value } })} className="input-group__input" />
                    <button onClick={addMedInfusion} className="btn btn--add">
                        Agregar
                    </button>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead className="hoja1-table-header">
                            <tr>
                                <th className="coll-nombre">Nombre</th>
                                <th className="coll-dosis">Dosis</th>
                                <th className="acciones-col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(form.medicamentosInfusion || []).map((m, i) => (
                                <tr key={i} className="data-table__tr">
                                    <td className="coll-nombre">{m.nombre}</td>
                                    <td className="coll-dosis">{m.dosis}</td>
                                    <td className="acciones-col">
                                        <button onClick={() => removeMedInfusion(i)} className="btn btn--danger">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Sección de Dosis Única */}
            <section className="section">
                <h2 className="section-title">Dosis Única</h2>
                <div className="grid grid--responsive">
                    <input type="text" placeholder="Hora" value={form.nuevaDosisUnica.hora} onChange={(e) => setForm({ ...form, nuevaDosisUnica: { ...form.nuevaDosisUnica, hora: e.target.value } })} className="input-group__input" />
                    <input type="text" placeholder="Nombre" value={form.nuevaDosisUnica.nombre} onChange={(e) => setForm({ ...form, nuevaDosisUnica: { ...form.nuevaDosisUnica, nombre: e.target.value } })} className="input-group__input" />
                    <input type="text" placeholder="Dosis" value={form.nuevaDosisUnica.dosis} onChange={(e) => setForm({ ...form, nuevaDosisUnica: { ...form.nuevaDosisUnica, dosis: e.target.value } })} className="input-group__input" />
                    <input type="text" placeholder="Vía" value={form.nuevaDosisUnica.via} onChange={(e) => setForm({ ...form, nuevaDosisUnica: { ...form.nuevaDosisUnica, via: e.target.value } })} className="input-group__input" />
                    <input type="text" placeholder="Ordenado por" value={form.nuevaDosisUnica.ordenadoPor} onChange={(e) => setForm({ ...form, nuevaDosisUnica: { ...form.nuevaDosisUnica, ordenadoPor: e.target.value } })} className="input-group__input" />
                    <button onClick={addDosisUnica} className="btn btn--add">
                        Agregar
                    </button>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead className="hoja1-table-header">
                            <tr>
                                <th className="colll-hora">Hora</th>
                                <th className="colll-nombre">Nombre</th>
                                <th className="colll-dosis">Dosis</th>
                                <th className="colll-via">Vía</th>
                                <th className="colll-ordenado">Ordenado por</th>
                                <th className="acciones-col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(form.dosisUnica || []).map((d, i) => (
                                <tr key={i} className="data-table__tr">
                                    <td className="colll-hora">{d.hora}</td>
                                    <td className="colll-nombre">{d.nombre}</td>
                                    <td className="colll-dosis">{d.dosis}</td>
                                    <td className="colll-via">{d.via}</td>
                                    <td className="colll-ordenado">{d.ordenadoPor}</td>
                                    <td className="acciones-col">
                                        <button onClick={() => removeDosisUnica(i)} className="btn btn--danger">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="button">
                <button onClick={guardarHoja1} className="btn btn--lg btn--success">
                    Guardar Hoja 1
                </button>
                <HojaNav pacienteId={id} />
            </div>
            {showTiss28Form && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <Tiss28Form
                            onSave={handleTissValueSelected}
                            onClose={() => setShowTiss28Form(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}