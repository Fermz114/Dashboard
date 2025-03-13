// Ejemplo: Cerrar mensajes de error automáticamente
document.addEventListener('DOMContentLoaded', () => {
    // Cerrar mensajes de error después de 5 segundos
    const errorMessages = document.querySelectorAll('.error');
    errorMessages.forEach(msg => {
      setTimeout(() => {
        msg.style.display = 'none';
      }, 5000);
    });
  
    // Ejemplo: Confirmación antes de eliminar
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!confirm('¿Estás seguro de eliminar este registro?')) {
          e.preventDefault();
        }
      });
    });
  });