const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 877,
    height: 657,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('index.html');

  // Handle save-cat-image from renderer
  ipcMain.handle('save-cat-image', async (event, buffer) => {
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      title: 'Save Your Cat Photo',
      defaultPath: 'my-cat.png',
      filters: [{ name: 'PNG Image', extensions: ['png'] }]
    });
    if (!canceled && filePath) {
      fs.writeFileSync(filePath, buffer);
    }
  });
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
