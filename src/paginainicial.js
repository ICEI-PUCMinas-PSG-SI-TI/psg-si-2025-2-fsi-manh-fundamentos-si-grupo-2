
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    if (!user) {
        
        window.location.href = "index.html";
        return;
    }

    document.getElementById("userName").textContent = user.nome || user.username;
});
