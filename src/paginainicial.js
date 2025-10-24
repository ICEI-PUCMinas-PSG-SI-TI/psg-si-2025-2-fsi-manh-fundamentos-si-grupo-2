// Simulação de usuários (você pode trocar por uma API depois)
const usuarios = [
  { username: "prof.julia", password: "12345", nome: "Prof. Julia" },
  { username: "prof.mario", password: "abcde", nome: "Prof. Mário" }
];

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

// Carregar nome do usuário na dashboard e funcionalidades associadas
if (window.location.pathname.includes("dashboard.html")) {
  const user = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  if (!user) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").textContent = user.nome;
  }

  // Inicializar dados de exemplo no localStorage (se não existir)
  const chaveTurmas = `turmas_${user.username}`;
  const chaveTarefas = `tarefas_${user.username}`;

  if (!localStorage.getItem(chaveTurmas)) {
    localStorage.setItem(chaveTurmas, JSON.stringify([
      { nome: "Turma A", frequencia: 85 },
      { nome: "Turma B", frequencia: 90 },
      { nome: "Turma C", frequencia: 78 },
      { nome: "Turma D", frequencia: 92 }
    ]));
  }

  if (!localStorage.getItem(chaveTarefas)) {
    localStorage.setItem(chaveTarefas, JSON.stringify([
      { texto: "Preparar aula de matemática", data: "2023-10-15" },
      { texto: "Corrigir provas", data: "2023-10-16" },
      { texto: "Reunião com pais", data: "2023-10-17" }
    ]));
  }

  // Gráfico dinâmico (carregado do localStorage)
  const ctx = document.getElementById("chartTurmas");
  if (ctx) {
    // Carregar turmas do localStorage
    let turmas = JSON.parse(localStorage.getItem(chaveTurmas)) || [];

    if (turmas.length === 0) {
      // Se não houver turmas, mostrar mensagem
      ctx.parentElement.innerHTML = "<p>Nenhuma turma cadastrada. Adicione turmas em outra página.</p>";
    } else {
      // Preparar dados para o gráfico
      const labels = turmas.map(t => t.nome);
      const data = turmas.map(t => t.frequencia);
      const backgroundColors = turmas.map((_, index) => {
        const colors = ["#003366", "#004080", "#336699", "#6699CC"];
        return colors[index % colors.length];
      });

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Média de Frequência",
            data: data,
            backgroundColor: backgroundColors
          }]
        }
      });
    }
  }

  // -------------------- SISTEMA DE TAREFAS --------------------
  const listaTarefas = document.getElementById("listaTarefas");
  const formTarefa = document.getElementById("formTarefa");

  // Carregar tarefas do localStorage
  let tarefas = JSON.parse(localStorage.getItem(chaveTarefas)) || [];

  function exibirTarefas() {
    listaTarefas.innerHTML = "";
    if (tarefas.length === 0) {
      listaTarefas.innerHTML = "<li>Nenhuma tarefa cadastrada.</li>";
      return;
    }

    tarefas.forEach((t, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${t.texto} - <small>${t.data}</small></span>
        <button onclick="removerTarefa(${index})">Excluir</button>
      `;
      listaTarefas.appendChild(li);
    });
  }

  // Adicionar tarefa (se houver formulário na dashboard)
  if (formTarefa) {
    formTarefa.addEventListener("submit", (e) => {
      e.preventDefault();
      const texto = document.getElementById("novaTarefa").value;
      const data = document.getElementById("dataTarefa").value;

      if (texto.trim() === "" || !data) return;

      tarefas.push({ texto, data });
      localStorage.setItem(chaveTarefas, JSON.stringify(tarefas));
      formTarefa.reset();
      exibirTarefas();
    });
  }

  // Remover tarefa
  window.removerTarefa = (index) => {
    tarefas.splice(index, 1);
    localStorage.setItem(chaveTarefas, JSON.stringify(tarefas));
    exibirTarefas();
  };

  // Exibir ao carregar
  exibirTarefas();
}

window.onload = function() {
  const email = sessionStorage.getItem('usuarioLogado');
  if (!email) {
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('userName').innerText = email;
};