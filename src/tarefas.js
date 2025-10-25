// Seletores
const addTaskBtn = document.getElementById("addTaskBtn");
const modal = document.getElementById("modal");
const salvarTarefa = document.getElementById("salvarTarefa");
const cancelar = document.getElementById("cancelar");
const descricaoTarefa = document.getElementById("descricaoTarefa");
const dataTarefa = document.getElementById("dataTarefa");
const tarefasHoje = document.getElementById("tarefasHoje");
const todasTarefas = document.getElementById("todasTarefas");

// Pegar usuário logado
const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));
if (!usuario) {
  window.location.href = "index.html";
}
const chaveTarefas = `tarefas_${usuario.username}`;

// Abrir modal
addTaskBtn.onclick = () => (modal.style.display = "block");
// Fechar modal
cancelar.onclick = () => (modal.style.display = "none");

// Carregar tarefas
document.addEventListener("DOMContentLoaded", carregarTarefas);

// Salvar tarefa
salvarTarefa.onclick = () => {
  const descricao = descricaoTarefa.value.trim();
  const data = dataTarefa.value;

  if (!descricao || !data) {
    alert("Preencha a descrição e a data!");
    return;
  }

  const tarefa = {
    id: Date.now(),
    descricao,
    data,
    concluida: false,
  };

  const tarefas = JSON.parse(localStorage.getItem(chaveTarefas)) || [];
  tarefas.push(tarefa);
  localStorage.setItem(chaveTarefas, JSON.stringify(tarefas));

  descricaoTarefa.value = "";
  dataTarefa.value = "";
  modal.style.display = "none";
  carregarTarefas();
};

// Função para carregar e exibir tarefas
function carregarTarefas() {
  const tarefas = JSON.parse(localStorage.getItem(chaveTarefas)) || [];
  const hoje = new Date().toISOString().split("T")[0];

  tarefasHoje.innerHTML = "";
  todasTarefas.innerHTML = "";

  tarefas.forEach(tarefa => {
    const li = document.createElement("li");
    li.textContent = `${tarefa.descricao} (${tarefa.data})`;

    // Verifica se passou da data
    if (tarefa.data < hoje) {
      tarefa.concluida = true;
    }

    if (tarefa.concluida) {
      li.classList.add("concluida");
    }

    // Clicar para marcar como concluída manualmente
    li.addEventListener("click", () => {
      tarefa.concluida = !tarefa.concluida;
      localStorage.setItem(chaveTarefas, JSON.stringify(tarefas));
      carregarTarefas();
    });

    todasTarefas.appendChild(li);

    // Mostra as de hoje
    if (tarefa.data === hoje) {
      const liHoje = li.cloneNode(true);
      tarefasHoje.appendChild(liHoje);
    }
  });

  // Atualiza o localStorage (caso alguma tarefa tenha vencido)
  localStorage.setItem(chaveTarefas, JSON.stringify(tarefas));
}
