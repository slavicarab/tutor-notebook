document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  const aspect = window.innerWidth < 600 ? 0.7 : 1.35;
  const calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'addStudent addAppointment'
    },
    customButtons: {
      addStudent: {
        text: 'Add a Student',
        click: function() {
          window.location.href = '/students/new';
        }
      },
      addAppointment: {
        text: 'Add an Appointment',
        click: function() {
          window.location.href = '/newppoint/new';
        }
      }
    },
    initialView: 'dayGridMonth',
    aspectRatio: aspect,
    events: appointments,
  });
  calendar.render();
});
