
function carregarMatriculas() {
  const tabela = document.getElementById("tabelaMatriculas");
  tabela.innerHTML = ""; 

  const matriculas = JSON.parse(localStorage.getItem("matriculas")) || [];

  if (matriculas.length === 0) {
    tabela.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Nenhuma matrícula cadastrada.</td></tr>';
    return;
  }

  matriculas.forEach((matricula, index) => {
    const nomeAluno = matricula["nomeAluno"] || "—";
    const nascimento = matricula["nascimentoAluno"] || "—";
    const responsavel = matricula["nomeResponsavel"] || "—";
    const telefone = matricula["telefoneResponsavel"] || "—";
    const email = matricula["emailResponsavel"] || "—";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${nomeAluno}</td>
      <td>${nascimento}</td>
      <td>${responsavel}</td>
      <td>${telefone}</td>
      <td>${email}</td>
      <td class="text-center">
       <button class="btn btn-info btn-sm" onclick="verMais(${index})">Ver mais</button>
        <button class="btn btn-danger btn-sm" onclick="excluirMatricula(${index})">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}


function verMais(index) {
  const matriculas = JSON.parse(localStorage.getItem("matriculas")) || [];
  const matricula = matriculas[index];

  // Monta os detalhes em duas colunas
  let detalhes = `
    <div class="row">
      <div class="col-md-6">
        <h5 class="text-primary">Dados do Aluno</h5>
        <ul class="list-group mb-3">
          <li class="list-group-item"><strong>Nome:</strong> ${matricula["nomeAluno"] || "—"}</li>
          <li class="list-group-item"><strong>Data de Nascimento:</strong> ${matricula["nascimentoAluno"] || "—"}</li>
          <li class="list-group-item"><strong>Gênero:</strong> ${matricula["generoAluno"] || "—"}</li>
          <li class="list-group-item"><strong>RG / Certidão:</strong> ${matricula["rgAluno"] || "—"}</li>
          <li class="list-group-item"><strong>Nacionalidade:</strong> ${matricula["nacionalidadeAluno"] || "—"}</li>
          <li class="list-group-item"><strong>Endereço:</strong> ${matricula["enderecoAluno"] || "—"}</li>
          <li class="list-group-item"><strong>CEP:</strong> ${matricula["cepAluno"] || "—"}</li>
          <li class="list-group-item"><strong>Série/Ano:</strong> ${matricula["serieAluno"] || "—"}</li>
          <li class="list-group-item"><strong>Turno:</strong> ${matricula["turnoAluno"] || "—"}</li>
          <li class="list-group-item"><strong>Necessidades Especiais:</strong> ${matricula["necessidadesAluno"] || "—"}</li>
        </ul>
      </div>

      <div class="col-md-6">
        <h5 class="text-primary">Dados do Responsável</h5>
        <ul class="list-group mb-3">
          <li class="list-group-item"><strong>Nome:</strong> ${matricula["nomeResponsavel"] || "—"}</li>
          <li class="list-group-item"><strong>Parentesco:</strong> ${matricula["parentescoResponsavel"] || "—"}</li>
          <li class="list-group-item"><strong>CPF:</strong> ${matricula["cpfResponsavel"] || "—"}</li>
          <li class="list-group-item"><strong>RG:</strong> ${matricula["rgResponsavel"] || "—"}</li>
          <li class="list-group-item"><strong>Data de Nascimento:</strong> ${matricula["nascimentoResponsavel"] || "—"}</li>
          <li class="list-group-item"><strong>Profissão:</strong> ${matricula["profissaoResponsavel"] || "—"}</li>
          <li class="list-group-item"><strong>Telefone:</strong> ${matricula["telefoneResponsavel"] || "—"}</li>
          <li class="list-group-item"><strong>E-mail:</strong> ${matricula["emailResponsavel"] || "—"}</li>
        </ul>
      </div>
    </div>
  `;

  document.getElementById("detalhesMatricula").innerHTML = detalhes;

  const modal = new bootstrap.Modal(document.getElementById("modalVerMais"));
  modal.show();
}



function excluirMatricula(index) {
  const confirmar = confirm("Tem certeza que deseja excluir esta matrícula?");
  if (!confirmar) return;

  const matriculas = JSON.parse(localStorage.getItem("matriculas")) || [];
  matriculas.splice(index, 1);
  localStorage.setItem("matriculas", JSON.stringify(matriculas));

  carregarMatriculas();
}


document.addEventListener("DOMContentLoaded", carregarMatriculas);