// Falling leaves background


function ensureLeavesBg() {
  if (!document.getElementById('falling-leaves-bg')) {
    const leafColors = ['#9E4A4A', '#E07A5F', '#FFCE3A', '#71A767', '#CE4D4D'];
    const bg = document.createElement('div');
    bg.id = 'falling-leaves-bg';
    bg.style.position = 'fixed';
    bg.style.top = '0';
    bg.style.left = '0';
    bg.style.width = '100vw';
    bg.style.height = '100vh';
    bg.style.pointerEvents = 'none';
    bg.style.zIndex = '-1';
    for (let i = 0; i < 80; ++i) {
      const leaf = document.createElement('div');
      leaf.className = 'falling-leaf generic-leaf';
      const color = leafColors[Math.floor(Math.random()*leafColors.length)];
      leaf.style.setProperty('--leaf-color', color);
      const startLeft = Math.random()*100;
      const drift = (Math.random()-0.5)*30;
      const startRot = Math.random()*360;
      const endRot = startRot + (Math.random()>0.5?1:-1)*(180+Math.random()*180);
      leaf.style.left = startLeft + 'vw';
      leaf.style.top = (-10 - Math.random()*30) + 'vh';
      leaf.style.width = (12 + Math.random()*8) + 'px';
      leaf.style.height = (22 + Math.random()*10) + 'px';
      leaf.style.animationDelay = (Math.random()*10) + 's';
      leaf.style.animationDuration = (14 + Math.random()*10) + 's';
      leaf.style.setProperty('--leaf-drift', drift + 'vw');
      leaf.style.setProperty('--leaf-rot-start', startRot + 'deg');
      leaf.style.setProperty('--leaf-rot-end', endRot + 'deg');
      leaf.style.transform = `rotate(${startRot}deg)`;
      bg.appendChild(leaf);
    }
    document.body.prepend(bg);
  }
}

ensureLeavesBg();
const app = document.getElementById('app');

// Load state from localStorage if available
function loadState() {
  try {
    const saved = localStorage.getItem('cozyCatState');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    activePanel: 'dressup',
    dressupStep: 1,
    cat: {
      furColor: 'gray',
      costume: null,
      accessory: null,
      eyes: null,
      hat: null,
    }
  };
}
let state = loadState();

function saveState() {
  try {
    localStorage.setItem('cozyCatState', JSON.stringify(state));
  } catch (e) {}
}

function render() {
  // Determine panel title
  let panelTitle = '';
  if (state.activePanel === 'dressup') panelTitle = 'FAT CAT DRESS UP';
  if (state.activePanel === 'calendar') panelTitle = 'CALENDAR';
  if (state.activePanel === 'todo') panelTitle = 'TODO LIST';
  app.innerHTML = `
    <div class="left-panel">
      <div class="kitty-container">
        ${renderCat(state.cat)}
      </div>
      <div class="toggle-buttons toggle-row">
        <button class="circle-btn${state.activePanel==='dressup' ? ' active' : ''}" title="Dress Up" onclick="window.setPanel('dressup')">
          <img src="assets/icons/fluent_clothes-hanger-12-filled${state.activePanel==='dressup' ? '-cream' : ''}.svg" alt="Dress Up" class="icon-btn" />
        </button>
        <button class="circle-btn${state.activePanel==='todo' ? ' active' : ''}" title="Todo List" onclick="window.setPanel('todo')">
          <img src="assets/icons/lucide_list-todo${state.activePanel==='todo' ? '-cream' : ''}.svg" alt="Todo List" class="icon-btn" />
        </button>
        <button class="circle-btn${state.activePanel==='calendar' ? ' active' : ''}" title="Calendar" onclick="window.setPanel('calendar')">
          <img src="assets/icons/mdi_calendar${state.activePanel==='calendar' ? '-cream' : ''}.svg" alt="Calendar" class="icon-btn" />
        </button>
      </div>
    </div>
    <div class="right-panel-outer">
      <div class="panel-title dressup-title">${panelTitle}</div>
      <div class="right-panel">
        ${renderPanel()}
      </div>
    </div>
  `;
  saveState();
}

