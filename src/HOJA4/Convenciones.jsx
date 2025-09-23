import React from 'react';


const TablaConvenciones = () => {
  return (
    <div className="convenciones-container">
      <div className="hoja-header">
        <h3 className="header-title">CONVENCIONES</h3>
      </div>
      <div className="convenciones-table-wrapper">
        <table className="hoja4-table">
          <tbody>
            <tr>
              <td>1= Agitado, ansioso</td>
              <td><div className="pupil-circle pupil-1mm"></div></td>
              <td>1 mm</td>
              <td>A=ALERTA</td>
              <td>P=PRESENTE</td>
              <td>1</td>
              <td>NO</td>
              <td>NO</td>
              <td>NO</td>
            </tr>

            <tr>
              <td>2= Cooperador, orientado, tranquilo</td>
              <td><div className="pupil-circle pupil-2mm"></div></td>
              <td>2 mm</td>
              <td>S=SOMNOLIENTO</td>
              <td>D=DISMINUIDA</td>
              <td>2</td>
              <td>Al dolor</td>
              <td>Incomprensible</td>
              <td>Extensión</td>
            </tr>

            <tr>
              <td>3= Responde a orden</td>
              <td><div className="pupil-circle pupil-3mm"></div></td>
              <td>3 mm</td>
              <td>EST=ESTUPOR</td>
              <td>A=AUSENTE</td>
              <td>3</td>
              <td>Al hablarle</td>
              <td>Inapropiada</td>
              <td>Flexión</td>
            </tr>

            <tr>
              <td>4= Dormido breve respuesta a la luz</td>
              <td><div className="pupil-circle pupil-4mm"></div></td>
              <td>4 mm</td>
              <td>C=COMA</td>
              <td></td>
              <td>4</td>
              <td>Espontánea</td>
              <td>Confusa</td>
              <td>Retirada</td>
            </tr>

            <tr>
              <td>5= Respuesta a solo dolor</td>
              <td><div className="pupil-circle pupil-5mm"></div></td>
              <td>5 mm</td>
              <td></td>
              <td></td>
              <td>5</td>
              <td></td>
              <td>Orientado</td>
              <td>Localiza</td>
            </tr>

            <tr>
              <td>6= No responde</td>
              <td><div className="pupil-circle pupil-6mm"></div></td>
              <td>6 mm</td>
              <td></td>
              <td></td>
              <td>6</td>
              <td></td>
              <td></td>
              <td>Obedece</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaConvenciones;
