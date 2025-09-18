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
      furColor: 'purple',
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
  app.innerHTML = `
    <div class="left-panel">
      <div class="kitty-container">
        ${renderCat(state.cat)}
      </div>
      <div class="toggle-buttons">
        <button class="circle-btn${state.activePanel==='dressup' ? ' active' : ''}" title="Dress Up" onclick="window.setPanel('dressup')">🐾</button>
        <button class="circle-btn${state.activePanel==='calendar' ? ' active' : ''}" title="Calendar" onclick="window.setPanel('calendar')">📅</button>
        <button class="circle-btn${state.activePanel==='todo' ? ' active' : ''}" title="Todo List" onclick="window.setPanel('todo')">📝</button>
      </div>
    </div>
    <div class="right-panel">
      ${renderPanel()}
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
    purple: 'purple cat.png',
    orange: 'orange cat.png',
    gray: 'gray cat.png',
    white: 'cream cat.png',
    black: 'black cat.png',
    yellow: 'yellow cat.png',
    green: 'green cat.png',
    cinnamon: 'cinnamon cat.png',
  };
  const catImg = colorMap[cat.furColor] || 'purple cat.png';
  // Costume overlays
  const costumeMap = {
    vampire: 'vampire.png',
    ghost: 'ghost.png',
    candycorn: 'candycorn.png',
  };
  const costumeImg = cat.costume && costumeMap[cat.costume] ? `<img src="assets/costumes/${costumeMap[cat.costume]}" alt="costume" class="cat-overlay costume" />` : '';
  // Accessory overlays
  const accessoryMap = {
    scarf: 'scarf.png',
    pumpkinhat: 'pumpkin hat.png',
    headphone: 'headphone.png',
  };
  const accessoryImg = cat.accessory && accessoryMap[cat.accessory] ? `<img src="assets/accessories/${accessoryMap[cat.accessory]}" alt="accessory" class="cat-overlay accessory" />` : '';
  // Hat overlays (reuse accessory for now)
  const hatMap = {
    'pumpkin hat': 'pumpkin hat.png',
    'scarf': 'scarf.png',
    'headphone': 'headphone.png',
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
  let html = `<h2>Dress Up Your Cat (${state.dressupStep}/5)</h2>`;
  switch(state.dressupStep) {
    case 1:
      html += `<label>Fur Color:
        <select onchange="window.setFurColor(this.value)">
          <option value="purple"${state.cat.furColor==='purple'?' selected':''}>Purple</option>
          <option value="orange"${state.cat.furColor==='orange'?' selected':''}>Orange</option>
          <option value="gray"${state.cat.furColor==='gray'?' selected':''}>Gray</option>
          <option value="white"${state.cat.furColor==='white'?' selected':''}>White (Cream)</option>
          <option value="black"${state.cat.furColor==='black'?' selected':''}>Black</option>
          <option value="yellow"${state.cat.furColor==='yellow'?' selected':''}>Yellow</option>
          <option value="green"${state.cat.furColor==='green'?' selected':''}>Green</option>
          <option value="cinnamon"${state.cat.furColor==='cinnamon'?' selected':''}>Cinnamon</option>
        </select>
      </label>`;
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
      html += `<label>Eyes:
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
  return `<h2>Calendar (Coming Soon)</h2><p>Your calendar will appear here.</p>`;
}
function renderTodo() {
  return `<h2>Todo List (Coming Soon)</h2><p>Your todo list will appear here.</p>`;
}

render();