window.setPanel = (panel) => {
  state.activePanel = panel;
  saveState();
  render();
};

function renderPanel() {
  if (state.activePanel === 'dressup') return renderDressup();
  if (state.activePanel === 'calendar') return renderCalendar();
  if (state.activePanel === 'todo') return renderTodo();
  return '';
}

function renderCat(cat) {
  // Map furColor to image filename
  const colorMap = {
    purple: 'purple cat.svg',
    orange: 'orange cat.svg',
    gray: 'gray cat.svg',
    white: 'cream cat.svg',
    black: 'black cat.svg',
    yellow: 'yellow cat.svg',
    green: 'green cat.svg',
    cinnamon: 'cinnamon cat.svg',
  };
  const catImg = colorMap[cat.furColor] || 'purple cat.svg';
  // Costume overlays
  const costumeMap = {
    vampire: 'vampire.svg',
    ghost: 'ghost.svg',
    candycorn: 'candycorn.svg',
    none : 'none.svg',
  };
  const costumeImg = cat.costume && costumeMap[cat.costume] ? `<img src="assets/costumes/${costumeMap[cat.costume]}" alt="costume" class="cat-overlay costume" />` : '';
  // Accessory overlays
  const accessoryMap = {
    scarf: 'scarf.svg',
    pumpkinhat: 'pumpkin hat.svg',
    headphone: 'headphone.svg',
    none : 'none.svg',
  };
  const accessoryImg = cat.accessory && accessoryMap[cat.accessory] ? `<img src="assets/accessories/${accessoryMap[cat.accessory]}" alt="accessory" class="cat-overlay accessory" />` : '';
  // Hat overlays (reuse accessory for now)
  const decorationMap = {
    'pumpkin baby': 'pumpkin baby.svg',
    'ghost babies': 'ghost babies.svg',
    'leaf pile': 'leaf pile.svg',
    none : 'none.svg',
  };
  const hatImg = cat.hat && decorationMap[cat.hat] ? `<img src="assets/accessories/${decorationMap[cat.hat]}" alt="hat" class="cat-overlay hat" />` : '';
  return `
    <div class="kitty-stack">
      <img src="assets/cats/${catImg}" alt="cat" class="cat-base" />
      ${costumeImg}
      ${accessoryImg}
      ${hatImg}
    </div>
  `;
}

