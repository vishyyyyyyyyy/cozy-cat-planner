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
      decoration: null,
    }
  };
}
let state = loadState();

function saveState() {
  try {
    localStorage.setItem('cozyCatState', JSON.stringify(state));
  } catch (e) {}
}

// Updated the render function to use SVG assets for titles
function render() {
  // Determine panel title
  let panelTitle = '';
  if (state.activePanel === 'dressup') panelTitle = '<img src="assets/title/FAT CAT DRESS UP.svg" alt="Dress Up Title">';
  if (state.activePanel === 'calendar') panelTitle = '<img src="assets/title/Calendar.svg" alt="Calendar Title">';
  if (state.activePanel === 'todo') panelTitle = '<img src="assets/title/Todo LIST.svg" alt="Todo List Title">';
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
        ${state.activePanel==='calendar' ? '<button class="list-view-btn" onclick="window.setPanel(\'listView\')">List View</button>' : ''}
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
  if (state.activePanel === 'listView') return renderListView();
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
  const costumeImg = cat.costume && costumeMap[cat.costume] ? `<img src="assets/costumes/${costumeMap[cat.costume]}" alt="costume" class="cat-overlay costume" id="costume-${cat.costume}" />` : '';
  // Accessory overlays
  const accessoryMap = {
    scarf: 'scarf.svg',
    pumpkinHat: 'pumpkin hat.svg',
    headphone: 'headphone.svg',
    none : 'none.svg',
  };
  const accessoryImg = cat.accessory && accessoryMap[cat.accessory] ? `<img src="assets/accessories/${accessoryMap[cat.accessory]}" alt="accessory" class="cat-overlay accessory" id="accessory-${cat.accessory}" />` : '';
  // Hat overlays (reuse accessory for now)
  const decorationMap = {
    pumpkinBaby: 'pumpkin baby.svg',
    ghostBabies: 'ghost babies.svg',
    leafPile: 'leaf pile.svg',
    none : 'none.svg',
  };
  const decorationImg = cat.decoration && decorationMap[cat.decoration] ? `<img src="assets/decorations/${decorationMap[cat.decoration]}" alt="decoration" class="cat-overlay decoration" id="decoration-${cat.decoration}" />` : '';
  return `
    <div class="kitty-stack">
      <img src="assets/cats/${catImg}" alt="cat" class="cat-base" />
      ${costumeImg}
      ${accessoryImg}
      ${decorationImg}
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
              <button class="fur-color-swatch" style="background:url('assets/widget icons/ghost.svg');" onclick="window.setCostume('ghost')"></button>
              <button class="fur-color-swatch" style="background:url('assets/widget icons/vampire.svg');" onclick="window.setCostume('vampire')"></button>
              <button class="fur-color-swatch" style="background:url('assets/widget icons/candycorn.svg');" onclick="window.setCostume('candycorn')"></button>
              <button class="fur-color-swatch" style="background:url('assets/widget icons/none.svg');" onclick="window.setCostume('hidden-img')"></button>
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
              <button class="fur-color-swatch" style="background:url('assets/widget icons/scarf.svg');" onclick="window.setAccessory('scarf')"></button>
              <button class="fur-color-swatch" style="background:url('assets/widget icons/pumpkin hat.svg');" onclick="window.setAccessory('pumpkinHat')"></button>
              <button class="fur-color-swatch" style="background:url('assets/widget icons/headphone.svg');" onclick="window.setAccessory('headphone')"></button>
              <button class="fur-color-swatch" style="background:url('assets/widget icons/none.svg');" onclick="window.setAccessory('hidden-img')"></button>
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
              <button class="fur-color-swatch" style="background:url('assets/widget icons/pumpkin baby.svg');" onclick="window.setDecoration('pumpkinBaby')"></button>
              <button class="fur-color-swatch" style="background:url('assets/widget icons/ghost baby.svg');" onclick="window.setDecoration('ghostBabies')"></button>
              <button class="fur-color-swatch" style="background:url('assets/widget icons/leaf pile.svg');" onclick="window.setDecoration('leafPile')"></button>
              <button class="fur-color-swatch" style="background:url('assets/widget icons/none.svg');" onclick="window.setDecoration('hidden-img')"></button>
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
            <button class="camera-button" style="background:url('assets/widget icons/camera.svg');" onclick="window.captureCat()"></button>
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
window.setDecoration = (decoration) => {
  state.cat.decoration = decoration;
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
  const kittyStack = document.querySelector('.kitty-stack');
  if (!kittyStack) return alert('Could not find cat to capture!');
  const baseImg = kittyStack.querySelector('.cat-base');
  if (!baseImg) return alert('Could not find cat image!');
  if (!baseImg.complete) await new Promise(res => { baseImg.onload = res; });

  // Create a temporary screenshot background
  const screenshotBg = document.createElement('div');
  screenshotBg.className = 'kitty-screenshot-bg';
  screenshotBg.style.position = 'fixed';
  screenshotBg.style.left = '50%';
  screenshotBg.style.top = '50%';
  screenshotBg.style.transform = 'translate(-50%, -50%)';
  screenshotBg.style.zIndex = '9999';
  // Clone the kitty-stack
  const clone = kittyStack.cloneNode(true);
  // Copy computed width/height from original kitty-stack to clone
  const computed = window.getComputedStyle(kittyStack);
  clone.style.width = computed.width;
  clone.style.height = computed.height;
  // Move kitty and overlays down for screenshot so tall items aren't cut off
  clone.style.marginTop = '35px';
  screenshotBg.appendChild(clone);
  document.body.appendChild(screenshotBg);

  // Wait for images in clone to load
  const imgs = clone.querySelectorAll('img');
  await Promise.all(Array.from(imgs).map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; })));

  const width = screenshotBg.offsetWidth;
  const height = screenshotBg.offsetHeight;
  window.html2canvas(screenshotBg, {backgroundColor: null, width, height, scale: 1}).then(canvas => {
    // Remove the temporary screenshot background
    document.body.removeChild(screenshotBg);
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

// Ensure todoList is initialized in state.calendar
if (!state.calendar.todoList) {
  state.calendar.todoList = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  };
}

function pad2(n) { return n < 10 ? '0'+n : ''+n; }
function getTodayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}

function renderDayView() {
  const { selectedDay, selectedMonth, selectedYear, events, todoList } = state.calendar;
  const dateISO = `${selectedYear}-${pad2(selectedMonth+1)}-${pad2(selectedDay)}`;
  let html = `<div class="day-view-container">`;

  // Events section
  html += `<div class="day-view-left">`;
  html += `<div class="day-view-header">Events for ${selectedDay}/${selectedMonth+1}/${selectedYear}</div>`;
  html += `<div class="day-view-list">`;
  if (events[dateISO] && events[dateISO].length > 0) {
    for (let ev of events[dateISO]) {
      html += `<div class="day-view-event${ev.important ? ' important' : ''}">${ev.text}</div>`;
    }
  } else {
    html += `<div class="day-view-empty">No events for this day.</div>`;
  }
  html += `</div>`;
  html += `</div>`;

  // Todos section
  html += `<div class="day-view-right">`;
  html += `<div class="day-view-header">Todos for ${selectedDay}/${selectedMonth+1}/${selectedYear}</div>`;
  html += `<div class="day-view-list">`;
  const dayName = new Date(selectedYear, selectedMonth, selectedDay).toLocaleString('en-US', { weekday: 'long' });
  const todos = todoList[dayName] || [];
  if (todos.length > 0) {
    for (let todo of todos) {
      html += `<div class="day-view-todo${todo.done ? ' done' : ''}">${todo.text}</div>`;
    }
  } else {
    html += `<div class="day-view-empty">No todos for this day.</div>`;
  }
  html += `</div>`;
  html += `</div>`;

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

  let html = `<div class="calendar-nav-container">
    <button class="calendar-nav-btn" onclick="window.prevMonth()">
      <img src="assets/icons/back circle.svg" alt="Previous Month" />
    </button>
    <button class="calendar-nav-btn" onclick="window.nextMonth()">
      <img src="assets/icons/right circle.svg" alt="Next Month" />
    </button>
  </div>`;

  html += `<div class="calendar-header-row">
    <div class="calendar-month-label">${monthNames[month]} ${year}</div>
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
  // Group tasks by date (YYYY-MM-DD)
  if (!state.todoListByDate) state.todoListByDate = {};
  // UI for adding a task
  let html = `
    <div class="todo-header-row">
      <button class="todo-add-btn" onclick="window.showAddTask()" title="Add Task"><img src="assets/icons/add.svg" alt="Add" /></button>
      <button class="todo-clear-btn" onclick="window.clearTasks()" title="Clear All"><img src="assets/icons/delete.svg" alt="Delete" /></button>
    </div>
    <div class="todo-list-scroll">
  `;
  // Sort dates descending (most recent first)
  const dates = Object.keys(state.todoListByDate).sort((a, b) => new Date(b) - new Date(a));
  dates.forEach((date, idx) => {
    const tasks = state.todoListByDate[date] || [];
    if (tasks.length === 0) return;
    // Format date as readable string
    const d = new Date(date);
    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
    if (idx > 0) html += '<hr class="todo-day-divider">';
    html += `<div class="todo-day-group"><div class="todo-day-label">${dateLabel}</div>`;
    for (let i = 0; i < tasks.length; ++i) {
      const task = tasks[i];
      html += `
        <div class="todo-task-row">
          <button class="todo-check-btn${task.done ? ' checked' : ''}" onclick="window.toggleTaskByDate('${date}',${i})" aria-label="Check">
            ${task.done ? '<span class="todo-checkmark">✔</span>' : ''}
          </button>
          <span class="todo-task-label${task.done ? ' done' : ''}">${task.text}</span>
        </div>
      `;
    }
    html += '</div>';
  });
  html += '</div>';
  // Add task modal (hidden by default)
  html += `
    <div id="todo-add-modal" class="todo-modal" style="display:none;">
      <div class="todo-modal-content">
        <label for="todo-date-input">Date:</label>
        <input id="todo-date-input" type="date" />
        <input id="todo-task-input" type="text" maxlength="60" placeholder="Enter task..." />
        <button onclick="window.addTaskByDate()">Add</button>
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
window.addTaskByDate = () => {
  const date = document.getElementById('todo-date-input').value;
  const text = document.getElementById('todo-task-input').value.trim();
  if (!date || !text) return;
  if (!state.todoListByDate) state.todoListByDate = {};
  if (!state.todoListByDate[date]) state.todoListByDate[date] = [];
  state.todoListByDate[date].push({ text, done: false });
  saveState();
  render();
  window.hideAddTask();
};
window.toggleTaskByDate = (date, idx) => {
  state.todoListByDate[date][idx].done = !state.todoListByDate[date][idx].done;
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

function renderListView() {
  const { events, todoList } = state.calendar;
  const dateISO = `${state.calendar.selectedYear}-${pad2(state.calendar.selectedMonth+1)}-${pad2(state.calendar.selectedDay)}`;
  const dayName = new Date(state.calendar.selectedYear, state.calendar.selectedMonth, state.calendar.selectedDay).toLocaleString('en-US', { weekday: 'long' });

  let html = `<div class="list-view-container">`;
  html += `<div class="list-view-flex">`;
  // Events section
  html += `<div class="list-view-left">`;
  html += `<div class="list-view-header">${state.calendar.selectedDay}/${state.calendar.selectedMonth+1}/${state.calendar.selectedYear}</div>`;
  html += `<div class="list-view-list">`;
  if (events[dateISO] && events[dateISO].length > 0) {
    for (let ev of events[dateISO]) {
      html += `<div class="list-view-event${ev.important ? ' important' : ''}">${ev.text}</div>`;
    }
  } else {
    html += `<div class="list-view-empty">No events for this day.</div>`;
  }
  html += `</div>`;
  html += `</div>`;
  // Divider
  html += `<div class="list-view-divider"></div>`;
  // Todos section
  html += `<div class="list-view-right">`;
  html += `<div class="list-view-header">Todos</div>`;
  html += `<div class="list-view-list">`;
  const todos = todoList[dayName] || [];
  if (todos.length > 0) {
    for (let todo of todos) {
      html += `<div class="list-view-todo${todo.done ? ' done' : ''}">${todo.text}</div>`;
    }
  } else {
    html += `<div class="list-view-empty">No todos for this day.</div>`;
  }
  html += `</div>`;
  html += `</div>`;
  html += `</div>`; // end list-view-flex
  html += `</div>`;
  return html;
}

render();
