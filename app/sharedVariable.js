const electron = require('electron')
const { STATUS: BatteryStatus } = require('macos-battery-level')

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

const isShowEstimate = ({ batteryStatus: status }) => (
  ((global.config.batteryEstimate && status === BatteryStatus.DISCHARGING) ||
    (global.config.chargingEstimate && (status === BatteryStatus.CHARGING || status === BatteryStatus.CHARGED))) &&
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

module.exports = {
  windowEstimateWidth,
  windowHeight,
  windowPosition,
  windowWidth,
  themePreset,
  getPosition,
}