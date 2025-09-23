import React from 'react';

const AddableList = ({ title, items, newItem, onNewItemChange, onAddItem, onRemoveItem, placeholder }) => {
  return (
    <div className="list-section">
      <h3 className="list-section__title">{title}</h3>
      <div className="input-add-group">
        <input
          type="text"
          value={newItem}
          placeholder={placeholder}
          onChange={onNewItemChange}
          className="input-field"
        />
        <button onClick={onAddItem} className="button button--add">
          Agregar
        </button>
      </div>
      <ul className="list-chips">
        {(items || []).map((item, i) => (
          <li key={i} className="list-chips__item">
            <span>{item}</span>
            <button onClick={() => onRemoveItem(i)} className="button button--remove">
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddableList;