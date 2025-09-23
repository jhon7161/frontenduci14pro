import { useEffect, useState } from "react";
import { getPacientes, eliminarPaciente } from "../services/pacienteService";

const PacienteLista = () => {
  const [pacientes, setPacientes] = useState([]);

  const cargarPacientes = async () => {
    try {
      const data = await getPacientes();
      setPacientes(data);
    } catch (err) {
      console.error("Error cargando pacientes", err);
    }
  };

  const borrarPaciente = async (id) => {
    try {
      await eliminarPaciente(id);
      cargarPacientes(); // recargar lista
    } catch (err) {
      console.error("Error eliminando paciente", err);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  return (
    <div>
      <h2>Pacientes</h2>
      <ul>
        {pacientes.map((p) => (
          <li key={p.id}>
            {p.nombre} {p.apellido} - HC: {p.historiaClinica} - 
            {p.cama ? ` Cama: ${p.cama.numero}` : " Sin cama"}
            <button onClick={() => borrarPaciente(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PacienteLista;
