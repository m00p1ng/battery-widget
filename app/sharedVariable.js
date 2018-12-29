const electron = require('electron')
const { STATUS: BatteryStatus } = require('macos-battery-level')

const windowHeight = 34
const windowTimerHeight = 120
const windowWidth = 180
const windowEstimateWidth = 220;
const windowPosition = {
  TOP_LEFT: 0,
  TOP_RIGHT: 1,
  BOTTOM_LEFT: 2,
  BOTTOM_RIGHT: 3,
  CUSTOM: 4,
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

const getPosition = ({ position, batteryStatus, customPosition, timerEnable }) => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  const showEstimate = isShowEstimate({ batteryStatus })
  const currentHeight = timerEnable ? windowTimerHeight : windowHeight

  switch (position) {
    case windowPosition.CUSTOM:
      if (showEstimate) {
        return {
          x: customPosition.x,
          y: customPosition.y,
          width: windowEstimateWidth,
          height: currentHeight,
        }
      } else {
        return {
          x: customPosition.x,
          y: customPosition.y,
          width: windowWidth,
          height: currentHeight,
        }
      }
    case windowPosition.TOP_LEFT:
      if (showEstimate) {
        return {
          x: 0,
          y: 0,
          width: windowEstimateWidth,
          height: currentHeight,
        }
      } else {
        return {
          x: 0,
          y: 0,
          width: windowWidth,
          height: currentHeight,
        }
      }
    case windowPosition.TOP_RIGHT:
      if (showEstimate) {
        return {
          x: width - windowEstimateWidth,
          y: 0,
          width: windowEstimateWidth,
          height: currentHeight,
        }
      } else {
        return {
          x: width - windowWidth,
          y: 0,
          width: windowWidth,
          height: currentHeight,
        }
      }
    case windowPosition.BOTTOM_LEFT:
      if (showEstimate) {
        return {
          x: 0,
          y: height - currentHeight,
          width: windowEstimateWidth,
          height: currentHeight,
        }
      } else {
        return {
          x: 0,
          y: height - currentHeight,
          width: windowWidth,
          height: currentHeight,
        }
      }
    case windowPosition.BOTTOM_RIGHT:
    default:
      if (showEstimate) {
        return {
          x: width - windowEstimateWidth,
          y: height - currentHeight,
          width: windowEstimateWidth,
          height: currentHeight,
        }
      } else {
        return {
          x: width - windowWidth,
          y: height - currentHeight,
          width: windowWidth,
          height: currentHeight,
        }
      }
  }
}

module.exports = {
  windowEstimateWidth,
  windowHeight,
  windowTimerHeight,
  windowPosition,
  windowWidth,
  themePreset,
  getPosition,
}