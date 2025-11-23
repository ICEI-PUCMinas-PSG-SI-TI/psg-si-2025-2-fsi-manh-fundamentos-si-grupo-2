// Carregar nome do usuário na página inicial
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    if (!user) {
        // Se não estiver logado, volta para a página de login
        window.location.href = "index.html";
        return;
    }

    // Exibir o nome
    // Caso o objeto não tenha "nome", usa "username" como alternativa
    document.getElementById("userName").textContent = user.nome || user.username;
});