function renderDressup() {
    let html = '';
    switch(state.dressupStep) {
      case 1:
        html += `
          <div class="dressup-step-label">
            <div class="fur-title">FUR COLOR</div>
            <div class="fur-subtitle">CHOOSE YOUR KITTY'S FUR COLOR</div>
          </div>
          <div class="fur-color-panel">
            <div class="fur-color-grid">
              <button class="fur-color-swatch${state.cat.furColor==='cinnamon'?' selected':''}" style="background:#CE4D4D;" onclick="window.setFurColor('cinnamon')"></button>
              <button class="fur-color-swatch${state.cat.furColor==='orange'?' selected':''}" style="background:#E07A5F;" onclick="window.setFurColor('orange')"></button>
              <button class="fur-color-swatch${state.cat.furColor==='yellow'?' selected':''}" style="background:#FFCE3A;" onclick="window.setFurColor('yellow')"></button>
              <button class="fur-color-swatch${state.cat.furColor==='green'?' selected':''}" style="background:#71A767;" onclick="window.setFurColor('green')"></button>
              <button class="fur-color-swatch${state.cat.furColor==='purple'?' selected':''}" style="background:#392951;" onclick="window.setFurColor('purple')"></button>
              <button class="fur-color-swatch${state.cat.furColor==='black'?' selected':''}" style="background:#150E17;" onclick="window.setFurColor('black')"></button>
              <button class="fur-color-swatch${state.cat.furColor==='gray'?' selected':''}" style="background:#4F4141;" onclick="window.setFurColor('gray')"></button>
              <button class="fur-color-swatch${state.cat.furColor==='white'?' selected':''}" style="background:#FFF4E6;" onclick="window.setFurColor('white')"></button>
            </div>
          </div>
        `;
        break;
      case 2:
        html += `
          <div class="dressup-step-label">
            <div class="fur-title">OUTFIT</div>
            <div class="fur-subtitle">CHOOSE YOUR KITTY'S FALL COSTUME</div>
          </div>
          <div class="fur-color-panel">
            <div class="fur-color-grid" style="grid-template-columns: repeat(2, 1fr);">
              <button class="fur-color-swatch" style="background:url('widget-icons/ghost.svg');" onclick="window.setCostume('ghost')"></button>
              <button class="fur-color-swatch" style="background:url('widget-icons/vampire.svg');" onclick="window.setCostume('vampire')"></button>
              <button class="fur-color-swatch" style="background:url('widget-icons/candycorn.svg');" onclick="window.setCostume('candycorn')"></button>
              <button class="fur-color-swatch" style="background:url('widget-icons/none.svg');" onclick="window.setCostume('none')"></button>
            </div>
          </div>
        `;
        break;
      case 3:
        html += `
          <div class="dressup-step-label">
            <div class="fur-title">ACCESSORIES</div>
            <div class="fur-subtitle">CHOOSE YOUR KITTY'S CUTE ACCESSORIES</div>
          </div>
          <div class="fur-color-panel">
            <div class="fur-color-grid" style="grid-template-columns: repeat(2, 1fr);">
              <button class="fur-color-swatch" style="background:url('widget-icons/scarf.svg');" onclick="window.setAccessory('scarf')"></button>
              <button class="fur-color-swatch" style="background:url('widget-icons/pumpkinhat.svg');" onclick="window.setAccessory('pumpkinhat')"></button>
              <button class="fur-color-swatch" style="background:url('widget-icons/headphone.svg');" onclick="window.setAccessory('headphone')"></button>
              <button class="fur-color-swatch" style="background:url('widget-icons/none.svg');" onclick="window.setAccessory('none')"></button>
            </div>
          </div>
        `;
        break;
      case 4:
        html += `
          <div class="dressup-step-label">
            <div class="fur-title">DECORATIONS</div>
            <div class="fur-subtitle">ADD SOME FALL MAGIC TO THE SCENE!</div>
          </div>
          <div class="fur-color-panel">
            <div class="fur-color-grid" style="grid-template-columns: repeat(2, 1fr);">
              <button class="fur-color-swatch" style="background:url('widget-icons/pumpkinbaby.svg');" onclick="window.setEyes('pumpkinbaby')"></button>
              <button class="fur-color-swatch" style="background:url('widget-icons/ghostbaby.svg');" onclick="window.setEyes('ghostbaby')"></button>
              <button class="fur-color-swatch" style="background:url('widget-icons/leafpile.svg');" onclick="window.setEyes('leafpile')"></button>
              <button class="fur-color-swatch" style="background:url('widget-icons/none.svg');" onclick="window.setEyes('none')"></button>
            </div>
          </div>
        `;
        break;
      case 5:
        html += `
          <div class="dressup-step-label">
            <div class="fur-title">ADORBS!!</div>
            <div class="fur-subtitle">SAVE A MEMORY OF YOUR KITTY</div>
          </div>
          <div class="fur-color-panel">
            <button class="fur-color-swatch" style="background:url('widget-icons/camera.svg');" onclick="window.captureCat()"></button>
          </div>
          <div class="fur-subtitle">TO GO TO YOUR CALENDAR OR TODO LIST, PRESS THE BUTTONS UNDER YOUR KITTY</div>
        `;
        break;
    }
    html += '<div class="dressup-buttons">';
    if (state.dressupStep > 1) {
      html += `<button onclick="window.prevDressup()">Back</button>`;
    }
    if (state.dressupStep < 5) {
      html += `<button onclick="window.nextDressup()">Next</button>`;
    }
    html += '</div>';
    return html;
  }

