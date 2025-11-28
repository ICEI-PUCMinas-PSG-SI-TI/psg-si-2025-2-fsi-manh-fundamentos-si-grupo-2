document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value.trim();
  const mensagem = document.getElementById('mensagem');

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    mensagem.innerText = 'Nenhum usuário cadastrado!';
    return;
  }

  if (usuario.email !== email) {
    mensagem.innerText = 'Email não cadastrado!';
    return;
  }

  if (usuario.senha !== senha) {
    mensagem.innerText = 'Senha incorreta!';
    return;
  }

  sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));

  mensagem.innerText = 'Login realizado com sucesso! Redirecionando...';

  setTimeout(() => {
    window.location.href = 'paginainicial.html';
  }, 1500);
});