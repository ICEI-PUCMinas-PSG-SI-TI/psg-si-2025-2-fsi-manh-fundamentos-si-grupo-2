// Validação de login
const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const erro = document.getElementById("loginError");

    const encontrado = usuarios.find(u => u.username === user && u.password === pass);

    if (encontrado) {
      sessionStorage.setItem("usuarioLogado", JSON.stringify(encontrado));
      window.location.href = "dashboard.html";
    } else {
      erro.textContent = "Usuário ou senha inválidos!";
    }
  });
}

// Carregar nome do usuário 
if (window.location.pathname.includes("dashboard.html")) {
  const user = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  if (!user) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").textContent = user.nome;
  }
  

  // Tarefas
  const listaTarefas = document.getElementById("listaTarefas");

  function exibirTarefasProximas() {
    listaTarefas.innerHTML = "";

    const tarefas = JSON.parse(localStorage.getItem(chaveTarefas)) || [];
    if (tarefas.length === 0) {
      listaTarefas.innerHTML = "<li>Nenhuma tarefa cadastrada.</li>";
      return;
    }

    const hoje = new Date();
    const umaSemanaDepois = new Date();
    umaSemanaDepois.setDate(hoje.getDate() + 7);

    const tarefasProximas = tarefas.filter(t => {
      const dataTarefa = new Date(t.data);
      return dataTarefa >= hoje && dataTarefa <= umaSemanaDepois;
    });

    if (tarefasProximas.length === 0) {
      listaTarefas.innerHTML = "<li>Sem tarefas na próxima semana.</li>";
      return;
    }

    tarefasProximas.sort((a, b) => new Date(a.data) - new Date(b.data));

    tarefasProximas.forEach(t => {
      const li = document.createElement("li");
      li.innerHTML = `${t.descricao || t.texto} - <small>${t.data}</small>`;
      listaTarefas.appendChild(li);
    });
  }

  exibirTarefasProximas();
}

window.onload = function() {
  const email = sessionStorage.getItem('usuarioLogado');
  if (!email) {
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('userName').innerText = email;
};
