let usuarioSalvo = sessionStorage.getItem("usuarioLogado");
let usuario;

try {
  usuario = JSON.parse(usuarioSalvo);
} catch {
  usuario = { username: usuarioSalvo };
}

if (!usuario || !usuario.username) {
  window.location.href = "login.html";
}

const chaveTarefas = `tarefas_${usuario.username}`;

const addTaskBtn = document.getElementById("addTaskBtn");
const modal = document.getElementById("modal");
const salvarTarefa = document.getElementById("salvarTarefa");
const cancelar = document.getElementById("cancelar");
const descricaoTarefa = document.getElementById("descricaoTarefa");
const dataTarefa = document.getElementById("dataTarefa");
const tarefasHoje = document.getElementById("tarefasHoje");
const todasTarefas = document.getElementById("todasTarefas");

let tarefaEditando = null; // Para controle de edição

addTaskBtn.onclick = () => {
  modal.style.display = "block";
  descricaoTarefa.value = "";
  dataTarefa.value = "";
  tarefaEditando = null;
};

cancelar.onclick = () => (modal.style.display = "none");

document.addEventListener("DOMContentLoaded", carregarTarefas);

salvarTarefa.onclick = () => {
  const descricao = descricaoTarefa.value.trim();
  const data = dataTarefa.value;

  if (!descricao || !data) {
    alert("Preencha a descrição e a data!");
    return;
  }

  const tarefas = JSON.parse(localStorage.getItem(chaveTarefas)) || [];

  if (tarefaEditando) {
    // Editando tarefa existente
    tarefaEditando.descricao = descricao;
    tarefaEditando.data = data;
  } else {
    // Criando nova tarefa
    const tarefa = {
      id: Date.now(),
      descricao,
      data,
      concluida: false,
    };
    tarefas.push(tarefa);
  }

  localStorage.setItem(chaveTarefas, JSON.stringify(tarefas));
  modal.style.display = "none";
  carregarTarefas();
};

function carregarTarefas() {
  const tarefas = JSON.parse(localStorage.getItem(chaveTarefas)) || [];
  const hoje = new Date().toISOString().split("T")[0];

  tarefasHoje.innerHTML = "";
  todasTarefas.innerHTML = "";

  tarefas.forEach(tarefa => {
    // Criar elemento de tarefa
    const li = document.createElement("li");
    li.textContent = `${tarefa.descricao} (${tarefa.data})`;

    if (tarefa.concluida) {
      li.classList.add("concluida");
    }

    // Botão de concluir
    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✔";
    doneBtn.classList.add("doneBtn");
    doneBtn.onclick = () => {
      tarefa.concluida = !tarefa.concluida;
      localStorage.setItem(chaveTarefas, JSON.stringify(tarefas));
      carregarTarefas();
    };

    // Botão de editar
    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.classList.add("editBtn");
    editBtn.onclick = () => {
      tarefaEditando = tarefa;
      descricaoTarefa.value = tarefa.descricao;
      dataTarefa.value = tarefa.data;
      modal.style.display = "block";
    };

    li.appendChild(editBtn);
    li.appendChild(doneBtn);

    todasTarefas.appendChild(li);

    if (tarefa.data === hoje) {
      const liHoje = li.cloneNode(true);
      // Precisa adicionar eventos novamente para o clone
      const editBtnClone = liHoje.querySelector(".editBtn");
      const doneBtnClone = liHoje.querySelector(".doneBtn");

      editBtnClone.onclick = () => {
        tarefaEditando = tarefa;
        descricaoTarefa.value = tarefa.descricao;
        dataTarefa.value = tarefa.data;
        modal.style.display = "block";
      };
      doneBtnClone.onclick = () => {
        tarefa.concluida = !tarefa.concluida;
        localStorage.setItem(chaveTarefas, JSON.stringify(tarefas));
        carregarTarefas();
      };

      tarefasHoje.appendChild(liHoje);
    }
  });

  localStorage.setItem(chaveTarefas, JSON.stringify(tarefas));
}
