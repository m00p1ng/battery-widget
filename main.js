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
let config

let themePreset = {
  'ultra-dark': {
    name: 'Ultra Dark',
    backgroundColor: '#000000',
  },
  'dark': {
    name: 'Dark',
    backgroundColor: '#000000',
  },
  'light': {
    name: 'Light',
    backgroundColor: '#FFFFFF',
  },
  'medium-light': {
    name: 'Medium Light',
    backgroundColor: '#FFFFFF',
  }
}

const createWindow = () => {
  app.setName('Battery Widget')
  mainWindow = new BrowserWindow({
    ...getPosition({ position: config.position, batteryStatus: '' }),
    height: windowHeight,
    focusable: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
    },
    frame: false,
    vibrancy: config.transparent ? config.theme : null,
    backgroundColor: config.transparent ? null : themePreset[config.theme].backgroundColor,
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
        config.position = pos
        settings.set('position', pos)
      }
    }))
  })

  menu.append(new MenuItem({ type: 'separator' }))
  menu.append(new MenuItem({
    label: 'Theme',
    enabled: false,
  }))
  Object.keys(themePreset).forEach((themeName => {
    menu.append(new MenuItem({
      label: themePreset[themeName].name,
      type: 'radio',
      checked: themeName === config.theme,
      click: () => {
        mainWindow.setVibrancy(themeName)
        config.theme = themeName
        settings.set('theme', themeName)
      }
    }))
  }))

  menu.append(new MenuItem({ type: 'separator' }))
  menu.append(new MenuItem({
    label: 'Show Estimate',
    enabled: false,
  }))
  menu.append(new MenuItem({
    label: 'Battery Time',
    type: 'checkbox',
    checked: config.batteryEstimate,
    click: () => {
      config.batteryEstimate = !config.batteryEstimate
      settings.set('batteryEstimate', config.batteryEstimate)
      mainWindow.webContents.send('show-battery-estimate', config.batteryEstimate)
      mainWindow.setBounds(getPosition({
        position: config.position,
        batteryStatus: lastStatus,
      }))
    }
  }))

  menu.append(new MenuItem({
    label: 'Charging Time',
    type: 'checkbox',
    checked: config.chargingEstimate,
    click: () => {
      config.chargingEstimate = !config.chargingEstimate
      settings.set('chargingEstimate', config.chargingEstimate)
      mainWindow.webContents.send('show-charge-estimate', config.chargingEstimate)
      mainWindow.setBounds(getPosition({
        position: config.position,
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
  (config.batteryEstimate && status === 'discharging') ||
  (config.chargingEstimate && (status === 'charging' || status === 'charged'))
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
  if (!settings.has('batteryEstimate')) {
    settings.set('batteryEstimate', false)
  }

  if (!settings.has('chargingEstimate')) {
    settings.set('chargingEstimate', false)
  }

  if (!settings.has('position')) {
    settings.set('position', windowPosition.BOTTOM_RIGHT)
  }

  if (!settings.has('theme')) {
    settings.set('theme', 'ultra-dark')
  }

  if (!settings.has('transparent')) {
    settings.set('transparent', true)
  }

  config = settings.getAll()
  console.log(config)
}

app.on('ready', () => {
  initSetting()
  createWindow()
  const URL = (process.env.NODE_ENV !== 'development') ?
    `file://${path.join(__dirname, './build/index.html')}` :
    `http://localhost:3000/`

  mainWindow.loadURL(URL)

  mainWindow.webContents.on('did-finish-load', () => {
    createContextMenu()
    app.dock.hide()
    mainWindow.webContents.send('show-charge-estimate', config.chargingEstimate)
    mainWindow.webContents.send('show-battery-estimate', config.batteryEstimate)

    BatteryLevel().subscribe((result) => {
      mainWindow.webContents.send('battery-level', result)
      const { status } = result

      if (status !== lastStatus) {
        mainWindow.setBounds(getPosition({
          position: config.position,
          batteryStatus: status,
        }))
      }
      lastStatus = status
    }, () => { })
  })
})