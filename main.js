const electron = require('electron')
const { app, BrowserWindow } = electron
const BatteryLevel = require('macos-battery-level')

let mainWindow

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  console.log(width, height)
  app.dock.hide();
  mainWindow = new BrowserWindow({
    width: 150,
    height: 35,
    x: width,
    y: height,
    alwaysOnTop: true,
    webPreferences: {
      backgroundThrottling: false,
    },
    frame: false,
    vibrancy: 'ultra-dark',
  })

  mainWindow.setVisibleOnAllWorkspaces(true)

  mainWindow.loadURL(`http://localhost:3000/`)

  mainWindow.webContents.on('did-finish-load', () => {
    BatteryLevel().subscribe(percent => {
      mainWindow.webContents.send('battery-level', percent)
    })
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
