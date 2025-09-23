const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');


function createWindow() {
  const win = new BrowserWindow({
    width: 877,
    height: 657,
    icon: path.join(__dirname, 'assets', 'kitty icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Optional: IPC for saving cat image
ipcMain.handle('save-cat-image', async (event, buffer) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save Cat Image',
    defaultPath: 'my-cat.png',
    filters: [{ name: 'PNG Image', extensions: ['png'] }]
  });
  if (!canceled && filePath) {
    require('fs').writeFileSync(filePath, buffer);
  }
});


