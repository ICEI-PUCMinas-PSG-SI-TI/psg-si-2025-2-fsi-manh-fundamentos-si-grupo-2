

document.addEventListener("input", function (e) {
  const target = e.target;

  
  if (target.type === "text" && target.previousElementSibling?.innerText.includes("CPF")) {
    let value = target.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    target.value = value;
  }

  
  if (target.type === "text" && target.previousElementSibling?.innerText.includes("Telefone")) {
    let value = target.value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");
    target.value = value;
  }

  
  if (target.type === "text" && target.previousElementSibling?.innerText.includes("CEP")) {
    let value = target.value.replace(/\D/g, "");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    target.value = value.slice(0, 9);
  }

  
  if (target.type === "text" && target.previousElementSibling?.innerText.includes("nascimento")) {
    let value = target.value.replace(/\D/g, "");
    if (value.length > 2 && value.length <= 4) {
      value = value.replace(/(\d{2})(\d+)/, "$1/$2");
    } else if (value.length > 4) {
      value = value.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
    }
    target.value = value.slice(0, 10);
  }
});


document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const inputs = document.querySelectorAll("input, select, textarea");
  const matricula = {};

  inputs.forEach((input, index) => {
  const key = input.name || input.id || 'campo_${index}';
  
  if (input.type === "file") {
    matricula[key] = input.files.length > 0 ? input.files[0].name : "Nenhum arquivo enviado";
  } else if (input.type === "checkbox") {
    matricula[key] = input.checked ? "Sim" : "Não";
  } else {
    matricula[key] = input.value;
  }
});


  
  const matriculasSalvas = JSON.parse(localStorage.getItem("matriculas")) || [];

  
  matriculasSalvas.push(matricula);

  
  localStorage.setItem("matriculas", JSON.stringify(matriculasSalvas));

  alert("✅ Matrícula salva com sucesso!");
  document.querySelector("form").reset();
});