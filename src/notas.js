
(function(){
  const STORAGE_ASSIGN = 'notas_assignments_v1';
  const STORAGE_GRADES = 'notas_grades_v1';
  const STORAGE_TASKS = 'notas_tasks_v1';

  function loadStudentsFromFrequencia(){
    try{
      const raw = localStorage.getItem('frequencia_students_v1');
      if(raw) return JSON.parse(raw);
    }catch(e){ }
    
    return [
      { id:1, name:'Ana Silva', turma:'A' },
      { id:2, name:'Bruno Souza', turma:'A' },
      { id:3, name:'Carla Pereira', turma:'B' },
      { id:4, name:'Daniel Oliveira', turma:'B' }
    ];
  }

  let allStudents = [];
  let assignments = [];
  
  let grades = {};
  let tasks = [];

  let turmaPie, studentPie;
  let selectedStudentId = null;

  function loadState(){
    allStudents = loadStudentsFromFrequencia();
    try{ assignments = JSON.parse(localStorage.getItem(STORAGE_ASSIGN)) || []; }catch(e){ assignments = []; }
    try{ grades = JSON.parse(localStorage.getItem(STORAGE_GRADES)) || {}; }catch(e){ grades = {}; }
    try{ tasks = JSON.parse(localStorage.getItem(STORAGE_TASKS)) || []; }catch(e){ tasks = []; }
  }

  function saveState(){
    localStorage.setItem(STORAGE_ASSIGN, JSON.stringify(assignments));
    localStorage.setItem(STORAGE_GRADES, JSON.stringify(grades));
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
  }

  function getTurmas(){
    return Array.from(new Set(allStudents.map(s => s.turma))).sort();
  }

  function populateTurmaFilter(){
    const sel = document.getElementById('filterTurmaNotas');
    sel.innerHTML = '<option value="all">Todas</option>' + getTurmas().map(t => `<option value="${t}">${t}</option>`).join('');
  }

  function formatNum(n){ return (typeof n === 'number') ? n.toFixed(1) : '-'; }

  function renderTable(){
    const tbl = document.getElementById('gradesTable');
    if(!tbl) return;
    
    let hdr = '<thead><tr><th>Aluno</th><th>Turma</th>' + assignments.map(a => `<th>${a.name}</th>`).join('') + '<th>Média</th></tr></thead>';
    
    const selTurma = document.getElementById('filterTurmaNotas').value;
    const students = (selTurma === 'all') ? allStudents : allStudents.filter(s => s.turma === selTurma);
    let body = '<tbody>' + students.map(s => {
      const row = assignments.map(a => {
        const val = (grades[s.id] && typeof grades[s.id][a.id] !== 'undefined') ? grades[s.id][a.id] : '';
        return `<td><input data-student="${s.id}" data-assign="${a.id}" class="grade-input" value="${val}" style="width:70px; padding:6px; border-radius:6px; border:1px solid #e6eefc"></td>`;
      }).join('');

      const avg = computeAvgForStudent(s.id);
      return `<tr data-id="${s.id}"><td style="text-align:left">${s.name}</td><td>${s.turma}</td>${row}<td><strong>${formatNum(avg)}</strong></td></tr>`;
    }).join('') + '</tbody>';

    tbl.innerHTML = hdr + body;

    tbl.querySelectorAll('.grade-input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const sid = Number(inp.dataset.student);
        const aid = inp.dataset.assign;
        const raw = inp.value.trim();
        const val = raw === '' ? null : Number(raw);
        if(!grades[sid]) grades[sid] = {};
        grades[sid][aid] = (val === null || isNaN(val)) ? null : val;
        saveState();
        renderTable();
        updateCharts();
      });
    });

    
    tbl.querySelectorAll('tbody tr').forEach(tr => {
      tr.addEventListener('click', () => {
        const id = Number(tr.dataset.id);
        selectedStudentId = id;
        document.getElementById('selectedStudentName').textContent = 'Aluno selecionado: ' + (allStudents.find(x => x.id === id)?.name || '');
        updateCharts();
      });
    });
  }

  function computeAvgForStudent(studentId){
    const items = assignments.map(a => {
      const v = grades[studentId] ? grades[studentId][a.id] : null;
      return (typeof v === 'number') ? v : null;
    }).filter(x => x !== null);
    if(!items.length) return null;
    const sum = items.reduce((s,v)=>s+v,0);
    return sum / items.length;
  }

  function addAssignment(name){
    if(!name) return null;
    const id = 'a' + Date.now();
    const assign = { id, name };
    assignments.push(assign);
    
    saveState();
    return assign;
  }

  function renderTasks(){
    const ul = document.getElementById('taskList');
    ul.innerHTML = tasks.map(t => `<li><div><strong>${t.title}</strong><div style="font-size:0.9rem;color:#6b7280">Venc: ${t.due || '-'}</div></div><div><button data-id="${t.id}" class="remove-task">Excluir</button></div></li>`).join('');
    ul.querySelectorAll('.remove-task').forEach(btn => btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      tasks = tasks.filter(x=>x.id!==id);
      saveState(); renderTasks();
    }));
  }

  function bucketDistributionForTurma(turma){
    const students = (turma === 'all') ? allStudents : allStudents.filter(s => s.turma === turma);
    const buckets = { 'A (90-100)':0, 'B (80-89)':0, 'C (70-79)':0, 'D (60-69)':0, 'F (<60)':0 };
    students.forEach(s => {
      const avg = computeAvgForStudent(s.id);
      if(avg === null) return;
      if(avg >= 90) buckets['A (90-100)']++;
      else if(avg >=80) buckets['B (80-89)']++;
      else if(avg >=70) buckets['C (70-79)']++;
      else if(avg >=60) buckets['D (60-69)']++;
      else buckets['F (<60)']++;
    });
    return buckets;
  }

  function studentDistribution(studentId){
    
    const buckets = { 'A (90-100)':0, 'B (80-89)':0, 'C (70-79)':0, 'D (60-69)':0, 'F (<60)':0 };
    if(!studentId) return buckets;
    assignments.forEach(a => {
      const v = grades[studentId] ? grades[studentId][a.id] : null;
      if(typeof v !== 'number') return;
      if(v >= 90) buckets['A (90-100)']++;
      else if(v >=80) buckets['B (80-89)']++;
      else if(v >=70) buckets['C (70-79)']++;
      else if(v >=60) buckets['D (60-69)']++;
      else buckets['F (<60)']++;
    });
    return buckets;
  }

  function updateCharts(){
    
    const turma = document.getElementById('filterTurmaNotas').value || 'all';
    const buckets = bucketDistributionForTurma(turma);
    const labels = Object.keys(buckets);
    const data = Object.values(buckets);
    const ctxT = document.getElementById('turmaPie').getContext('2d');
    if(turmaPie){ turmaPie.data.labels = labels; turmaPie.data.datasets[0].data = data; turmaPie.update(); }
    else{
      turmaPie = new Chart(ctxT, { type:'pie', data:{ labels, datasets:[{ data, backgroundColor:['#16a34a','#0ea5e9','#f59e0b','#ef4444','#6b7280'] }] }, options:{responsive:true} });
    }

  
    const studentBuckets = studentDistribution(selectedStudentId);
    const sLabels = Object.keys(studentBuckets);
    const sData = Object.values(studentBuckets);
    const ctxS = document.getElementById('studentPie').getContext('2d');
    if(studentPie){ studentPie.data.labels = sLabels; studentPie.data.datasets[0].data = sData; studentPie.update(); }
    else{
      studentPie = new Chart(ctxS, { type:'pie', data:{ labels:sLabels, datasets:[{ data:sData, backgroundColor:['#16a34a','#0ea5e9','#f59e0b','#ef4444','#6b7280'] }] }, options:{responsive:true} });
    }
  }

  function exportCSV(){
    const header = ['Aluno','Turma', ...assignments.map(a=>a.name), 'Média'];
    const rows = allStudents.map(s => {
      const row = [s.name, s.turma];
      assignments.forEach(a => {
        const v = grades[s.id] && typeof grades[s.id][a.id] !== 'undefined' ? grades[s.id][a.id] : '';
        row.push(v);
      });
      row.push(computeAvgForStudent(s.id) || '');
      return row;
    });
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='notas.csv'; a.click(); URL.revokeObjectURL(url);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    loadState();
    populateTurmaFilter();
    renderTable();
    renderTasks();
    updateCharts();

    document.getElementById('filterTurmaNotas').addEventListener('change', ()=>{ renderTable(); updateCharts(); });
    document.getElementById('btnAddAssignment').addEventListener('click', ()=>{
      const name = (document.getElementById('newAssignmentName').value || '').trim();
      if(!name){ alert('Informe o nome da avaliação'); return; }
      addAssignment(name);
      document.getElementById('newAssignmentName').value = '';
      saveState(); populateTurmaFilter(); renderTable(); updateCharts();
    });

    document.getElementById('btnAddTask').addEventListener('click', ()=>{
      const title = (document.getElementById('taskTitle').value || '').trim();
      const due = document.getElementById('taskDue').value || '';
      if(!title){ alert('Informe o título da tarefa'); return; }
      const id = 't' + Date.now();
      tasks.push({ id, title, due });
      saveState(); renderTasks();
      document.getElementById('taskTitle').value=''; document.getElementById('taskDue').value='';
    });

    document.getElementById('btnExportNotas').addEventListener('click', exportCSV);
  });

})();
