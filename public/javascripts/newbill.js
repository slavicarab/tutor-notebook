document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.send-btn').forEach(function(button) {
    button.addEventListener('click', function() {
      const row = button.closest('tr');
      const duration = row.querySelector('input[name="duration"]').value;
      const amount = row.querySelector('input[name="amount"]').value;
      const studentId = row.querySelector('input[name="studentId"]').value;
      const appointmentId = row.querySelector('input[name="appointmentId"]').value;
      const cells = row.querySelectorAll('td');
      
      const data = {
        studentName: cells[0].innerText,
        date: cells[1].innerText,
        status: cells[2].innerText,
        duration: duration,
        amount: amount,
        studentId: studentId,
        appointmentId: appointmentId
      };
      console.log(data)

      fetch('/bills/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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