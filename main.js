const electron = require('electron')
const { app, BrowserWindow, MenuItem, Menu } = electron
const settings = require('electron-settings');
const BatteryLevel = require('macos-battery-level')
const { STATUS: BatteryStatus } = BatteryLevel
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
const themePreset = {
  'ultra-dark': {
    name: 'Ultra Dark',
  },
  'dark': {
    name: 'Dark',
  },
  'light': {
    name: 'Light',
  },
  'medium-light': {
    name: 'Medium Light',
  }
}
const notShowStatus = [
  BatteryStatus.AC_ATTACHED,
  BatteryStatus.FINISHING_CHARGE,
  BatteryStatus.CHARGED,
]

let lastStatus = ''
let config

const setToCurrent = (field, value) => {
  config[field] = value
  settings.set(field, value)
}

const createWindow = () => {
  app.setName('Battery Widget')
  mainWindow = new BrowserWindow({
    ...getPosition({ position: config.position, batteryStatus: '' }),
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

  menu.append(new MenuItem({
    label: 'Position',
    submenu: [
      ...Object.values(windowPosition)
        .map(pos => new MenuItem({
          label: positionName[pos],
          type: 'radio',
          checked: pos === config.position,
          click: () => {
            mainWindow.setBounds(getPosition({
              position: pos,
              batteryStatus: lastStatus,
            }))
            setToCurrent('position', pos)
          }
        })),
      new MenuItem({ type: 'separator' }),
      new MenuItem({
        label: 'Lock',
        type: 'checkbox',
        checked: config.lock,
        click: () => {
          setToCurrent('lock', !config.lock)
          mainWindow.setMovable(!config.lock)
        }
      }),
    ],
  }))

  menu.append(new MenuItem({
    label: 'Theme',
    submenu: Object.keys(themePreset)
      .map(themeName => new MenuItem({
        label: themePreset[themeName].name,
        type: 'radio',
        checked: themeName === config.theme,
        click: () => {
          mainWindow.setVibrancy(themeName)
          setToCurrent('theme', themeName)
        }
      }))
  }))

  const estimateMenuList = [
    {
      name: 'Battery Time',
      field: 'batteryEstimate',
    },
    {
      name: 'Charging Time',
      field: 'chargingEstimate',
    },
  ]

  menu.append(new MenuItem({
    label: 'Estimate',
    submenu: estimateMenuList
      .map(esMenu => new MenuItem({
        label: esMenu.name,
        type: 'checkbox',
        checked: config[esMenu.field],
        click: () => {
          setToCurrent(esMenu.field, !config[esMenu.field])
          mainWindow.webContents.send(`show-${esMenu.field}`, config[esMenu.field])
          mainWindow.setBounds(getPosition({
            position: config.position,
            batteryStatus: lastStatus,
          }))
        }
      }))
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
  ((config.batteryEstimate && status === BatteryStatus.DISCHARGING) ||
    (config.chargingEstimate && (status === BatteryStatus.CHARGING || status === BatteryStatus.CHARGED))) &&
  (!notShowStatus.includes(status))
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
  const defaultSetting = {
    batteryEstimate: false,
    chargingEstimate: false,
    position: windowPosition.BOTTOM_RIGHT,
    theme: 'ultra-dark',
    transparent: true,
  }

  const allSettings = settings.getAll()
  const defaultKeys = JSON.stringify(Object.keys(defaultSetting))
  const settingsKeys = JSON.stringify(Object.keys(allSettings))

  if (defaultKeys !== settingsKeys) {
    settings.deleteAll()
    settings.setAll(defaultSetting)
    config = defaultSetting
  } else {
    config = allSettings
  }
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
    mainWindow.webContents.send('show-chargingEstimate', config.chargingEstimate)
    mainWindow.webContents.send('show-batteryEstimate', config.batteryEstimate)

    BatteryLevel().subscribe((result) => {
      mainWindow.webContents.send('battery', result)
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