
const professoraLogada = sessionStorage.getItem("usuarioLogado");
if (!professoraLogada) {
  alert("Você precisa estar logada para acessar as turmas.");
  window.location.href = "index.html";
}



const containerTurmas = document.getElementById("containerTurmas");
const tabelaBody = document.querySelector("#tabelaTurmas tbody");
const btnNovaTurma = document.getElementById("btnNovaTurma");
const modalTurma = document.getElementById("modalTurma");
const salvarTurma = document.getElementById("salvarTurma");
const cancelarTurma = document.getElementById("cancelarTurma");
const modalAlunos = document.getElementById("modalAlunos");
const listaAlunos = document.getElementById("listaAlunos");
const nomeAlunoInput = document.getElementById("nomeAluno");
const adicionarAluno = document.getElementById("adicionarAluno");
const fecharAlunos = document.getElementById("fecharAlunos");
const modalTurmaTitulo = document.getElementById("modalTurmaTitulo");


let turmas = JSON.parse(localStorage.getItem(`turmas_${professoraLogada}`)) || [];


let turmaAtual = null;           
let turmaEditandoIndex = null;   


function renderizarCards() {
  containerTurmas.innerHTML = "";
  turmas.forEach((turma, index) => {
    const colorClass = `color-${(index % 6) + 1}`;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header ${colorClass}">
        <div style="flex:1">${turma.disciplina}</div>
        <div style="margin-left:8px">
          <button title="Editar turma" onclick="editarTurma(${index})">✎</button>
        </div>
      </div>
      <div class="card-body">
        <h5>${turma.nome}</h5>
        <p>${turma.periodo}</p>
        <p>${turma.alunos.length} aluno(s)</p>
      </div>
      <div class="card-footer">
        <div>
          <button onclick="abrirAlunos(${index})">👩‍🎓 Alunos</button>
        </div>
        <div>
          <button onclick="removerTurma(${index})">🗑️</button>
        </div>
      </div>
    `;
    containerTurmas.appendChild(card);
  });
}

function renderizarTabela() {
  tabelaBody.innerHTML = "";
  turmas.forEach((turma, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${turma.disciplina}</td>
      <td>${turma.nome}</td>
      <td>${turma.periodo}</td>
      <td>${turma.alunos.length}</td>
      <td>
        <button class="btn-custom" onclick="abrirAlunos(${index})">Alunos</button>
        <button class="btn-custom" onclick="editarTurma(${index})">Editar</button>
        <button class="btn-cancelar" onclick="removerTurma(${index})">Remover</button>
      </td>
    `;
    tabelaBody.appendChild(tr);
  });
}

function atualizarTela() {
  renderizarCards();
  renderizarTabela();
}
atualizarTela();

function salvarLocal() {
  localStorage.setItem(`turmas_${professoraLogada}`, JSON.stringify(turmas));
}


btnNovaTurma.onclick = () => {
  turmaEditandoIndex = null;
  modalTurmaTitulo.textContent = "Nova Turma";
  document.getElementById("disciplina").value = "";
  document.getElementById("turma").value = "";
  document.getElementById("periodo").value = "";
  modalTurma.style.display = "block";
};

cancelarTurma.onclick = () => {
  modalTurma.style.display = "none";
};

salvarTurma.onclick = () => {
  const disciplina = document.getElementById("disciplina").value.trim();
  const nome = document.getElementById("turma").value.trim();
  const periodo = document.getElementById("periodo").value.trim();

  if (!disciplina || !nome || !periodo) {
    alert("Preencha todos os campos!");
    return;
  }

  if (turmaEditandoIndex === null) {
  
    turmas.push({ disciplina, nome, periodo, alunos: [] });
  } else {
   
    turmas[turmaEditandoIndex].disciplina = disciplina;
    turmas[turmaEditandoIndex].nome = nome;
    turmas[turmaEditandoIndex].periodo = periodo;
  }

  salvarLocal();
  modalTurma.style.display = "none";
  atualizarTela();
};


function editarTurma(index) {
  turmaEditandoIndex = index;
  const t = turmas[index];
  modalTurmaTitulo.textContent = "Editar Turma";
  document.getElementById("disciplina").value = t.disciplina;
  document.getElementById("turma").value = t.nome;
  document.getElementById("periodo").value = t.periodo;
  modalTurma.style.display = "block";
}


function removerTurma(index) {
  if (!confirm("Deseja remover esta turma?")) return;
  turmas.splice(index, 1);
  salvarLocal();
  atualizarTela();
}


window.editarTurma = editarTurma;
window.removerTurma = removerTurma;


function abrirAlunos(index) {
  turmaAtual = index;
  const turma = turmas[index];
  document.getElementById("nomeTurmaModal").textContent = turma.nome;
  nomeAlunoInput.value = "";
  montarListaAlunos();
  modalAlunos.style.display = "block";
}


function montarListaAlunos() {
  const turma = turmas[turmaAtual];
  listaAlunos.innerHTML = "";

  if (!turma || !turma.alunos) return;

  turma.alunos.forEach((aluno, i) => {
    const li = document.createElement("li");

    
    const span = document.createElement("span");
    span.textContent = aluno;
    span.id = `aluno-nome-${i}`;

   
    const acoes = document.createElement("div");
    acoes.className = "aluno-acoes";

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "✎";
    btnEditar.title = "Editar aluno";
    btnEditar.onclick = () => iniciarEditarAluno(i);

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "🗑️";
    btnExcluir.title = "Remover aluno";
    btnExcluir.onclick = () => removerAluno(i);

    acoes.appendChild(btnEditar);
    acoes.appendChild(btnExcluir);

    li.appendChild(span);
    li.appendChild(acoes);
    listaAlunos.appendChild(li);
  });
}


adicionarAluno.onclick = () => {
  const nome = nomeAlunoInput.value.trim();
  if (!nome) return;
  turmas[turmaAtual].alunos.push(nome);
  nomeAlunoInput.value = "";
  salvarLocal();
  montarListaAlunos();
  atualizarTela();
};


function iniciarEditarAluno(i) {
  const li = listaAlunos.children[i];
  if (!li) return;
  li.innerHTML = ""; 

  const input = document.createElement("input");
  input.value = turmas[turmaAtual].alunos[i];
  input.style.width = "60%";

  const salvarBtn = document.createElement("button");
  salvarBtn.textContent = "Salvar";
  salvarBtn.className = "btn-custom";
  salvarBtn.onclick = () => salvarEdicaoAluno(i, input.value.trim());

  const cancelarBtn = document.createElement("button");
  cancelarBtn.textContent = "Cancelar";
  cancelarBtn.className = "btn-cancelar";
  cancelarBtn.onclick = () => montarListaAlunos();

  li.appendChild(input);
  li.appendChild(salvarBtn);
  li.appendChild(cancelarBtn);
}


function salvarEdicaoAluno(i, novoNome) {
  if (!novoNome) {
    alert("Nome inválido.");
    return;
  }
  turmas[turmaAtual].alunos[i] = novoNome;
  salvarLocal();
  montarListaAlunos();
  atualizarTela();
}


function removerAluno(i) {
  if (!confirm("Remover este aluno?")) return;
  turmas[turmaAtual].alunos.splice(i, 1);
  salvarLocal();
  montarListaAlunos();
  atualizarTela();
}


window.abrirAlunos = abrirAlunos;
window.removerAluno = removerAluno;


fecharAlunos.onclick = () => (modalAlunos.style.display = "none");




window.onclick = (e) => {
  if (e.target === modalTurma) modalTurma.style.display = "none";
  if (e.target === modalAlunos) modalAlunos.style.display = "none";
};
