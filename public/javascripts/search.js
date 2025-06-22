document.getElementById('searchInput').addEventListener('input', function (e) {
  const query = e.target.value;

  
  fetch('/api/search?q=' + encodeURIComponent(query), { credentials: 'same-origin' })
    .then(res => res.json())
    .then(data => {
      const students = data;
      console.log(students);

      const list = document.getElementById('studentList');
      list.innerHTML = '';

      if (students.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No students found';
        li.style.listStyle = 'none';
        li.style.marginTop = '5px';
        li.style.color = 'gray';
        li.style.fontStyle = 'italic';
        list.appendChild(li);
      } else {
        students.forEach(student => {
          const li = document.createElement('li');
          li.style.listStyle = 'none'; 
          li.style.marginTop = '1rem';
          


          const a = document.createElement('a');
          a.href = `/students/${student._id}`;
          
          // Capitalize first letter of first and last name
          const firstName = student.name.first.charAt(0).toUpperCase() + student.name.first.slice(1);
          const lastName = student.name.last.charAt(0).toUpperCase() + student.name.last.slice(1);
          a.textContent = firstName + ' ' + lastName;

          a.style.textDecoration = 'none'; 
          a.style.color = 'black' 
         

          li.appendChild(a);
          list.appendChild(li);
        });
      }
    })
    .catch(err => console.error(err));
});

