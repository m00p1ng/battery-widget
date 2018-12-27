const electron = require('electron')
const { app, BrowserWindow, MenuItem, Menu } = electron
const BatteryLevel = require('macos-battery-level')
const path = require('path')

let mainWindow
const windowHeight = 34
const windowWidth = 180
const windowEstimateWidth = 220;

const createWindow = () => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  app.setName('Battery Widget')
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    focusable: false,
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

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

const isShowEstimate = ({ showBatteryEstimate, showChargeEstimate, batteryStatus: status }) => {
  return ((showBatteryEstimate && status === 'discharging')) ||
    (showChargeEstimate && (status === 'charging' || status === 'charged'))
}

const getPosition = ({ position, batteryStatus, showBatteryEstimate, showChargeEstimate }) => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  const condition = {
    showBatteryEstimate,
    showChargeEstimate,
    batteryStatus,
  }

  switch (position) {
    case 'Top Left':
      if (isShowEstimate(condition)) {
        return { x: 0, y: 0, width: windowEstimateWidth }
      } else {
        return { x: 0, y: 0, width: windowWidth }
      }
    case 'Top Right':
      if (isShowEstimate(condition)) {
        return { x: width - windowEstimateWidth, y: 0, width: windowEstimateWidth }
      } else {
        return { x: width - windowWidth, y: 0, width: windowWidth }
      }
    case 'Bottom Left':
      if (isShowEstimate(condition)) {
        return { x: 0, y: height - windowHeight, width: windowEstimateWidth }
      } else {
        return { x: 0, y: height - windowHeight, width: windowWidth }
      }
    case 'Bottom Right':
    default:
      if (isShowEstimate(condition)) {
        return { x: width - windowEstimateWidth, y: height - windowHeight, width: windowEstimateWidth }
      } else {
        return { x: width - windowWidth, y: height - windowHeight, width: windowWidth }
      }
  }
}

app.on('ready', () => {
  let lastStatus = 'charged'
  let currentPosition = 'Bottom Right'

  let showBatteryEstimate = false
  let showChargeEstimate = false

  createWindow()
  const URL = (process.env.NODE_ENV !== 'development') ?
    `file://${path.join(__dirname, './build/index.html')}` :
    `http://localhost:3000/`

  mainWindow.loadURL(URL)

  mainWindow.webContents.on('did-finish-load', () => {
    BatteryLevel().subscribe(result => {
      mainWindow.webContents.send('battery-level', result)
      const { status } = result

      if (status !== lastStatus) {
        mainWindow.setBounds(getPosition({
          currentPosition,
          batteryStatus: status,
          showBatteryEstimate,
          showChargeEstimate,
        }))
      }
      lastStatus = status
    })
    app.dock.hide()
  })

  const menu = new Menu()
  const position = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right']

  position.forEach((pos) => {
    menu.append(new MenuItem({
      label: pos,
      click: () => {
        mainWindow.setBounds(getPosition({
          pos,
          batteryStatus: lastStatus,
          showBatteryEstimate,
          showChargeEstimate,
        }))
        currentPosition = pos
      }
    }))
  })

  mainWindow.webContents.on('did-finish-load', () => {
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: 'Show Estimate',
      enabled: false,
    }))
    menu.append(new MenuItem({
      label: 'Battery Time',
      type: 'checkbox',
      click: () => {
        showBatteryEstimate = !showBatteryEstimate
        mainWindow.webContents.send('show-battery-estimate', showBatteryEstimate)
        mainWindow.setBounds(getPosition({
          currentPosition,
          batteryStatus: lastStatus,
          showBatteryEstimate,
          showChargeEstimate
        }))
      }
    }))
    menu.append(new MenuItem({
      label: 'Charging Time',
      type: 'checkbox',
      click: () => {
        showChargeEstimate = !showChargeEstimate
        mainWindow.webContents.send('show-charge-estimate', showChargeEstimate)
        mainWindow.setBounds(getPosition({
          currentPosition,
          batteryStatus: lastStatus,
          showBatteryEstimate,
          showChargeEstimate,
        }))
      }
    }))

    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }))
  })

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
