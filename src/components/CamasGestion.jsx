function CamaCard({ cama, token, onSeleccionarPaciente }) {
  const handleClick = async () => {
    if (!cama.ocupada) return;

    try {
      const res = await fetch(`http://localhost:3002/api/pacientes/por-cama/${cama.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.id) {
        alert("No hay paciente en esta cama");
        return;
      }

      // Enviar datos al formulario
      onSeleccionarPaciente(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar datos del paciente");
    }
  };

  return (
    <div
      className={`cama-card ${cama.ocupada ? "ocupada" : "libre"}`}
      onClick={handleClick}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "5px",
        cursor: cama.ocupada ? "pointer" : "default",
        backgroundColor: cama.ocupada ? "#ffe5e5" : "#e5ffe5",
      }}
    >
      <p>Cama {cama.numero}</p>
      <p>{cama.ocupada ? "Ocupada" : "Libre"}</p>
    </div>
  );
}
