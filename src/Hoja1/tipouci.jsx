import React, { useState, useEffect } from 'react';
import Tiss28Form from './Tiss28Form';
import "./Hoja1.css";
const TipoUci = ({ form = {}, onChange, cama }) => {
    const [mostrarTiss, setMostrarTiss] = useState(false);
    const [scCalculado, setScCalculado] = useState("");

    const abrirTiss = () => setMostrarTiss(true);
    const cerrarTiss = () => setMostrarTiss(false);

    const guardarTiss = (total) => {
        onChange({ target: { name: "tiss", value: String(total) } });
        cerrarTiss();
    };

    useEffect(() => {
        const peso = parseFloat(form?.peso || 0);
        const talla = parseFloat(form?.talla || 0);

        if (peso > 0 && talla > 0) {
            const alturaCm = talla * 100;
            const sc = Math.sqrt((alturaCm * peso) / 3600).toFixed(2);
            setScCalculado(sc);
            if (form?.sc !== sc) {
                onChange({ target: { name: "sc", value: sc } });
            }
        }
    }, [form?.peso, form?.talla, form?.sc, onChange]);

    return (
        <div className="tipo-uci-container">
            <div className="tipo-uci-grid">
                <div className="tipo-uci-cell">
                    SC (Mosteller):
                    <input
                        type="text"
                        name="sc"
                        value={scCalculado}
                        readOnly
                        className="tipo-uci-input read-only"
                        title="Superficie corporal calculada automáticamente"
                    />
                </div>
                <div className="tipo-uci-cell">
                    TISS:
                    <input
                        type="text"
                        name="tiss"
                        value={form?.tiss || ""}
                        onChange={onChange}
                        onClick={abrirTiss}
                        className="tipo-uci-input clickable"
                        title="Haz clic para valorar TISS-28"
                    />
                </div>
                <div className="tipo-uci-cell">
                    APACHE:
                    <input
                        type="text"
                        name="apache"
                        value={form?.apache || ""}
                        onChange={onChange}
                        className="tipo-uci-input"
                    />
                </div>
                <div className="tipo-uci-cell">
                    Tipo de UCI:
                    <select
                        name="tipoUCI"
                        value={form?.tipoUCI || ""}
                        onChange={onChange}
                        className="tipo-uci-input"
                    >
                        <option value="">Seleccione...</option>
                        <option value="UCI">UCI</option>
                        <option value="UCI INTERMEDIOS">UCI INTERMEDIOS</option>
                        <option value="UCIP">UCIP</option>
                        <option value="UCIA">UCIA</option>
                    </select>
                </div>
                <div className="tipo-uci-cell">
                    Peso (kg):
                    <input
                        type="number"
                        step="0.1"
                        name="peso"
                        value={form?.peso || ""}
                        onChange={onChange}
                        className="tipo-uci-input"
                    />
                </div>
                <div className="tipo-uci-cell">
                    Talla (m):
                    <input
                        type="number"
                        step="0.01"
                        name="talla"
                        value={form?.talla || ""}
                        onChange={onChange}
                        className="tipo-uci-input"
                    />
                </div>
            </div>
            <input type="hidden" name="camaId" value={cama?.id || ""} />
            {mostrarTiss && <Tiss28Form onClose={cerrarTiss} onSave={guardarTiss} />}
        </div>
    );
};

export default TipoUci;
