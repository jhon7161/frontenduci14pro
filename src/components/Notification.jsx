import { useSelector } from 'react-redux';

const Notification = () => {
  const { message, type } = useSelector(state => state.notification);

  if (!message) return null;

  const backgroundColors = {
    success: '#4caf50',  // verde
    error: '#f44336',    // rojo
    info: '#00bcd4',     // aqua
    warning: '#ff9800',  // naranja
  };

  const style = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    minWidth: '250px',
    padding: '15px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backgroundColor: backgroundColors[type] || '#00bcd4', // fallback aqua
    color: '#fff',
    fontWeight: '600',
    fontSize: '20px',
    zIndex: 1000,
    opacity: 1,
    pointerEvents: 'auto',
    transition: 'opacity 0.3s ease-in-out',
    userSelect: 'none',
  };

  return (
    <div style={style}>
      {message}
    </div>
  );
};

export default Notification;
