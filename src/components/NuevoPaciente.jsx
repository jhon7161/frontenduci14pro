// src/components/NuevoPaciente.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const NuevoPaciente = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.pacientes);

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    historiaClinica: "",
    ingreso: "",
    sexo: "M",
    edad: "",
    eps: "",
    tipoUCI: "UCI INTERMEDIOS",
  });

  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await dispatch(crearPaciente(form)).unwrap();
      setSubmitSuccess(true);
      setForm({
        nombres: "",
        apellidos: "",
        historiaClinica: "",
        ingreso: "",
        sexo: "M",
        edad: "",
        eps: "",
        tipoUCI: "UCI INTERMEDIOS",
      });
    } catch (err) {
      setSubmitError(err.message || "Error al crear paciente");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Registrar Nuevo Paciente</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={form.nombres}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="historiaClinica"
          placeholder="Historia Clínica"
          value={form.historiaClinica}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="ingreso"
          placeholder="Número de Ingreso EPS"
          value={form.ingreso}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={form.edad}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="sexo"
          value={form.sexo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        <input
          type="text"
          name="eps"
          placeholder="EPS"
          value={form.eps}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="tipoUCI"
          value={form.tipoUCI}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="UCI INTERMEDIOS">UCI Intermedios</option>
          <option value="UCI">UCI</option>
          <option value="UCIP">UCIP</option>
          <option value="UCIA">UCIA</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Paciente"}
        </button>

        {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
        {submitSuccess && <p className="text-green-500 mt-2">Paciente creado correctamente</p>}
      </form>
    </div>
  );
};

export default NuevoPaciente;
