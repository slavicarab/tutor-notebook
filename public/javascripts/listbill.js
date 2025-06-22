document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('select[name="status"]').forEach(function(select) {
    select.addEventListener('change', function() {
      const row = select.closest('tr');
      const billId = row.querySelector('input[name="billId"]').value; // Hidden input with bill ID
      const status = select.value;

      fetch('/bills/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billId, status })
      })
      .then(response => response.json())
      .then(result => {
            if (result.success) {
            location.reload(); // ✅ Reloads the page
        }
        })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  });
});