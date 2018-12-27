const electron = require('electron')
const { app, BrowserWindow, MenuItem, Menu } = electron
const settings = require('electron-settings');
const BatteryLevel = require('macos-battery-level')
const path = require('path')

let mainWindow
const windowHeight = 34
const windowWidth = 180
const windowEstimateWidth = 220;
const windowPosition = {
  TOP_LEFT: 0,
  TOP_RIGHT: 1,
  BOTTOM_LEFT: 2,
  BOTTOM_RIGHT: 3,
}

let lastStatus = ''
let currentPosition
let showBatteryEstimate
let showChargeEstimate

const createWindow = () => {
  initSetting()

  app.setName('Battery Widget')
  mainWindow = new BrowserWindow({
    ...getPosition({ position: currentPosition, batteryStatus: '' }),
    height: windowHeight,
    focusable: false,
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

const createContextMenu = () => {
  const menu = new Menu()
  const positionName = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right']

  Object.values(windowPosition).forEach((pos) => {
    menu.append(new MenuItem({
      label: positionName[pos],
      click: () => {
        mainWindow.setBounds(getPosition({
          position: pos,
          batteryStatus: lastStatus,
        }))
        currentPosition = pos
        settings.set('position', pos)
      }
    }))
  })

  menu.append(new MenuItem({ type: 'separator' }))
  menu.append(new MenuItem({
    label: 'Show Estimate',
    enabled: false,
  }))
  menu.append(new MenuItem({
    label: 'Battery Time',
    type: 'checkbox',
    checked: showBatteryEstimate,
    click: () => {
      showBatteryEstimate = !showBatteryEstimate
      settings.set('estimate.battery', showBatteryEstimate)
      mainWindow.webContents.send('show-battery-estimate', showBatteryEstimate)
      mainWindow.setBounds(getPosition({
        currentPosition,
        batteryStatus: lastStatus,
      }))
    }
  }))

  menu.append(new MenuItem({
    label: 'Charging Time',
    type: 'checkbox',
    checked: showChargeEstimate,
    click: () => {
      showChargeEstimate = !showChargeEstimate
      settings.set('estimate.charging', showChargeEstimate)
      mainWindow.webContents.send('show-charge-estimate', showChargeEstimate)
      mainWindow.setBounds(getPosition({
        currentPosition,
        batteryStatus: lastStatus,
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

  mainWindow.webContents.on('context-menu', () => {
    menu.popup()
  })
}

const isShowEstimate = ({ batteryStatus: status }) => (
  (showBatteryEstimate && status === 'discharging') ||
  (showChargeEstimate && (status === 'charging' || status === 'charged'))
)

const getPosition = ({ position, batteryStatus }) => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  const showEstimate = isShowEstimate({ batteryStatus })

  switch (position) {
    case windowPosition.TOP_LEFT:
      if (showEstimate) {
        return { x: 0, y: 0, width: windowEstimateWidth }
      } else {
        return { x: 0, y: 0, width: windowWidth }
      }
    case windowPosition.TOP_RIGHT:
      if (showEstimate) {
        return { x: width - windowEstimateWidth, y: 0, width: windowEstimateWidth }
      } else {
        return { x: width - windowWidth, y: 0, width: windowWidth }
      }
    case windowPosition.BOTTOM_LEFT:
      if (showEstimate) {
        return { x: 0, y: height - windowHeight, width: windowEstimateWidth }
      } else {
        return { x: 0, y: height - windowHeight, width: windowWidth }
      }
    case windowPosition.BOTTOM_RIGHT:
    default:
      if (showEstimate) {
        return { x: width - windowEstimateWidth, y: height - windowHeight, width: windowEstimateWidth }
      } else {
        return { x: width - windowWidth, y: height - windowHeight, width: windowWidth }
      }
  }
}

const initSetting = () => {
  if (!settings.has('estimate')) {
    settings.set('estimate', {
      battery: false,
      charging: false,
    })
  }

  if (!settings.has('position')) {
    settings.set('position', windowPosition.BOTTOM_RIGHT)
  }

  currentPosition = settings.get('position')
  showBatteryEstimate = settings.get('estimate.battery')
  showChargeEstimate = settings.get('estimate.charging')
}

app.on('ready', () => {
  createWindow()
  const URL = (process.env.NODE_ENV !== 'development') ?
    `file://${path.join(__dirname, './build/index.html')}` :
    `http://localhost:3000/`

  mainWindow.loadURL(URL)

  mainWindow.webContents.on('did-finish-load', () => {
    createContextMenu()
    app.dock.hide()
    mainWindow.webContents.send('show-charge-estimate', showChargeEstimate)
    mainWindow.webContents.send('show-battery-estimate', showBatteryEstimate)

    BatteryLevel().subscribe((result) => {
      mainWindow.webContents.send('battery-level', result)
      const { status } = result

      if (status !== lastStatus) {
        mainWindow.setBounds(getPosition({
          position: currentPosition,
          batteryStatus: status,
        }))
      }
      lastStatus = status
    }, () => { })
  })
})