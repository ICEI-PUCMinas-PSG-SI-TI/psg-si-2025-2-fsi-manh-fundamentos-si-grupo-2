
const btnCadastrar = document.getElementById('btnCadastrar');
const formulario = document.getElementById('formulario');
const formMateria = document.getElementById('formMateria');
const tabelaGrade = document.getElementById('tabelaGrade');

let materias = JSON.parse(localStorage.getItem('materias')) || [];


btnCadastrar.addEventListener('click', function() {
  formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
});


formMateria.addEventListener('submit', function(e) {
  e.preventDefault();

  const materia = document.getElementById('materia').value.trim();
  const dia = document.getElementById('dia').value;
  const horario = document.getElementById('horario').value;

  if (!materia || !dia || !horario) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  
  const novaMateria = {
    id: Date.now(),
    materia: materia,
    dia: dia,
    horario: horario
  };


  materias.push(novaMateria);

  localStorage.setItem('materias', JSON.stringify(materias));

  formMateria.reset();
  formulario.style.display = 'none';


  atualizarTabelaGrade();

  alert('Matéria cadastrada com sucesso!');
});


function atualizarTabelaGrade() {
  
  const tbody = tabelaGrade.querySelector('tbody');
  const rows = tbody.querySelectorAll('tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td[data-dia]');
    cells.forEach(cell => {
      cell.textContent = '';
      cell.innerHTML = '';
    });
  });

 
  materias.forEach(mat => {
    const horarioRow = Array.from(rows).find(row => {
      return row.querySelector('td').textContent === mat.horario;
    });

    if (horarioRow) {
      const cellDia = horarioRow.querySelector(`td[data-dia="${mat.dia}"]`);
      if (cellDia) {
        cellDia.textContent = mat.materia;
        cellDia.style.backgroundColor = '#d4edda';
      }
    }
  });
}


atualizarTabelaGrade();
