const settings = require('electron-settings');
const { windowPosition } = require('./sharedVariable')

const initSetting = () => {
  const defaultSetting = {
    batteryEstimate: false,
    chargingEstimate: false,
    position: windowPosition.BOTTOM_RIGHT,
    theme: 'ultra-dark',
    transparent: true,
    x: 0,
    y: 0,
  }

  const allSettings = settings.getAll()
  const defaultKeys = JSON.stringify(Object.keys(defaultSetting))
  const settingsKeys = JSON.stringify(Object.keys(allSettings))

  if (defaultKeys !== settingsKeys) {
    settings.deleteAll()
    settings.setAll(defaultSetting)
    return defaultSetting
  } else {
    return allSettings
  }
}

module.exports = initSetting