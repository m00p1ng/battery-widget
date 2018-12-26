const electron = require('electron')
const { app, BrowserWindow, MenuItem, Menu } = electron
const BatteryLevel = require('macos-battery-level')
const path = require('path')

let mainWindow
const windowHeight = 32
const windowWidth = 180

const windowEstimateWidth = 210;

const createWindow = () => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  app.dock.hide();
  app.setName("Battery Widget")
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

const getPosition = (position, batteryStatus) => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  switch (position) {
    case "Top Left":
      if (batteryStatus === 'discharging') {
        return { x: 0, y: 0, width: windowEstimateWidth }
      } else {
        return { x: 0, y: 0, width: windowWidth }
      }
    case "Top Right":
      if (batteryStatus === 'discharging') {
        return { x: width - windowEstimateWidth, y: 0, width: windowEstimateWidth }
      } else {
        return { x: width - windowWidth, y: 0, width: windowWidth }
      }
    case "Bottom Left":
      if (batteryStatus === 'discharging') {
        return { x: 0, y: height - windowHeight, width: windowEstimateWidth }
      } else {
        return { x: 0, y: height - windowHeight, width: windowWidth }
      }
    case "Bottom Right":
    default:
      if (batteryStatus === 'discharging') {
        return { x: width - windowEstimateWidth, y: height - windowHeight, width: windowEstimateWidth }
      } else {
        return { x: width - windowWidth, y: height - windowHeight, width: windowWidth }
      }
  }
}

app.on('ready', () => {
  let lastStatus = ''
  let currentPostion = "Bottom Right"

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
        mainWindow.setBounds(getPosition(currentPostion, status))
      }
      lastStatus = status
    })
  })

  const menu = new Menu()
  menu.append(new MenuItem({
    label: "Top Left",
    click: () => {
      mainWindow.setBounds(getPosition("Top Left", lastStatus))
      currentPostion = "Top Left"
    }
  }))
  menu.append(new MenuItem({
    label: "Top Right",
    click: () => {
      mainWindow.setBounds(getPosition("Top Right", lastStatus))
      currentPostion = "Top Right"
    }
  }))
  menu.append(new MenuItem({
    label: "Bottom Left",
    click: () => {
      mainWindow.setBounds(getPosition("Bottom Left", lastStatus))
      currentPostion = "Bottom Left"
    }
  }))
  menu.append(new MenuItem({
    label: "Bottom Right",
    click: () => {
      mainWindow.setBounds(getPosition("Bottom Right", lastStatus))
      currentPostion = "Bottom Right"
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
