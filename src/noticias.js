document.addEventListener('DOMContentLoaded', function() {
    const modalElement = document.getElementById('modal-noticia');
    if (!modalElement) return; 
    
    const modalNoticia = new bootstrap.Modal(modalElement);
    
    const btnAdicionar = document.getElementById('btn-adicionar');
    const formNoticia = document.getElementById('form-noticia');
    const listaNoticias = document.getElementById('lista-noticias');
    const inputImagem = document.getElementById('imagem'); 
    let noticiasSalvas = JSON.parse(localStorage.getItem('noticias')) || [];

    function salvarNoticias() {
        localStorage.setItem('noticias', JSON.stringify(noticiasSalvas));
    }
    
    function excluirNoticia(id) {
        const index = noticiasSalvas.findIndex(noticia => noticia.id == id);
        
        if (index > -1 && confirm(`Tem certeza que deseja excluir a notícia "${noticiasSalvas[index].titulo}"?`)) {
            noticiasSalvas.splice(index, 1);
            salvarNoticias();
            renderizarNoticias();
        }
    }

    function fileToBase64(file) {
        return new Promise((resolve) => {
            if (!file) {
                resolve(null);
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve(null); 
        });
    }

    function criarNoticiaElemento(noticia) {
        const novaNoticia = document.createElement('div');
        novaNoticia.classList.add('noticia-item', 'col-md-4', 'col-lg-3'); 
        novaNoticia.setAttribute('data-id', noticia.id);
        
        let infoExpiracao = '';
        if (noticia.expiracao) {
            const dataExpiracao = new Date(noticia.expiracao);
            const hoje = new Date();
            
            if (hoje > dataExpiracao) {
                return null; 
            }
            
            const dataFormatada = dataExpiracao.toLocaleDateString('pt-BR');
            infoExpiracao = `<span class="noticia-expiracao">Expira em: ${dataFormatada}</span>`;
        }
        
        
        const imagemHtml = noticia.imagem ? `<img src="${noticia.imagem}" alt="${noticia.titulo}" class="noticia-imagem">` : '';

        novaNoticia.innerHTML = `
            <button class="btn-excluir" data-id="${noticia.id}">X Excluir</button>
            <h3 class="noticia-titulo">${noticia.titulo}</h3>
            ${imagemHtml}
            <p class="noticia-corpo">${noticia.corpo}</p>
            ${infoExpiracao}
        `;
        
        return novaNoticia;
    }

    function renderizarNoticias() {
        listaNoticias.innerHTML = '';
        const noticiasAtivas = [];

        noticiasSalvas.forEach(noticia => {
            const elemento = criarNoticiaElemento(noticia);
            if (elemento) {
                listaNoticias.appendChild(elemento);
                noticiasAtivas.push(noticia);
            }
        });
        
        noticiasSalvas = noticiasAtivas;
        salvarNoticias(); 
        
        document.querySelectorAll('.btn-excluir').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                excluirNoticia(id);
            });
        });
    }

    if (noticiasSalvas.length === 0) {
        noticiasSalvas = [
            { id: Date.now() + 1, titulo: "Atenção: Rodízio de Professores", corpo: "Confira a nova escala de rodízio de professores. Válido a partir de segunda-feira.", expiracao: null, imagem: null },
            { id: Date.now() + 2, titulo: "Feira de Ciências: Último Prazo", corpo: "O prazo para inscrição na Feira de Ciências foi estendido por 2 dias. Não perca!", expiracao: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), imagem: null }, 
            { id: Date.now() + 3, titulo: "Novas Matrículas Abertas", corpo: "As matrículas para o ano letivo de 2026 já estão abertas. Visite a secretaria para mais informações.", expiracao: null, imagem: null }
        ];
        salvarNoticias();
    }
    
    renderizarNoticias();

    
    btnAdicionar.onclick = function() {
        formNoticia.reset(); 
        modalNoticia.show(); 
    }

    formNoticia.addEventListener('submit', async function(e) {
        e.preventDefault();

        const imagemFile = inputImagem.files[0];
        
        const imagemBase64 = await fileToBase64(imagemFile); 

        const titulo = document.getElementById('titulo').value;
        const corpo = document.getElementById('corpo').value;
        const diasExpiracao = parseInt(document.getElementById('dias_expiracao').value); 

        let dataExpiracao = null;
        if (diasExpiracao > 0) {
            const dataAtual = new Date();
            dataAtual.setDate(dataAtual.getDate() + diasExpiracao);
            dataExpiracao = dataAtual.toISOString();
        }

        const novaNoticiaData = {
            id: Date.now(),
            titulo: titulo,
            corpo: corpo,
            expiracao: dataExpiracao,
            imagem: imagemBase64 
        };

        noticiasSalvas.unshift(novaNoticiaData);

        salvarNoticias();
        renderizarNoticias(); 

        modalNoticia.hide(); 
        formNoticia.reset();
        alert('Notícia "' + titulo + '" adicionada com sucesso!');
    });
});
