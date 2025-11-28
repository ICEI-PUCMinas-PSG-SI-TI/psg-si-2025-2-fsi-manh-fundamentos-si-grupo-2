document.addEventListener('DOMContentLoaded', function() {
    const listaEventosContainer = document.getElementById('lista-eventos');
    const loadingMessage = document.getElementById('loadingMessage');
    const filtroDataInput = document.getElementById('filtroData');
    
    
    const formatarData = (dataStr) => {
        const data = new Date(dataStr);
        
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        return { dia, mes, ano: data.getFullYear() };
    };

    
    function getNoticias() {
        const noticiasSalvas = JSON.parse(localStorage.getItem('noticias')) || [];
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return noticiasSalvas
            .map(n => {
                let dataEvento = n.expiracao ? new Date(n.expiracao) : new Date(n.id); 
                dataEvento.setDate(dataEvento.getDate() + 1); 

                if (n.expiracao) {
                    
                    if (new Date(n.expiracao) < hoje) return null;
                }
                
            
                return {
                    data: dataEvento.toISOString().split('T')[0],
                    titulo: n.titulo,
                    descricao: n.corpo.substring(0, 70) + '...',
                    tipo: 'Notícia',
                    classe: 'tipo-noticia'
                };
            })
            .filter(n => n !== null);
    }
    
 
    function getTarefasEProvas() {
        const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas_dia_v1') || localStorage.getItem('tarefas') || '[]');
        
        return tarefasSalvas
            .filter(t => !t.concluida) 
            .map(t => ({
                data: t.date || t.data, 
                titulo: `PROVA/TAREFA: ${t.text}`,
                descricao: `Item de avaliação/estudo.`,
                tipo: 'Prova/Tarefa',
                classe: 'tipo-prova'
            }));
    }
    
    function getEventosSecretaria() {
        
        return [
            { data: '2025-11-28', titulo: 'Reunião de Pais e Mestres', descricao: 'Presença obrigatória. Tópicos: Boletos e Rematrículas.', tipo: 'Evento Secretaria', classe: 'tipo-secretaria' },
            { data: '2025-12-15', titulo: 'Recesso Escolar - Início', descricao: 'Início do recesso de fim de ano.', tipo: 'Evento Secretaria', classe: 'tipo-secretaria' },
            { data: '2026-01-20', titulo: 'Retorno dos Professores', descricao: 'Planejamento para o ano letivo de 2026.', tipo: 'Evento Secretaria', classe: 'tipo-secretaria' }
        ];
    }
    
    function renderizarCalendario(dataFiltro = null) {
        loadingMessage.style.display = 'block';
        listaEventosContainer.innerHTML = '';

        
        let todosEventos = [
            ...getNoticias(),
            ...getTarefasEProvas(),
            ...getEventosSecretaria()
        ];
        
        
        if (dataFiltro) {
            todosEventos = todosEventos.filter(e => e.data === dataFiltro);
        }

        if (todosEventos.length === 0) {
            loadingMessage.textContent = dataFiltro ? "Nenhum evento encontrado para esta data." : "Nenhum evento agendado.";
            return;
        }

        todosEventos.sort((a, b) => new Date(a.data) - new Date(b.data));

  
        todosEventos.forEach(evento => {
            const { dia, mes } = formatarData(evento.data);

            const eventoHTML = `
                <div class="evento-item ${evento.classe}">
                    <div class="evento-data-box">
                        <div class="evento-dia">${dia}</div>
                        <div class="evento-mes">${mes}</div>
                    </div>
                    <div class="evento-detalhes">
                        <div class="d-flex align-items-center">
                            <h5 class="evento-titulo mb-0">${evento.titulo}</h5>
                            <span class="evento-tag badge rounded-pill bg-light text-dark">${evento.tipo}</span>
                        </div>
                        <p class="mb-0 text-muted">${evento.descricao}</p>
                    </div>
                </div>
            `;
            listaEventosContainer.innerHTML += eventoHTML;
        });

        loadingMessage.style.display = 'none';
    }

    
    filtroDataInput.addEventListener('change', function() {
        renderizarCalendario(this.value);
    });

    
    renderizarCalendario();
});