window.setFurColor = (color) => {
  state.cat.furColor = color;
  saveState();
  render();
};
window.setCostume = (costume) => {
  state.cat.costume = costume;
  saveState();
  render();
};
window.setAccessory = (accessory) => {
  state.cat.accessory = accessory;
  saveState();
  render();
};
window.setEyes = (eyes) => {
  state.cat.eyes = eyes;
  saveState();
  render();
};
window.setHat = (hat) => {
  state.cat.hat = hat;
  saveState();
  render();
};
window.nextDressup = () => {
  if (state.dressupStep < 5) state.dressupStep++;
  saveState();
  render();
};
window.prevDressup = () => {
  if (state.dressupStep > 1) state.dressupStep--;
  saveState();
  render();
};
window.captureCat = async () => {
  // Dynamically load html2canvas if not already loaded
  if (!window.html2canvas) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    document.body.appendChild(script);
    await new Promise(res => { script.onload = res; });
  }
  const node = document.querySelector('.kitty-stack');
  const baseImg = node ? node.querySelector('.cat-base') : null;
  if (!node || !baseImg) return alert('Could not find cat to capture!');
  // Wait for image to load if needed
  if (!baseImg.complete) await new Promise(res => { baseImg.onload = res; });
  const width = baseImg.naturalWidth;
  const height = baseImg.naturalHeight;
  // Temporarily set node size to match image
  const prevStyle = { width: node.style.width, height: node.style.height };
  node.style.width = width + 'px';
  node.style.height = height + 'px';
  await new Promise(r => setTimeout(r, 10)); // allow reflow
  window.html2canvas(node, {backgroundColor: null, width, height, scale: 1}).then(canvas => {
    // Crop to image size if needed
    if (canvas.width !== width || canvas.height !== height) {
      const cropped = document.createElement('canvas');
      cropped.width = width;
      cropped.height = height;
      cropped.getContext('2d').drawImage(canvas, 0, 0, width, height, 0, 0, width, height);
      canvas = cropped;
    }
    // Restore node size
    node.style.width = prevStyle.width;
    node.style.height = prevStyle.height;
    canvas.toBlob(async (blob) => {
      const { ipcRenderer } = window.require ? window.require('electron') : {};
      if (ipcRenderer) {
        const arrayBuffer = await blob.arrayBuffer();
        ipcRenderer.invoke('save-cat-image', Buffer.from(arrayBuffer));
      } else {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    }, 'image/png');
  });
};


// --- Calendar State ---
if (!state.calendar) {
  state.calendar = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    selectedDay: new Date().getDate(),
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    events: {} // { 'YYYY-MM-DD': [ { text, important } ] }
  };
}

function pad2(n) { return n < 10 ? '0'+n : ''+n; }
function getTodayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}

function renderDayView() {
  const { selectedDay, selectedMonth, selectedYear, events } = state.calendar;
  const dateISO = `${selectedYear}-${pad2(selectedMonth+1)}-${pad2(selectedDay)}`;
  let html = `<div class="day-view-header">Events for ${selectedDay}/${selectedMonth+1}/${selectedYear}</div>`;
  html += `<div class="day-view-list">`;
  if (events[dateISO] && events[dateISO].length > 0) {
    for (let ev of events[dateISO]) {
      html += `<div class="day-view-event${ev.important ? ' important' : ''}">${ev.text}</div>`;
    }
  } else {
    html += `<div class="day-view-empty">No events for this day.</div>`;
  }
  html += `</div>`;
  return html;
}

