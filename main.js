const electron = require('electron')
const { app, BrowserWindow, MenuItem, Menu } = electron
const BatteryLevel = require('macos-battery-level')
const path = require('path')

let mainWindow
const windowHeight = 35
const windowWidth = 180

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  app.dock.hide();
  app.setName("Battery Widget")
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: width,
    y: height,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      backgroundThrottling: false,
    },
    hasShadow: false,
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
  const URL = (process.env.NODE_ENV !== 'development') ?
    `file://${path.join(__dirname, './build/index.html')}` :
    `http://localhost:3000/`

  mainWindow.loadURL(URL)

  mainWindow.webContents.on('did-finish-load', () => {
    BatteryLevel().subscribe(percent => {
      mainWindow.webContents.send('battery-level', percent)
    })
  })

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  const menu = new Menu()
  menu.append(new MenuItem({
    label: "Top Left",
    click: () => {
      mainWindow.setPosition(0, 0)
    }
  }))
  menu.append(new MenuItem({
    label: "Top Right",
    click: () => {
      mainWindow.setPosition(width - windowWidth, 0)
    }
  }))
  menu.append(new MenuItem({
    label: "Bottom Left",
    click: () => {
      mainWindow.setPosition(0, height - windowHeight)
    }
  }))
  menu.append(new MenuItem({
    label: "Bottom Right",
    click: () => {
      mainWindow.setPosition(width - windowWidth, height - windowHeight)
    }
  }))
  menu.append(new MenuItem({ type: 'separator' }))
  menu.append(new MenuItem({
    label: "Quit",
    click: () => {
      app.quit()
    }
  }))

  mainWindow.webContents.on('context-menu', (event) => {
    menu.popup()
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
