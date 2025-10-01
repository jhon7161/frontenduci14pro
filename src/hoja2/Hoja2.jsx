import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchPacienteById,
  updatePaciente,
  updateHojaLocal,
} from "../reducers/pacienteSlice";
import "./Hoja2.css";
import HeaderHoja from "../Hoja1/Reutilizables/HeaderHoja";
import HojaNav from "../Hoja1/Reutilizables/HojaNav";
import { notifyWithTimeout } from "../reducers/notificationReducer";

export default function Hoja2() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const paciente = useSelector((state) => state.pacientes.pacienteSeleccionado);

  const [hoja2Datos, setHoja2Datos] = useState([]);

  const { pacienteSeleccionado, status, error } = useSelector(
    (state) => state.pacientes
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const { hoja2, _id: pacienteId } = pacienteSeleccionado || {};
  const peso = pacienteSeleccionado?.hoja1?.peso ?? 0;
  const {
    balances = {},
    administrados = [],
    eliminados = {},
    auxiliares = {},
  } = hoja2 || {};
  const otrosEliminados = eliminados.otros || [];
  const hours = [
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2,
    3, 4, 5, 6,
  ];

  const getDosisArray = (dosisData) =>
    Array.isArray(dosisData) ? dosisData : Array(24).fill("");

  const {
    totals,
    totalBalanceDiaAdm,
    totalBalanceDiaElim,
    balanceDia,
    gastoUrinarioTotal,
    balanceAcumuladoDia,
  } = useMemo(() => {
    let diuresisAcum = 0;
    const totals = [];

    hours.forEach((hour, hIdx) => {
      const diuresisHora = parseFloat(eliminados?.diuresisHora?.[hIdx] || 0);
      diuresisAcum += diuresisHora;

      const getGu = () => {
        if (hour === 13) return diuresisAcum / 7 / peso;
        if (hour === 19)
          return (diuresisAcum - (totals[6]?.diuresisAcum ?? 0)) / 6 / peso;
        if (hour === 6)
          return (diuresisAcum - (totals[12]?.diuresisAcum ?? 0)) / 12 / peso;
        return 0;
      };

      const totalAdm = administrados.reduce(
        (acc, cur) => acc + (parseFloat(getDosisArray(cur.dosis)[hIdx]) || 0),
        0
      );
      const otrosTot = otrosEliminados.reduce(
        (acc, cur) => acc + (parseFloat(getDosisArray(cur.valores)[hIdx]) || 0),
        0
      );
      const ufHora = parseFloat(eliminados?.uf?.[hIdx] || 0);
      const totalElim = diuresisHora + ufHora + otrosTot;
      const balanceHora = totalAdm - totalElim;

      totals.push({
        totalAdm,
        totalElim,
        balanceHora,
        diuresisAcum,
        gu: getGu(),
      });
    });

    const totalBalanceDiaAdm = totals.reduce(
      (acc, cur) => acc + cur.totalAdm,
      0
    );
    const totalBalanceDiaElim = totals.reduce(
      (acc, cur) => acc + cur.totalElim,
      0
    );
    const balanceDia = totalBalanceDiaAdm - totalBalanceDiaElim;
    const diuresisTotal =
      eliminados.diuresisHora?.reduce((s, v) => s + (parseFloat(v) || 0), 0) ||
      0;
    const gastoUrinarioTotal = diuresisTotal / (peso * 24);
    const balanceAcumuladoDia = balanceDia + (parseFloat(balances?.previo) || 0);

    return {
      totals,
      totalBalanceDiaAdm,
      totalBalanceDiaElim,
      balanceDia,
      gastoUrinarioTotal,
      balanceAcumuladoDia,
    };
  }, [
    hoja2,
    peso,
    administrados,
    eliminados,
    otrosEliminados,
    balances,
    hours,
    getDosisArray,
  ]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPacienteById(id));
    }
  }, [dispatch, id]);

  const handleDataChange = (path, value) => {
    dispatch(
      updateHojaLocal({
        hoja: "hoja2",
        datos: { ...setNestedValue(hoja2, path, value) },
      })
    );
  };

  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    let current = { ...obj };
    let temp = current;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!temp[key]) {
        temp[key] = {};
      }
      if (Array.isArray(temp[key])) {
        temp[key] = [...temp[key]];
      } else if (typeof temp[key] === "object" && temp[key] !== null) {
        temp[key] = { ...temp[key] };
      }
      temp = temp[key];
    }
    const finalKey = keys[keys.length - 1];
    if (finalKey.includes("[")) {
      const arrayKey = finalKey.substring(0, finalKey.indexOf("["));
      const index = parseInt(
        finalKey.substring(finalKey.indexOf("[") + 1, finalKey.indexOf("]"))
      );
      if (Array.isArray(temp[arrayKey])) {
        const newArray = [...temp[arrayKey]];
        newArray[index] = value;
        temp[arrayKey] = newArray;
      }
    } else {
      temp[finalKey] = value;
    }
    return current;
  };

  const handleListChange = (listName, action, index, horaIndex, value) => {
    let newHoja2 = JSON.parse(JSON.stringify(hoja2));

    let listToUpdate;

    if (listName === "administrados") {
      listToUpdate = newHoja2.administrados;
    } else if (listName === "eliminados.otros") {
      if (!newHoja2.eliminados) newHoja2.eliminados = {};
      if (!newHoja2.eliminados.otros) newHoja2.eliminados.otros = [];
      listToUpdate = newHoja2.eliminados.otros;
    } else {
      return;
    }

    if (action === "add") {
      if (listName === "administrados") {
        listToUpdate.push({ nombre: "", dosis: Array(24).fill("") });
      } else if (listName === "eliminados.otros") {
        listToUpdate.push({ nombre: "", valores: Array(24).fill("") });
      }
    } else if (action === "remove") {
      listToUpdate.splice(index, 1);
    } else if (action === "update") {
      const item = listToUpdate[index];
      if (horaIndex !== null) {
        if (item.dosis) {
          item.dosis[horaIndex] = value;
        } else if (item.valores) {
          item.valores[horaIndex] = value;
        }
      } else {
        item.nombre = value;
      }
    }

    dispatch(
      updateHojaLocal({
        hoja: "hoja2",
        datos: newHoja2,
      })
    );
  };

  const handleGuardar = async () => {
    if (!pacienteId) {
      dispatch(
        notifyWithTimeout("No se pudo guardar: ID de paciente no disponible", 4000)
      );

      setMessageType("error");
      return;
    }
    try {
      await dispatch(
        updatePaciente({ id: pacienteId, hoja: "hoja2", data: hoja2 })
      ).unwrap();

      dispatch(notifyWithTimeout("Hoja 2 guardada correctamente.", 4000));
    } catch (err) {
      setMessage(`Error al guardar: ${err.message || err.error}`);
      setMessageType("error");
    }
  };

  const renderMessage = () => {
    if (!message) return null;
    return (
      <div className={`notification-message ${messageType}`}>
        {message}
      </div>
    );
  };

  return (
    <>
      <div className="hoja2-container">
        <HeaderHoja paginaActual={2} totalPaginas={6} />
        <h2 className="main-title">Hoja de Balance de Líquidos</h2>
        {renderMessage()}
        <p>
          Peso del paciente: <strong>{peso} kg</strong>
        </p>
        <div className="table-wrapper">
          <table className="hoja2-data-table">
            <thead>
              <tr>
                <th rowSpan="2">Hora</th>
                <th colSpan={administrados.length || 1}>ADMINISTRADOS</th>
                <th rowSpan="2" className="hoja2-vertical">TOTAL ADM</th>
                <th rowSpan="2" className="hoja2-vertical">TOTAL ACUM</th>
                <th colSpan={otrosEliminados.length > 0 ? otrosEliminados.length + 4 : 5}>
                  ELIMINADOS
                </th>
                <th rowSpan="2" className="hoja2-vertical">TOTAL HORA</th>
                <th rowSpan="2" className="hoja2-vertical">ACUM</th>
                <th rowSpan="2" className="hoja2-vertical">BALANCE HORA</th>
                <th rowSpan="2" className="hoja2-vertical">ACUM</th>
              </tr>
              <tr>
                {administrados.length === 0 ? (
                  <th>Agregar Adm.</th>
                ) : (
                  administrados.map((item, i) => (
                    <th key={i} className="hoja2-vertical">
                      <div className="header-content">
                        <input
                          type="text"
                          value={item.nombre ?? ""}
                          onChange={(e) =>
                            handleListChange("administrados", "update", i, null, e.target.value)
                          }
                          placeholder="Nombre"
                        />
                        <button
                          className="btn btn--danger"
                          onClick={() => handleListChange("administrados", "remove", i)}
                        >
                          X
                        </button>
                      </div>
                    </th>
                  ))
                )}
                <th>DH</th>
                <th>DA</th>
                <th>UF</th>
                <th>GU</th>
                {otrosEliminados.length === 0 ? (
                  <th>Agregar Otro</th>
                ) : (
                  otrosEliminados.map((item, i) => (
                    <th key={i} className="hoja2-vertical">
                      <div className="header-content">
                        <input
                          type="text"
                          value={item.nombre ?? ""}
                          onChange={(e) =>
                            handleListChange("eliminados.otros", "update", i, null, e.target.value)
                          }
                          placeholder="Otro"
                        />
                        <button
                          className="btn btn--danger"
                          onClick={() => handleListChange("eliminados.otros", "remove", i)}
                        >
                          X
                        </button>
                      </div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour, hIdx) => {
                const t = totals[hIdx];
                const totalAdmAcum = totals
                  .slice(0, hIdx + 1)
                  .reduce((s, t) => s + t.totalAdm, 0);
                const totalElimAcum = totals
                  .slice(0, hIdx + 1)
                  .reduce((s, t) => s + t.totalElim, 0);
                const balanceAcum = totals
                  .slice(0, hIdx + 1)
                  .reduce((s, t) => s + t.balanceHora, 0);

                return (
                  <tr key={hour}>
                    <td data-label="Hora">{hour}</td>
                    {administrados.length === 0 ? (
                      <td className="data-cell"></td>
                    ) : (
                      administrados.map((item, i) => (
                        <td key={i} data-label={item.nombre || "Administrado"}>
                          <input
                            type="number"
                            className="hoja2-vertical-input"
                            value={item.dosis?.[hIdx] ?? ""}
                            onChange={(e) =>
                              handleListChange("administrados", "update", i, hIdx, e.target.value)
                            }
                            autoComplete="off"
                          />
                        </td>
                      ))
                    )}
                    <td data-label="Total Adm">{t?.totalAdm.toFixed(2)}</td>
                    <td data-label="Total Adm Acumulado">{totalAdmAcum.toFixed(2)}</td>
                    <td data-label="Diuresis">
                      <input
                        type="number"
                        value={eliminados?.diuresisHora?.[hIdx] ?? ""}
                        onChange={(e) =>
                          handleDataChange(`eliminados.diuresisHora[${hIdx}]`, e.target.value)
                        }
                      />
                    </td>
                    <td data-label="Diuresis Acumulada">{t?.diuresisAcum.toFixed(2)}</td>
                    <td data-label="UF">
                      <input
                        type="number"
                        value={eliminados?.uf?.[hIdx] ?? ""}
                        onChange={(e) =>
                          handleDataChange(`eliminados.uf[${hIdx}]`, e.target.value)
                        }
                      />
                    </td>
                    <td data-label="GU">{t?.gu.toFixed(2)}</td>
                    {otrosEliminados.length === 0 ? (
                      <td className="data-cell"></td>
                    ) : (
                      otrosEliminados.map((item, i) => (
                        <td key={i} data-label={item.nombre || "Otro Eliminado"}>
                          <input
                            type="number"
                            className="hoja2-vertical-input"
                            value={item.valores?.[hIdx] ?? ""}
                            onChange={(e) =>
                              handleListChange("eliminados.otros", "update", i, hIdx, e.target.value)
                            }
                            autoComplete="off"
                          />
                        </td>
                      ))
                    )}
                    <td data-label="Total Eliminado">{t?.totalElim.toFixed(2)}</td>
                    <td data-label="Total Eliminado Acumulado">{totalElimAcum.toFixed(2)}</td>
                    <td data-label="Balance Hora">{t?.balanceHora.toFixed(2)}</td>
                    <td data-label="Balance Acumulado">{balanceAcum.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="button-container">
          <button className="btn btn--add" onClick={() => handleListChange("administrados", "add")}>
            + Agregar Administrado
          </button>
          <button className="btn btn-add" onClick={() => handleListChange("eliminados.otros", "add")}>
            + Agregar Otro Eliminado
          </button>
        </div>

        <div className="hoja2-auxiliares-balances-wrapper">
  <div className="hoja2-balances-table-container">
    <h3 className="hoja2-section-title">Balances</h3>
    <table className="hoja2-info-table">
      <tbody>
        <tr>
          <td data-label="ADM">ADM</td>
          <td data-label="Total Admin.">
            <input
              type="number"
              value={totalBalanceDiaAdm.toFixed(2)}
              readOnly
              className="hoja2-input--read-only"
            />
          </td>
          <td data-label="PREVIO">PREVIO</td>
          <td data-label="Valor Previo">
            <input
              type="number"
              value={balances.previo ?? 0}
              onChange={(e) =>
                handleDataChange("balances.previo", parseFloat(e.target.value) || 0)
              }
            />
          </td>
        </tr>
        <tr>
          <td data-label="ELIM">ELIM</td>
          <td data-label="Total Eliminado">
            <input
              type="number"
              value={totalBalanceDiaElim.toFixed(2)}
              readOnly
              className="hoja2-input--read-only"
            />
          </td>
          <td data-label="DIA">DIA</td>
          <td data-label="Balance del Día">
            <input
              type="number"
              value={balanceDia.toFixed(2)}
              readOnly
              className="hoja2-input--read-only"
            />
          </td>
        </tr>
        <tr>
          <td data-label="GASTO URINARIO">GASTO URINARIO</td>
          <td data-label="GU Total">
            <input
              type="number"
              value={gastoUrinarioTotal.toFixed(2)}
              readOnly
              className="hoja2-input--read-only"
            />
          </td>
          <td data-label="ACUMULADO">ACUMULADO</td>
          <td data-label="Balance Acumulado">
            <input
              type="number"
              value={balanceAcumuladoDia.toFixed(2)}
              readOnly
              className="hoja2-input--read-only"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div className="hoja2-auxiliares-table-container">
    <h3 className="hoja2-section-title">Auxiliares de Enfermería</h3>
    <table className="hoja2-info-table">
      <tbody>
        <tr>
          <td data-label="MAÑANA">MAÑANA</td>
          <td data-label="Nombre Auxiliar">
            <input
              type="text"
              value={auxiliares.manana ?? ""}
              onChange={(e) => handleDataChange("auxiliares.manana", e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td data-label="TARDE">TARDE</td>
          <td data-label="Nombre Auxiliar">
            <input
              type="text"
              value={auxiliares.tarde ?? ""}
              onChange={(e) => handleDataChange("auxiliares.tarde", e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td data-label="NOCHE">NOCHE</td>
          <td data-label="Nombre Auxiliar">
            <input
              type="text"
              value={auxiliares.noche ?? ""}
              onChange={(e) => handleDataChange("auxiliares.noche", e.target.value)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

        <div className="button">
          
          <button className="btn btn--lg btn--success" onClick={handleGuardar}>
            Guardar Hoja 2
          </button>
          <HojaNav pacienteId={id} />
        </div>
      </div>
    </>
  );
}