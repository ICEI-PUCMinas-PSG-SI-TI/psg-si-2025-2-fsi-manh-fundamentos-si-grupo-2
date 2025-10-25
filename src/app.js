
const btnCadastrar = document.getElementById("btnCadastrar");
const formulario = document.getElementById("formulario");

btnCadastrar.addEventListener("click", () => {
  formulario.style.display = formulario.style.display === "none" ? "block" : "none";
});


document.addEventListener("DOMContentLoaded", carregarMaterias);


document.getElementById("formMateria").addEventListener("submit", (e) => {
  e.preventDefault();

  const materia = document.getElementById("materia").value.trim();
  const dia = document.getElementById("dia").value;
  const horario = document.getElementById("horario").value;

  if (!materia || !dia || !horario) return alert("Preencha todos os campos!");

  const novaMateria = { materia, dia, horario };

  let materias = JSON.parse(localStorage.getItem("materias")) || [];

  
  const existe = materias.some(m => m.dia === dia && m.horario === horario);
  if (existe) return alert("Já existe uma matéria nesse horário!");

  materias.push(novaMateria);
  localStorage.setItem("materias", JSON.stringify(materias));

  document.getElementById("formMateria").reset();
  formulario.style.display = "none";
  carregarMaterias();
});


function carregarMaterias() {
  const materias = JSON.parse(localStorage.getItem("materias")) || [];

  document.querySelectorAll("#tabelaGrade td[data-dia]").forEach(td => td.innerHTML = "");

  materias.forEach((item, index) => {
    const linha = [...document.querySelectorAll("#tabelaGrade tbody tr")]
      .find(tr => tr.children[0].textContent === item.horario);

    if (linha) {
      const celula = linha.querySelector(`td[data-dia='${item.dia}']`);
      if (celula) {
        celula.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <span>${item.materia}</span>
            <button class="btn btn-sm btn-danger" onclick="excluirMateria(${index})">×</button>
          </div>
        `;
      }
    }
  });
}


function excluirMateria(index) {
  if (confirm("Deseja realmente excluir esta matéria?")) {
    let materias = JSON.parse(localStorage.getItem("materias")) || [];
    materias.splice(index, 1);
    localStorage.setItem("materias", JSON.stringify(materias));
    carregarMaterias();
  }
}