function renderCalendar() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const { month, year, selectedDay, selectedMonth, selectedYear, events } = state.calendar;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month+1, 0);
  const todayISO = getTodayISO();
  let startWeekDay = firstDay.getDay();
  if (startWeekDay === 0) startWeekDay = 7;
  const weeks = [];
  let week = [];
  for (let i=1; i<startWeekDay; ++i) week.push(null);
  for (let d=1; d<=lastDay.getDate(); ++d) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) { while (week.length<7) week.push(null); weeks.push(week); }
  let html = `<div class="calendar-header-row">
    <button class="calendar-nav-btn" onclick="window.prevMonth()">&#8592;</button>
    <div class="calendar-month-label">${monthNames[month]} ${year}</div>
    <button class="calendar-nav-btn" onclick="window.nextMonth()">&#8594;</button>
    <button class="calendar-add-btn" onclick="window.showAddEvent()" title="Add Event"><img src="assets/icons/add.svg" alt="Add" /></button>
  </div>`;
  html += `<div class="calendar-table-outer"><table class="calendar-table" style="border-collapse: collapse;"><thead><tr>`;
  for (let i=0; i<7; ++i) html += `<th class="calendar-dayname${i>=5?' weekend':''}">${dayNames[i]}</th>`;
  html += `</tr></thead><tbody>`;
  for (let w=0; w<weeks.length; ++w) {
    const weekDays = weeks[w];
    html += `<tr>`;
    for (let i=0; i<7; ++i) {
      const d = weekDays[(i+6)%7];
      let cellClass = 'calendar-daycell';
      let isToday = (year === new Date().getFullYear() && month === new Date().getMonth() && d === new Date().getDate());
      let isSelected = (year === selectedYear && month === selectedMonth && d === selectedDay);
      if (i>=5) cellClass += ' weekend';
      if (isToday) cellClass += ' today';
      if (isSelected) cellClass += ' selected';
      let dateISO = d ? `${year}-${pad2(month+1)}-${pad2(d)}` : '';
      html += `<td class="${cellClass}" style="border: none; ${isToday ? 'background-color: #9E4A4A; color: #FFF4E6;' : ''}" ${d?`onclick=\"window.selectCalendarDay(${d})\"`:''}>`;
      if (d) {
        html += `<div class="calendar-daynum">${d}</div>`;
        if (events[dateISO]) {
          for (let ev of events[dateISO]) {
            html += `<div class="calendar-event-chip${ev.important?' important':''}">${ev.text}<button class='calendar-event-delete' onclick=\"window.deleteEvent('${dateISO}',${events[dateISO].indexOf(ev)})\">🗑️</button></div>`;
          }
        }
      }
      html += `</td>`;
    }
    html += `</tr>`;
  }
  html += `</tbody></table></div>`;
  html += renderDayView();
  return html;
}

window.prevMonth = () => {
  let { month, year } = state.calendar;
  month--;
  if (month < 0) { month = 11; year--; }
  state.calendar.month = month;
  state.calendar.year = year;
  state.calendar.selectedMonth = month;
  state.calendar.selectedYear = year;
  saveState();
  render();
};
window.nextMonth = () => {
  let { month, year } = state.calendar;
  month++;
  if (month > 11) { month = 0; year++; }
  state.calendar.month = month;
  state.calendar.year = year;
  state.calendar.selectedMonth = month;
  state.calendar.selectedYear = year;
  saveState();
  render();
};
window.selectCalendarDay = (d) => {
  state.calendar.selectedDay = d;
  state.calendar.selectedMonth = state.calendar.month;
  state.calendar.selectedYear = state.calendar.year;
  saveState();
  render();
};
window.showAddEvent = () => {
  document.getElementById('calendar-add-modal').style.display = 'flex';
  setTimeout(() => document.getElementById('calendar-event-input').focus(), 100);
};
window.hideAddEvent = () => {
  document.getElementById('calendar-add-modal').style.display = 'none';
};
window.addEvent = () => {
  const text = document.getElementById('calendar-event-input').value.trim();
  const important = document.getElementById('calendar-event-important').checked;
  if (!text) return;
  const { selectedDay, selectedMonth, selectedYear, events } = state.calendar;
  const dateISO = `${selectedYear}-${pad2(selectedMonth+1)}-${pad2(selectedDay)}`;
  if (!events[dateISO]) events[dateISO] = [];
  events[dateISO].push({ text, important });
  document.getElementById('calendar-event-input').value = '';
  document.getElementById('calendar-event-important').checked = false;
  saveState();
  render();
  window.hideAddEvent();
};
window.deleteEvent = (dateISO, idx) => {
  const { events } = state.calendar;
  if (events[dateISO]) {
    events[dateISO].splice(idx, 1);
    if (events[dateISO].length === 0) delete events[dateISO];
    saveState();
    render();
  }
};


