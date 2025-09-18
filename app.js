// Main renderer logic for Cozy Cat Planner
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
  };
  const costumeImg = cat.costume && costumeMap[cat.costume] ? `<img src="assets/costumes/${costumeMap[cat.costume]}" alt="costume" class="cat-overlay costume" />` : '';
  // Accessory overlays
  const accessoryMap = {
    scarf: 'scarf.svg',
    pumpkinhat: 'pumpkin hat.svg',
    headphone: 'headphone.svg',
  };
  const accessoryImg = cat.accessory && accessoryMap[cat.accessory] ? `<img src="assets/accessories/${accessoryMap[cat.accessory]}" alt="accessory" class="cat-overlay accessory" />` : '';
  // Hat overlays (reuse accessory for now)
  const hatMap = {
    'pumpkin hat': 'pumpkin hat.svg',
    'scarf': 'scarf.svg',
    'headphone': 'headphone.svg',
  };
  const hatImg = cat.hat && hatMap[cat.hat] ? `<img src="assets/accessories/${hatMap[cat.hat]}" alt="hat" class="cat-overlay hat" />` : '';
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
        <div class="fur-color-row">
          ${[
            {name: 'purple', color: '#392951'},
            {name: 'orange', color: '#E07A5F'},
            {name: 'yellow', color: '#FFCE3A'},
            {name: 'green', color: '#71A767'},
            {name: 'gray', color: '#4F4141'},
            {name: 'black', color: '#150E17'},
            {name: 'cinnamon', color: '#CE4D4D'},
            {name: 'white', color: '#FFF4E6'}
          ].map(opt =>
            `<button class="fur-color-swatch${state.cat.furColor===opt.name?' selected':''}" style="background:${opt.color};" onclick="window.setFurColor('${opt.name}')" ${opt.disabled?'disabled':''}></button>`
          ).join('')}
        </div>
      `;
      break;
    case 2:
      html += `<label>Costume:
        <select onchange="window.setCostume(this.value)">
          <option value="">None</option>
          <option value="vampire"${state.cat.costume==='vampire'?' selected':''}>Vampire</option>
          <option value="ghost"${state.cat.costume==='ghost'?' selected':''}>Ghost</option>
          <option value="candycorn"${state.cat.costume==='candycorn'?' selected':''}>Candy Corn</option>
        </select>
      </label>`;
      break;
    case 3:
      html += `<label>Accessory:
        <select onchange="window.setAccessory(this.value)">
          <option value="">None</option>
          <option value="scarf"${state.cat.accessory==='scarf'?' selected':''}>Scarf</option>
          <option value="pumpkinhat"${state.cat.accessory==='pumpkinhat'?' selected':''}>Pumpkin Hat</option>
          <option value="headphone"${state.cat.accessory==='headphone'?' selected':''}>Headphone</option>
        </select>
      </label>`;
      break;
    case 4:
      html += `<label>Decorations:
        <select onchange="window.setEyes(this.value)">
          <option value="">Default</option>
          <option value="happy"${state.cat.eyes==='happy'?' selected':''}>Happy</option>
          <option value="sleepy"${state.cat.eyes==='sleepy'?' selected':''}>Sleepy</option>
          <option value="mischief"${state.cat.eyes==='mischief'?' selected':''}>Mischief</option>
        </select>
      </label>`;
      break;
    case 5:
      html += `<label>Hat:
        <select onchange="window.setHat(this.value)">
          <option value="">None</option>
          <option value="pumpkin hat"${state.cat.hat==='pumpkin hat'?' selected':''}>Pumpkin Hat</option>
          <option value="scarf"${state.cat.hat==='scarf'?' selected':''}>Scarf</option>
          <option value="headphone"${state.cat.hat==='headphone'?' selected':''}>Headphone</option>
        </select>
      </label><br><br>
      <button onclick="window.captureCat()">📸 Capture Cat</button>`;
      break;
  }
  html += '<div style="margin-top:32px">';
  if (state.dressupStep > 1) {
    html += `<button onclick="window.prevDressup()">Back</button> `;
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

function renderCalendar() {
  return `<p>Your calendar will appear here.</p>`;
}


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
