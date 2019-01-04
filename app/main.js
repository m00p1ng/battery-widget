const electron = require('electron')
const { app, BrowserWindow } = electron
const BatteryLevel = require('macos-battery-level')
const path = require('path')
const createContextMenu = require('./contextMenu')
const settings = require('electron-settings')
const initSetting = require('./settings')
const {
  getPosition,
  windowHeight,
  windowTimerHeight,
  isShowEstimate,
  normalThemePreset,
} = require('./sharedVariable')

let mainWindow
global.timerEnable = false
global.lock = true

const createWindow = () => {
  mainWindow = new BrowserWindow({
    ...getPosition({
      position: global.config.position,
      customPosition: {
        x: global.config.x,
        y: global.config.y,
      }
    }),
    x: global.config.x,
    y: global.config.y,
    focusable: false,
    resizable: false,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
    vibrancy: global.config.theme,
    movable: false,
  })

  mainWindow.setVisibleOnAllWorkspaces(true)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('before-quit', () => {
  let [x, y] = mainWindow.getPosition()
  if (global.timerEnable) {
    y += (windowTimerHeight - windowHeight)
  }
  settings.set('position', global.config.position)
  settings.set('x', x)
  settings.set('y', y)
})

app.on('ready', () => {
  global.config = initSetting()
  createWindow()
  const URL = (process.env.NODE_ENV !== 'development') ?
    `file://${path.join(__dirname, '../build/index.html')}` :
    `http://localhost:3000/`

  mainWindow.loadURL(URL)

  mainWindow.webContents.on('did-finish-load', () => {
    createContextMenu(mainWindow)
    app.dock.hide()
    mainWindow.webContents.send('show-estimate', false)
    mainWindow.webContents.send('color-theme', normalThemePreset[global.config.color])

    BatteryLevel().subscribe(battery => {
      const { status } = battery
      const ShowEstimate = isShowEstimate({ batteryStatus: status })

      mainWindow.webContents.send('battery', battery)
      mainWindow.webContents.send('show-estimate', ShowEstimate)

      if (status !== global.lastStatus) {
        mainWindow.setBounds(getPosition({
          position: global.config.position,
          batteryStatus: status,
          customPosition: {
            x: global.config.x,
            y: global.config.y,
          },
          timerEnable: global.timerEnable,
        }))
      }
      global.lastStatus = status
    }, () => { })
  })
})