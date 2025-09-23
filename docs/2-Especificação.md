# 2. Especificações do Projeto

Pré-requisitos: <a href="1-Contexto.md"> Documentação de Contexto</a>

> Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto.

## 2.1 Personas

**Persona 1**  

**Nome:** Ricardo Almeida

**Idade:** 41 anos  

**Profissão:** Professor 

**Perfil:** Ricardo é dedicado e gosta de tecnologia aplicada ao ensino, mas não tem muito tempo para aprender sistemas complicados. Ele precisa de praticidade para lançar notas e faltas rapidamente, além de criar suas turmas no início do semestre. Dá importância a relatórios claros que mostrem o desempenho da turma e a frequência dos alunos, pois isso facilita reuniões com pais e responsáveis. Para ele, o ideal é que o sistema seja simples, direto e funcione bem tanto no computador da escola quanto em casa.

**Persona 2**

Nome: Helena Martins

Idade: 52 anos

Profissão: Diretora Escolar

Perfil: Helena tem ampla experiência na gestão escolar e precisa de uma visão global da instituição. Ela utiliza o sistema para acompanhar o desempenho de todas as turmas, supervisionar matrículas, verificar eventos planejados e analisar estatísticas de frequência e notas. Prefere sistemas que centralizem tudo em um só lugar, pois isso otimiza a tomada de decisão e reduz a necessidade de planilhas paralelas. Preza por segurança dos dados e relatórios consolidados para apresentar em reuniões pedagógicas e administrativas.

Persona 3 

Nome: Camila Ferreira

Idade: 28 anos

Profissão: Auxiliar de Secretaria Escolar

Perfil: Camila é responsável por realizar matrículas, organizar documentos e cadastrar eventos no calendário escolar. Ela usa o sistema diariamente, por isso precisa de rapidez e confiabilidade. Valoriza ferramentas que permitam cadastrar alunos e turmas de forma simples, além de gerar listas de presença e relatórios administrativos. Também gosta quando o sistema envia notificações automáticas para alunos e responsáveis sobre matrículas e eventos, o que diminui a quantidade de ligações e atendimentos presenciais.

---
#### ⚠️ **ATENÇÃO**
Os quadros abaixo devem ser preenchidos com os **requisitos funcionais e não funcionais** específicos do sistema que está sendo desenvolvido.  

✅ **Importante:**  
- Não existe número mínimo obrigatório de requisitos.  
- Será avaliado se **todos os requisitos funcionais propostos** foram **efetivamente desenvolvidos** até a entrega final.
- Cada requisito deve ser claro, único e representar uma característica da sua solução.
--- 



### 2.2 REQUISITOS FUNCIONAIS

> Preencha a tabela abaixo com os requisitos funcionais que **detalham as funcionalidades que seu sistema deverá oferecer**.  
> Cada requisito deve representar uma característica única da solução e ser claro para orientar o desenvolvimento.


|ID    | Descrição do Requisito                                                                                            | Prioridade |
|------|-------------------------------------------------------------------------------------------------------------------|------------|
|RF-01| O sistema deve permitir cadastrar de alunos, contendo dados pessoais como número da matricula e nome completo     | ALTA       | 
|RF-02| O sistema deve permitir que os usuários criem turmas  com os alunos das mesmas e  horarios de aula                | ALTA       |
|RF-03| O sistema deve conter página com frequencia dos alunos, refletidindo em um gráfico de coluna                      | ALTA       |
|RF-04| O sistema deve conter página com notas dos alunos, refletindo em um grafico de colunas                            | ALTA       |
|RF-05| O sistema deve permitir a criação e alteração de um calendário escolar com datas de eventos e provas              | MÉDIA      |


### 2.3 REQUISITOS NÃO FUNCIONAIS

> Preencha a tabela abaixo com os requisitos não funcionais que definem **características desejadas para o sistema que irão desenvolver**, como desempenho, segurança, usabilidade, etc.  
> Lembre-se que esses requisitos são importantes para garantir a qualidade da solução.

|ID     | Descrição do Requisito                                                                              |Prioridade |
|-------|-----------------------------------------------------------------------------------------------------|-----------|
|RNF-01| O sistema deve carregar as páginas em até 3 segundos para garantir uma boa experiência ao usuário.  | MÉDIA     | 
|RNF-02| O sistema deve otimizar imagens e vídeos para não comprometer a navegação.                          | MÉDIA     | 
|RNF-03| O sistema deve ter nterface simples, intuitiva e amigável, com navegação fácil.                     | ALTA      |
|RNF-04| O sistema deve ter contraste adequado entre cores de fundo e texto.                                 | MÈDIA     |
|RNF-05| O sistema de ve ter código estruturado para facilitar futuras atualizações                          | ALTO      |


---

## 2.4 RESTRIÇÕES

> Restrições são limitações externas impostas ao projeto que devem ser rigorosamente obedecidas durante o desenvolvimento. Elas podem estar relacionadas a prazos, tecnologias obrigatórias ou proibidas, ambiente de execução, normas legais ou políticas internas da organização. Diferente dos requisitos não funcionais, que indicam características desejadas do sistema, as restrições determinam limites fixos que influenciam as decisões de projeto.

> A tabela abaixo deve ser preenchida com as restrições específicas que **impactam seu projeto**. Caso não haja alguma restrição adicional além das já listadas, mantenha a tabela conforme está.

| ID  | Restrição                                                        |
|------|-----------------------------------------------------------------|
| 01   | O projeto deverá ser entregue até o final do semestre.          |
| 02   | O sistema deve funcionar apenas dentro da rede interna da escola.  |





 
> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)






