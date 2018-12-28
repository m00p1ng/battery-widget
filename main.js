const electron = require('electron')
const { app, BrowserWindow } = electron
const BatteryLevel = require('macos-battery-level')
const path = require('path')
const createContextMenu = require('./app/contextMenu')
const settings = require('electron-settings')
const initSetting = require('./app/settings')
const {
  windowHeight,
  getPosition,
} = require('./app/sharedVariable')

let mainWindow

const createWindow = () => {
  app.setName('Battery Widget')
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
    height: windowHeight,
    focusable: false,
    resizable: false,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
    },
    frame: false,
    vibrancy: global.config.theme,
  })

  mainWindow.setVisibleOnAllWorkspaces(true)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('before-quit', () => {
  const [x, y] = mainWindow.getPosition()
  settings.set('x', x)
  settings.set('y', y)
})

app.on('ready', () => {
  global.config = initSetting()
  createWindow()
  const URL = (process.env.NODE_ENV !== 'development') ?
    `file://${path.join(__dirname, './build/index.html')}` :
    `http://localhost:3000/`

  mainWindow.loadURL(URL)

  mainWindow.webContents.on('did-finish-load', () => {
    createContextMenu(mainWindow)
    app.dock.hide()
    mainWindow.webContents.send('show-chargingEstimate', global.config.chargingEstimate)
    mainWindow.webContents.send('show-batteryEstimate', global.config.batteryEstimate)

    BatteryLevel().subscribe((result) => {
      mainWindow.webContents.send('battery', result)
      const { status } = result

      if (status !== global.lastStatus) {
        mainWindow.setBounds(getPosition({
          position: global.config.position,
          batteryStatus: status,
          customPosition: {
            x: global.config.x,
            y: global.config.y,
          }
        }))
      }
      global.lastStatus = status
    }, () => { })
  })
})