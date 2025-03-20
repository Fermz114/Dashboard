// helpers/utils.js
module.exports = {
    formatCurrency: (value) => {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(value);
    },
    
    formatDate: (date) => {
      return new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  