// Simple attendance page script
// Provides sample data, table rendering, charts (Chart.js), filters and CSV export

(function(){
  // Sample data generation
  const sampleDates = [
    '2025-11-17','2025-11-18','2025-11-19','2025-11-20','2025-11-21'
  ];

  const sampleStudents = [
    { id: 1, name: 'Ana Silva', turma: 'A', records: { } },
    { id: 2, name: 'Bruno Souza', turma: 'A', records: { } },
    { id: 3, name: 'Carla Pereira', turma: 'B', records: { } },
    { id: 4, name: 'Daniel Oliveira', turma: 'B', records: { } },
    { id: 5, name: 'Eduarda Lima', turma: 'A', records: { } }
  ];

  // Local storage keys
  const STORAGE_STUDENTS = 'frequencia_students_v1';
  const STORAGE_DATES = 'frequencia_dates_v1';
  const STORAGE_TURMAS = 'frequencia_turmas_v1';

  // State
  let allStudents = []; // master list (used for save/load)
  let students = []; // currently displayed (may be filtered)
  let dates = [];
  let turmas = [];
  let lineChart, barChart;

  // Fill random attendance for demo on a provided students array
  function seedRecords(targetStudents, targetDates){
    targetStudents.forEach(s => {
      if(!s.records) s.records = {};
      targetDates.forEach(d => {
        if(typeof s.records[d] === 'undefined'){
          // 90% chance present
          s.records[d] = Math.random() > 0.1;
        }
      });
    });
  }

  function saveState(){
    try{
      localStorage.setItem(STORAGE_STUDENTS, JSON.stringify(allStudents));
      localStorage.setItem(STORAGE_DATES, JSON.stringify(dates));
      localStorage.setItem(STORAGE_TURMAS, JSON.stringify(turmas));
    }catch(e){ console.warn('Erro ao salvar localStorage', e); }
  }

  function loadState(){
    try{
      const s = localStorage.getItem(STORAGE_STUDENTS);
      const d = localStorage.getItem(STORAGE_DATES);
      const t = localStorage.getItem(STORAGE_TURMAS);

      if(d){
        dates = JSON.parse(d);
      } else {
        dates = sampleDates.slice();
      }

      if(s){
        allStudents = JSON.parse(s);
        // ensure records for all dates exist
        seedRecords(allStudents, dates);
      } else {
        allStudents = JSON.parse(JSON.stringify(sampleStudents));
        seedRecords(allStudents, dates);
      }

      if(t){
        turmas = JSON.parse(t);
      } else {
        // derive turmas from students
        turmas = Array.from(new Set(allStudents.map(x => x.turma))).sort();
      }
    }catch(e){
      console.warn('Erro ao carregar estado, usando dados de exemplo', e);
      dates = sampleDates.slice();
      allStudents = JSON.parse(JSON.stringify(sampleStudents));
      seedRecords(allStudents, dates);
      turmas = Array.from(new Set(allStudents.map(x => x.turma))).sort();
    }
  }

  // Utilities
  function formatDate(d){
    // input YYYY-MM-DD -> DD/MM
    const parts = d.split('-');
    return parts[2] + '/' + parts[1];
  }

  function getTurmas(){
    // prefer explicit turmas list, fallback to deriving from allStudents
    if(turmas && turmas.length) return turmas.slice().sort();
    const set = new Set(allStudents.map(s => s.turma));
    return Array.from(set).sort();
  }

  // Render controls
  function populateTurmaFilter(){
    const sel = document.getElementById('filterTurma');
    sel.innerHTML = '<option value="all">Todas</option>' + getTurmas().map(t => `<option value="${t}">${t}</option>`).join('');
    // also populate student form turma select if present
    const stuSel = document.getElementById('newStudentTurma');
    if(stuSel){
      stuSel.innerHTML = getTurmas().map(t => `<option value="${t}">${t}</option>`).join('');
    }
  }

  function addStudent(name, turma){
    if(!name || !turma) return null;
    const maxId = allStudents.reduce((m,s) => Math.max(m, s.id || 0), 0);
    const id = maxId + 1;
    const student = { id, name: name.trim(), turma, records: {} };
    // ensure records for current dates
    seedRecords([student], dates);
    allStudents.push(student);
    // if turma is new, ensure turmas list contains it
    if(!turmas.includes(turma)){
      turmas.push(turma);
      turmas = Array.from(new Set(turmas)).sort();
    }
    saveState();
    return student;
  }

  // Table render
  function renderTable(){
    const table = document.getElementById('attendanceTable');
    if(!table) return;
    // build header
    let html = '<thead><tr><th>Aluno</th><th>Turma</th>' + dates.map(d => `<th>${formatDate(d)}</th>`).join('') + '</tr></thead>';
    // body
    html += '<tbody>' + students.map(s => {
      return '<tr data-id="'+s.id+'"><td style="text-align:left">'+s.name+'</td><td>'+s.turma+'</td>' + dates.map(d => {
        const checked = s.records[d] ? 'checked' : '';
        return `<td><input type="checkbox" data-student="${s.id}" data-date="${d}" ${checked}></td>`;
      }).join('') + '</tr>';
    }).join('') + '</tbody>';

    table.innerHTML = html;

    // add listeners
    table.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const sid = Number(cb.dataset.student);
        const date = cb.dataset.date;
        // update master list
        const stMaster = allStudents.find(x => x.id === sid);
        if(stMaster) stMaster.records[date] = cb.checked;
        // also update displayed student if present
        const st = students.find(x => x.id === sid);
        if(st) st.records[date] = cb.checked;
        saveState();
        updateCharts();
      });
    });
  }

  // Charts
  function updateCharts(){
    if(!dates.length) return;

    // attendance percent per date
    const percentPerDate = dates.map(d => {
      // calculate against all displayed students (students array)
      const present = students.reduce((acc,s) => acc + (s.records[d] ? 1 : 0), 0);
      return students.length ? Math.round((present / students.length) * 100) : 0;
    });

    const perStudentPercent = students.map(s => {
      const present = dates.reduce((acc,d) => acc + (s.records[d] ? 1 : 0), 0);

      return dates.length ? Math.round((present / dates.length) * 100) : 0;
    });

    // Update or create line chart
    const ctxLine = document.getElementById('attendanceLineChart').getContext('2d');
    const labels = dates.map(formatDate);
    if(lineChart){
      lineChart.data.labels = labels;
      lineChart.data.datasets[0].data = percentPerDate;
      lineChart.update();
    } else {
      lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Frequência (%) por dia',
            data: percentPerDate,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13,110,253,0.15)',
            tension: 0.25
          }]
        },
        options: { responsive: true }
      });
    }

    // Bar chart per student
    const ctxBar = document.getElementById('attendanceBarChart').getContext('2d');
    if(barChart){
      barChart.data.labels = students.map(s => s.name);
      barChart.data.datasets[0].data = perStudentPercent;
      barChart.update();
    } else {
      barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: students.map(s => s.name),
          datasets: [{
            label: '% de presença',
            data: perStudentPercent,
            backgroundColor: '#198754'
          }]
        },
        options: { responsive: true }
      });
    }
  }

  // CSV export
  function exportCSV(){
    const header = ['Aluno','Turma',...dates];
    const rows = students.map(s => {
      return [s.name, s.turma, ...dates.map(d => s.records[d] ? 'P' : 'A')];
    });
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'frequencia.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Filter and controls
  function applyFilter(){
    const turma = document.getElementById('filterTurma').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    // filter students by turma from master list
    let filtered = allStudents.slice();
    if(turma !== 'all') filtered = filtered.filter(s => s.turma === turma);

    // filter dates by range
    let filteredDates = dates.slice();
    if(start) filteredDates = filteredDates.filter(d => d >= start);
    if(end) filteredDates = filteredDates.filter(d => d <= end);

    students = filtered;
    dates = filteredDates;
    renderTable();
    updateCharts();
  }

  function resetFilters(){
    document.getElementById('filterTurma').value = 'all';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    students = allStudents.slice();
    // reload dates from storage or default sample list
    const storedDates = localStorage.getItem(STORAGE_DATES);
    dates = storedDates ? JSON.parse(storedDates) : sampleDates.slice();
    renderTable();
    updateCharts();
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    // load saved state if present
    loadState();
    // populate filters
    populateTurmaFilter();
    // attach events
    document.getElementById('btnFilter').addEventListener('click', applyFilter);
    document.getElementById('btnReset').addEventListener('click', resetFilters);
    document.getElementById('btnExport').addEventListener('click', exportCSV);
    document.getElementById('btnAddTurma').addEventListener('click', () => {
      const val = (document.getElementById('newTurmaInput').value || '').trim();
      if(!val){ alert('Informe o nome da turma (ex: C)'); return; }
      if(turmas.includes(val)){
        alert('Turma já existe');
        return;
      }
      turmas.push(val);
      turmas = Array.from(new Set(turmas)).sort();
      populateTurmaFilter();
      saveState();
      document.getElementById('newTurmaInput').value = '';
    });

    // add student handler
    const btnAddStudent = document.getElementById('btnAddStudent');
    if(btnAddStudent){
      btnAddStudent.addEventListener('click', () => {
        const name = (document.getElementById('newStudentName').value || '').trim();
        const turma = (document.getElementById('newStudentTurma').value || '').trim();
        if(!name){ alert('Informe o nome do aluno'); return; }
        if(!turma){ alert('Escolha uma turma'); return; }
        const st = addStudent(name, turma);
        if(st){
          // refresh UI
          students = allStudents.slice();
          populateTurmaFilter();
          renderTable();
          updateCharts();
          document.getElementById('newStudentName').value = '';
        }
      });
    }

    // initial render
    allStudents = allStudents || [];
    students = allStudents.slice();
    // ensure dates variable used elsewhere is in sync
    const storedDates = localStorage.getItem(STORAGE_DATES);
    dates = storedDates ? JSON.parse(storedDates) : sampleDates.slice();
    // persist initial state if not present
    saveState();
    renderTable();
    updateCharts();
  });

})();
