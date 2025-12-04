// Obtém referências aos elementos do DOM
const btnCadastrar = document.getElementById('btnCadastrar');
const formulario = document.getElementById('formulario');
const formMateria = document.getElementById('formMateria');
const tabelaGrade = document.getElementById('tabelaGrade');

// Carrega dados do localStorage ao inicializar
let materias = JSON.parse(localStorage.getItem('materias')) || [];

// Abre/fecha o formulário
btnCadastrar.addEventListener('click', function() {
  formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
});

// Salva a matéria
formMateria.addEventListener('submit', function(e) {
  e.preventDefault();

  const materia = document.getElementById('materia').value.trim();
  const dia = document.getElementById('dia').value;
  const horario = document.getElementById('horario').value;

  if (!materia || !dia || !horario) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  // Cria um objeto com a matéria
  const novaMateria = {
    id: Date.now(),
    materia: materia,
    dia: dia,
    horario: horario
  };

  // Adiciona à lista
  materias.push(novaMateria);

  // Salva no localStorage
  localStorage.setItem('materias', JSON.stringify(materias));

  // Limpa o formulário
  formMateria.reset();
  formulario.style.display = 'none';

  // Atualiza a tabela
  atualizarTabelaGrade();

  alert('Matéria cadastrada com sucesso!');
});

// Atualiza a tabela com as matérias cadastradas
function atualizarTabelaGrade() {
  // Remove conteúdo anterior
  const tbody = tabelaGrade.querySelector('tbody');
  const rows = tbody.querySelectorAll('tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td[data-dia]');
    cells.forEach(cell => {
      cell.textContent = '';
      cell.innerHTML = '';
    });
  });

  // Adiciona matérias à tabela
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

// Inicializa a tabela ao carregar a página
atualizarTabelaGrade();
