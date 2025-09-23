export const generarDatosIniciales = (tipo) => {
  // Aquí debes definir la lógica para generar los datos
  // según el valor de 'tipo'.
  
  // Este es solo un ejemplo de cómo podrías estructurar la lógica.
  // Reemplaza esta lógica con la que necesites para tu aplicación.
  switch (tipo) {
    case 'ventilacion_mecanica':
      return {
        seccion1: {
          campoA: '',
          campoB: false,
        },
        // ... datos específicos para este tipo
      };
    case 'diagnostico':
      return {
        seccion2: {
          campoX: 0,
          campoY: '',
        },
        // ... otros datos para diagnóstico
      };
    default:
      // Retorna una estructura de datos vacía o por defecto
      // si el tipo no coincide.
      return {};
  }
};