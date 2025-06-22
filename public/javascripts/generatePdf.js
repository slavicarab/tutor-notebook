document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.send-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      const row = button.closest('tr');
      const cells = row.querySelectorAll('td');
         

      const billData = {
        billNumber: cells[0].innerText, 
        studentName: cells[1].innerText, 
        studentEmail:cells[2].innerText, 
        date: cells[3].innerText, 
        duration: cells[5].innerText, 
        amount: cells[6].innerText, 
       
      };

      fetch('/bills/generate-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(billData)
      })
      .then(response => response.json())
      .then(result => {

         if (result.file) {
          const link = document.createElement('a');
          link.href = result.file;
          link.download = `bill_${billData.billNumber}.pdf`; 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert('PDF generation succeeded, but file path is missing.');
        }
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
        alert('❌ Failed to generate PDF.');
      });
    });
  });
});