function renderTodo() {
  // Group tasks by day (use day names for now)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  // If no todoList in state, initialize
  if (!state.todoList) state.todoList = {};
  // UI for adding a task
  let html = `
    <div class="todo-header-row">
      <button class="todo-add-btn" onclick="window.showAddTask()" title="Add Task"><img src="assets/icons/add.svg" alt="Add" /></button>
      <button class="todo-clear-btn" onclick="window.clearTasks()" title="Clear All"><img src="assets/icons/delete.svg" alt="Delete" /></button>
    </div>
    <div class="todo-list-scroll">
  `;
  for (const day of days) {
    const tasks = state.todoList[day] || [];
    if (tasks.length === 0) continue;
    html += `<div class="todo-day-group"><div class="todo-day-label">${day.toUpperCase()}</div>`;
    for (let i = 0; i < tasks.length; ++i) {
      const task = tasks[i];
      html += `
        <div class="todo-task-row">
          <button class="todo-check-btn${task.done ? ' checked' : ''}" onclick="window.toggleTask('${day}',${i})" aria-label="Check">
            ${task.done ? '<span class="todo-checkmark">✔</span>' : ''}
          </button>
          <span class="todo-task-label${task.done ? ' done' : ''}">${task.text}</span>
        </div>
      `;
    }
    html += '</div>';
  }
  html += '</div>';
  // Add task modal (hidden by default)
  html += `
    <div id="todo-add-modal" class="todo-modal" style="display:none;">
      <div class="todo-modal-content">
        <label for="todo-day-select">Day:</label>
        <select id="todo-day-select">
          ${days.map(day => `<option value="${day}">${day}</option>`).join('')}
        </select>
        <input id="todo-task-input" type="text" maxlength="60" placeholder="Enter task..." />
        <button onclick="window.addTask()">Add</button>
        <button onclick="window.hideAddTask()">Cancel</button>
      </div>
    </div>
  `;
  return html;
}

// Todo list logic (define globally, not inside renderTodo)
window.showAddTask = () => {
  document.getElementById('todo-add-modal').style.display = 'flex';
  setTimeout(() => document.getElementById('todo-task-input').focus(), 100);
};
window.hideAddTask = () => {
  document.getElementById('todo-add-modal').style.display = 'none';
};
window.addTask = () => {
  const day = document.getElementById('todo-day-select').value;
  const text = document.getElementById('todo-task-input').value.trim();
  if (!text) return;
  if (!state.todoList[day]) state.todoList[day] = [];
  state.todoList[day].push({ text, done: false });
  saveState();
  render();
  window.hideAddTask();
};
window.toggleTask = (day, idx) => {
  state.todoList[day][idx].done = !state.todoList[day][idx].done;
  saveState();
  render();
};
window.clearTasks = () => {
  if (confirm('Clear all tasks for all days?')) {
    state.todoList = {};
    saveState();
    render();
  }
};

render();
