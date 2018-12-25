const electron = require('electron')
const { app, BrowserWindow, MenuItem, Menu } = electron
const BatteryLevel = require('macos-battery-level')

let mainWindow

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  app.dock.hide();
  mainWindow = new BrowserWindow({
    width: 180,
    height: 35,
    x: width,
    y: height,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      backgroundThrottling: false,
    },
    frame: false,
    vibrancy: 'ultra-dark',
  })

  mainWindow.setVisibleOnAllWorkspaces(true)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()

  mainWindow.loadURL(`http://localhost:3000/`)

  mainWindow.webContents.on('did-finish-load', () => {
    BatteryLevel().subscribe(percent => {
      mainWindow.webContents.send('battery-level', percent)
    })
  })

  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({
    label: "Quit",
    click: () => {
      app.quit()
    }
  }))

  mainWindow.webContents.on('context-menu', (event) => {
    ctxMenu.popup()
  })
})

app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
