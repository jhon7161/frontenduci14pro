import React from "react";

const NeumoniaForm = ({ form, setForm }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualiza los datos dentro de form.hoja6.neumonia
    setForm(prev => ({
      ...prev,
      hoja6: {
        ...prev.hoja6,
        neumonia: {
          ...prev.hoja6.neumonia,
          [name]: value
        }
      }
    }));
  };

  // Inicializa neumonia si no existe
  React.useEffect(() => {
    if (!form.hoja6.neumonia) {
      setForm(prev => ({
        ...prev,
        hoja6: {
          ...prev.hoja6,
          neumonia: {
            NN: "",
            NAC: "",
            NAC_TR: "",
            NAN: "",
            NAN_TR: "",
            NBA: "",
            NBA_TR: "",
            DIAS_VM: ""
          }
        }
      }));
    }
  }, []);

  const { NN, NAC, NAC_TR, NAN, NAN_TR, NBA, NBA_TR, DIAS_VM } = form.hoja6.neumonia || {};

  return (
    <div className="neumonia-wrapper">
      <table className="neumonia-table">
        <thead>
          <tr>
            <th colSpan={2}>Neumonía</th>
            <th colSpan={2}>Terapeuta Respiratoria</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>NN</th>
            <td><input type="text" name="NN" value={NN || ""} onChange={handleChange} /></td>
            <th>Días en VM</th>
            <td><input type="text" name="DIAS_VM" value={DIAS_VM || ""} onChange={handleChange} /></td>
          </tr>
          <tr>
            <th>NAC</th>
            <td><input type="text" name="NAC" value={NAC || ""} onChange={handleChange} /></td>
            <td>Mañana</td>
            <td><input type="text" name="NAC_TR" value={NAC_TR || ""} onChange={handleChange} /></td>
          </tr>
          <tr>
            <th>NAN</th>
            <td><input type="text" name="NAN" value={NAN || ""} onChange={handleChange} /></td>
            <td>Tarde</td>
            <td><input type="text" name="NAN_TR" value={NAN_TR || ""} onChange={handleChange} /></td>
          </tr>
          <tr>
            <th>NBA</th>
            <td><input type="text" name="NBA" value={NBA || ""} onChange={handleChange} /></td>
            <td>Noche</td>
            <td><input type="text" name="NBA_TR" value={NBA_TR || ""} onChange={handleChange} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NeumoniaForm;
