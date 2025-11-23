// ------------------------------------------
// GET E SET LOCALSTORAGE
// ------------------------------------------
function getTarefas() {
    return JSON.parse(localStorage.getItem("tarefas")) || [];
}

function salvarTarefas(tarefas) {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// ------------------------------------------
// OBTÉM USUÁRIO ATUAL (EMAIL DO LOGIN OU INPUT)
// ------------------------------------------
function getUsuarioAtual() {
    let usuario = "";

    // 1 — TENTA PEGAR DO LOGIN
    const storedLogin = sessionStorage.getItem("usuarioLogado");
    if (storedLogin) {
        const userObj = JSON.parse(storedLogin);

        // LOGIN SALVA COMO {email: "..."}
        usuario =
            userObj.email ||     // formato correto
            userObj.username ||  // fallback
            userObj.nome ||      // fallback
            (typeof userObj === "string" ? userObj : "");
    }

    // 2 — SE EXISTIR INPUT USUARIO → USA E SALVA
    const usuarioInput = document.getElementById("usuario");
    if (usuarioInput && usuarioInput.value.trim() !== "") {
        usuario = usuarioInput.value.trim();
        localStorage.setItem("ultimoUsuario", usuario);
    }

    // 3 — SE DER F5 → RECUPERA O ÚLTIMO USUÁRIO
    if (!usuario) {
        usuario = localStorage.getItem("ultimoUsuario") || "";
        if (usuarioInput) usuarioInput.value = usuario;
    }

    return usuario;
}

// ------------------------------------------
// ADICIONAR TAREFA
// ------------------------------------------
function addTarefa() {
    const usuario = getUsuarioAtual();
    const texto = document.getElementById("tarefaTexto").value.trim();
    const data = document.getElementById("tarefaData").value;

    if (!usuario || !texto || !data) {
        alert("Preencha usuário, descrição e data!");
        return;
    }

    const tarefas = getTarefas();

    tarefas.push({
        id: Date.now(),
        usuario,  // <-- agora é o email
        texto,
        data,
        concluida: false
    });

    salvarTarefas(tarefas);
    renderTarefas();

    document.getElementById("tarefaTexto").value = "";
    document.getElementById("tarefaData").value = "";
}

// ------------------------------------------
// CONCLUIR
// ------------------------------------------
function concluirTarefa(id) {
    const tarefas = getTarefas();
    const t = tarefas.find(t => t.id === id);
    t.concluida = !t.concluida;
    salvarTarefas(tarefas);
    renderTarefas();
}

// ------------------------------------------
// EDITAR
// ------------------------------------------
function editarTarefa(id) {
    const novoTexto = prompt("Nova descrição:");
    if (!novoTexto) return;

    const tarefas = getTarefas();
    const t = tarefas.find(t => t.id === id);
    t.texto = novoTexto;

    salvarTarefas(tarefas);
    renderTarefas();
}

// ------------------------------------------
// EXCLUIR
// ------------------------------------------
function excluirTarefa(id) {
    const tarefas = getTarefas().filter(t => t.id !== id);
    salvarTarefas(tarefas);
    renderTarefas();
}

// ------------------------------------------
// RENDERIZAR
// ------------------------------------------
function renderTarefas() {
    const usuario = getUsuarioAtual();
    if (!usuario) return;

    const hoje = new Date().toISOString().split("T")[0];
    let tarefas = getTarefas().filter(t => t.usuario === usuario);

    tarefas.sort((a, b) => new Date(a.data) - new Date(b.data));

    const lista = document.getElementById("listaTarefas");
    lista.innerHTML = "";

    tarefas.forEach(t => {
        let classeHoje = t.data === hoje ? "tarefa-hoje" : "";
        let classeConcluida = t.concluida ? "concluida" : "";

        lista.innerHTML += `
            <div class="card p-3 mb-2 ${classeHoje}">
                <h5 class="${classeConcluida}">${t.texto}</h5>
                <p>Data: <b>${t.data}</b></p>

                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-success rounded-pill" onclick="concluirTarefa(${t.id})">✔</button>
                    <button class="btn btn-sm btn-outline-warning rounded-pill" onclick="editarTarefa(${t.id})">✎</button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="excluirTarefa(${t.id})">🗑</button>
                </div>
            </div>
        `;
    });
}

// ------------------------------------------
// ATUALIZA AO DIGITAR USUÁRIO (para quem não tem login)
// ------------------------------------------
const usuarioInput = document.getElementById("usuario");
if (usuarioInput) {
    usuarioInput.addEventListener("input", renderTarefas);
}
