// src/components/Reutilizables/DataTable.jsx
import React from 'react';
import './DataTable.css'; // Asegúrate de crear este archivo para los estilos

export default function DataTable({ headers, data, onRemove }) {
    return (
        <div className="table-wrapper">
            <table className="data-table">
                <thead className="hoja1-table-header">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className={header.className || "data-table__th"}>
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="data-table__tr">
                            {headers.map((header, colIndex) => (
                                <td key={colIndex} className={header.className || "data-table__td"}>
                                    {/* Muestra el valor de la celda. Usa una función si es la columna de acciones. */}
                                    {header.isAction ? (
                                        onRemove(row, rowIndex)
                                    ) : (
                                        row[header.key]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}