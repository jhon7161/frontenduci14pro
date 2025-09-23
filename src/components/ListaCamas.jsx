// src/components/ListaCamas.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ListaCamas() {
  const { servicio } = useParams();
  const navigate = useNavigate();
  const [camas, setCamas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCamas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3002/api/camas?servicio=${encodeURIComponent(
            servicio
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCamas(res.data);
      } catch (err) {
        console.error("Error cargando camas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCamas();
  }, [servicio]);

  if (loading) return <p>Cargando camas...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Camas en {servicio}</h1>
      {camas.length === 0 ? (
        <p>No hay camas registradas para este servicio.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Número</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Estado</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Paciente</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Historia Clínica</th>
              {servicio === "UCI" && (
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {camas.map((c) => (
              <tr key={c.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{c.numero}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {c.ocupada ? "Ocupada" : "Libre"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {c.ocupada ? `${c.paciente?.nombres} ${c.paciente?.apellidos}` : "-"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {c.ocupada ? c.paciente?.historiaClinica : "-"}
                </td>
                {servicio === "UCI" && (
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {c.ocupada ? (
                      <button
                        onClick={() =>
                          navigate(`/paciente/${c.paciente?.id}?cama=${c.id}`)
                        }
                      >
                        Ver / Editar
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
