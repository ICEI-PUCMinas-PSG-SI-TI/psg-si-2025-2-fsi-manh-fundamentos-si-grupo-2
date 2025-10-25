

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
//Tarefas//
  if (window.location.pathname.includes("dashboard.html")) {
  const user = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  if (!user) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").textContent = user.nome;
  }

  const chaveTarefas = `tarefas_${user.username}`;
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
}