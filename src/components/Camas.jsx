import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCamas, asignarPacienteACama, liberarCama, trasladarPacienteACama } from "../reducers/camasSlice";
import { fetchPacientes } from "../reducers/pacienteSlice";
import { notifyWithTimeout } from "../reducers/notificationReducer";

export default function CamasPacientes() {
  const dispatch = useDispatch();

  const { list: camas, status: camasStatus } = useSelector((state) => state.camas);
  const { list: pacientes, status: pacientesStatus } = useSelector((state) => state.pacientes);

  const [camaSeleccionada, setCamaSeleccionada] = useState({});
  const [filtrosPacientes, setFiltrosPacientes] = useState({
    historiaClinica: "",
    nombre: "",
    apellido: "",
    servicio: ""
  });
  const [filtrosCamas, setFiltrosCamas] = useState({
    servicio: "",
    estado: ""
  });

  const recargarDatos = useCallback(() => {
    dispatch(fetchCamas());
    dispatch(fetchPacientes());
  }, [dispatch]);

  useEffect(() => {
    recargarDatos();
  }, [recargarDatos]);

  const handleAction = async (action, successMessage, errorMessage) => {
    try {
      await dispatch(action).unwrap();
      dispatch(notifyWithTimeout(successMessage, 3000));
    } catch (err) {
      const message = err.message || errorMessage;
      dispatch(notifyWithTimeout(message, 5000));
    }
  };

  const handleAsignarCama = async (pacienteId) => {
    const camaId = camaSeleccionada[pacienteId];
    if (!camaId) return;

    const paciente = pacientes.find(p => p._id === pacienteId);
    if (!paciente) return;

    if (paciente.cama?.id) {
      handleAction(
        trasladarPacienteACama({ pacienteId, nuevaCamaId: camaId }),
        "Paciente trasladado correctamente.",
        "Error al trasladar el paciente."
      );
    } else {
      handleAction(
        asignarPacienteACama({ pacienteId, camaId }),
        "Cama asignada correctamente.",
        "Error al asignar la cama."
      );
    }
    setCamaSeleccionada((prev) => ({ ...prev, [pacienteId]: "" }));
  };

  const handleLiberarCamaPaciente = async (camaId) => {
    if (!window.confirm("¿Desea liberar esta cama y dar de alta al paciente?")) return;
    handleAction(
      liberarCama(camaId),
      "Cama liberada correctamente.",
      "Error al liberar la cama."
    );
  };
  
  const loading = camasStatus === 'loading' || pacientesStatus === 'loading';
  if (loading) return <p>Cargando datos...</p>;

  const servicios = [...new Set(camas.map((c) => c.servicio).filter(Boolean))];

  // Filtrado de camas y pacientes
  const camasFiltradas = camas.filter(c =>
    (!filtrosCamas.servicio || c.servicio === filtrosCamas.servicio) &&
    (filtrosCamas.estado === "ocupada" ? c.ocupada : filtrosCamas.estado === "libre" ? !c.ocupada : true)
  );

  const pacientesFiltrados = pacientes.filter(p =>
    p.historiaClinica.toLowerCase().includes(filtrosPacientes.historiaClinica.toLowerCase()) &&
    (p.nombres?.toLowerCase().includes(filtrosPacientes.nombre.toLowerCase()) ?? false) &&
    (p.apellidos?.toLowerCase().includes(filtrosPacientes.apellido.toLowerCase()) ?? false)
  );

  const camasLibresFiltradas = camas.filter(c =>
    !c.ocupada &&
    (!filtrosPacientes.servicio || c.servicio === filtrosPacientes.servicio)
  );
  
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🛏️ Gestión de Camas y Pacientes</h1>

      <section style={{ marginBottom: "20px" }}>
        <h2>🛏️ Lista de Camas</h2>
        {/* ... (filtros y tabla de camas) ... */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>Número</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Paciente</th>
              <th>Historia Clínica</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {camasFiltradas.map(c => (
              <tr key={c._id} style={{ backgroundColor: c.ocupada ? "#ffe5e5" : "#e5ffe5" }}>
                <td>{c.numero}</td>
                <td>{c.servicio}</td>
                <td>{c.ocupada ? "Ocupada" : "Libre"}</td>
                <td>{c.paciente ? `${c.paciente.nombres} ${c.paciente.apellidos}` : "—"}</td>
                <td>{c.paciente?.historiaClinica || "—"}</td>
                <td>
                  {c.ocupada && (
                    <button
                      onClick={() => handleLiberarCamaPaciente(c._id)}
                      style={{ padding: "4px 8px", cursor: "pointer", backgroundColor: "#fdd" }}
                    >
                      Liberar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      ---

      <section>
        <h2>👩‍⚕️ Lista de Pacientes</h2>
        {/* ... (filtros y tabla de pacientes) ... */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Historia Clínica</th>
              <th>Cama</th>
              <th>Asignar / Liberar</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.map(p => (
              <tr key={p._id}>
                <td>{p.nombres}</td>
                <td>{p.apellidos}</td>
                <td>{p.historiaClinica}</td>
                <td>{p.cama?.numero || "Sin cama"}</td>
                <td style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <select
                    value={camaSeleccionada[p._id] || ""}
                    onChange={e => setCamaSeleccionada(prev => ({ ...prev, [p._id]: e.target.value }))}
                  >
                    <option value="">{p.cama?.id ? "Cambiar cama" : "Seleccione cama libre"}</option>
                    {camasLibresFiltradas.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.numero} - {c.servicio}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleAsignarCama(p._id)} style={{ padding: "4px 8px", cursor: "pointer" }}>
                    {p.cama?.id ? "Trasladar" : "Asignar"}
                  </button>
                  {p.cama?.id && (
                    <button onClick={() => handleLiberarCamaPaciente(p.cama._id)} style={{ padding: "4px 8px", cursor: "pointer", backgroundColor: "#fdd" }}>
                      Liberar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}