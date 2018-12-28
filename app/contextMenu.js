const electron = require('electron')
const settings = require('electron-settings');
const { app, MenuItem, Menu } = electron
const {
  windowPosition,
  themePreset,
  getPosition
} = require('./sharedVariable')

const setToCurrent = (field, value) => {
  global.config[field] = value
  settings.set(field, value)
}

const createContextMenu = (mainWindow) => {
  const menu = new Menu()
  const positionName = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right']

  menu.append(new MenuItem({
    label: 'Position',
    submenu: [
      ...Object.values(windowPosition)
        .slice(0, 4)
        .map(pos => new MenuItem({
          label: positionName[pos],
          type: 'radio',
          checked: pos === global.config.position,
          click: () => {
            mainWindow.setBounds(getPosition({
              position: pos,
              batteryStatus: global.lastStatus,
            }))
            setToCurrent('position', pos)
            mainWindow.setMovable(false)
            setToCurrent('lock', true)
            menu.items[0].submenu.items[6].checked = false
          },
        })),
      new MenuItem({
        label: 'Custom',
        type: 'radio',
        checked: windowPosition.CUSTOM === global.config.position,
        click: () => {
          const [x, y] = mainWindow.getPosition()
          mainWindow.setBounds(getPosition({
            position: windowPosition.CUSTOM,
            batteryStatus: global.lastStatus,
            customPosition: { x, y },
          }))
          setToCurrent('position', windowPosition.CUSTOM)
          mainWindow.setMovable(true)
          setToCurrent('lock', false)
          menu.items[0].submenu.items[6].checked = false
        }
      }),
      new MenuItem({ type: 'separator' }),
      new MenuItem({
        label: 'Lock',
        type: 'checkbox',
        checked: global.config.lock,
        click: () => {
          setToCurrent('lock', !global.config.lock)
          mainWindow.setMovable(!global.config.lock)
        },
      }),
    ],
  }))

  menu.append(new MenuItem({
    label: 'Theme',
    submenu: Object.keys(themePreset)
      .map(themeName => new MenuItem({
        label: themePreset[themeName].name,
        type: 'radio',
        checked: themeName === global.config.theme,
        click: () => {
          mainWindow.setVibrancy(themeName)
          setToCurrent('theme', themeName)
        },
      })),
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
        checked: global.config[esMenu.field],
        click: () => {
          setToCurrent(esMenu.field, !global.config[esMenu.field])
          mainWindow.webContents.send(`show-${esMenu.field}`, global.config[esMenu.field])
          mainWindow.setBounds(getPosition({
            position: global.config.position,
            batteryStatus: global.lastStatus,
          }))
        },
      })),
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

module.exports = createContextMenu