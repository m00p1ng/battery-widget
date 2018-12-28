const electron = require('electron')
const { app, BrowserWindow } = electron
const BatteryLevel = require('macos-battery-level')
const path = require('path')
const createContextMenu = require('./app/contextMenu')
const initSetting = require('./app/settings')
const {
  windowHeight,
  getPosition,
} = require('./app/sharedVariable')

let mainWindow
global.lastStatus = null
global.config = null

const createWindow = () => {
  app.setName('Battery Widget')
  mainWindow = new BrowserWindow({
    ...getPosition({ position: global.config.position, batteryStatus: '' }),
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
    vibrancy: global.config.transparent ? global.config.theme : null,
  })

  mainWindow.setVisibleOnAllWorkspaces(true)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  global.config = initSetting()
  createWindow()
  const URL = (process.env.NODE_ENV !== 'development') ?
    `file://${path.join(__dirname, './build/index.html')}` :
    `http://localhost:3000/`

  mainWindow.loadURL(URL)

  mainWindow.webContents.on('did-finish-load', () => {
    createContextMenu({ mainWindow })
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
        }))
      }
      global.lastStatus = status
    }, () => { })
  })
})