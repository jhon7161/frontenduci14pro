// ListSection.js

import React from "react";

export default function ListSection({
    title,
    value,
    onChange,
    onAdd,
    onRemove,
    items,
    placeholder
}) {
    return (
        <div className="list-section">
            <h3>{title}</h3>
            <div className="add-item-group">
                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                />
                <button onClick={onAdd} className="btn btn--add">
                    Agregar
                </button>
            </div>
            <ul className="item-list">
                {items.map((item, i) => (
                    <li key={item} className="list-chip"> 
                        <span>{item}</span>
                        <button 
                            onClick={() => onRemove(i)} 
                            className="btn btn--danger"
                            aria-label={`Eliminar ${item}`}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}