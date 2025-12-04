document.getElementById('cadastroForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('cadastroEmail').value.trim();
  const senha = document.getElementById('cadastroSenha').value.trim();
  const mensagem = document.getElementById('mensagem');

  if (!email.includes('@')) {
    mensagem.innerText = 'Email inválido!';
    return;
  }
  if (senha.length < 6) {
    mensagem.innerText = 'A senha deve ter pelo menos 6 caracteres!';
    return;
  }


  const usuarioExistente = JSON.parse(localStorage.getItem('usuario'));
  if (usuarioExistente && usuarioExistente.email === email) {
    mensagem.innerText = 'Este email já está cadastrado!';
    return;
  }

  localStorage.setItem('usuario', JSON.stringify({ email, senha }));
  mensagem.innerText = 'Cadastro realizado com sucesso! Redirecionando para login...';

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
});