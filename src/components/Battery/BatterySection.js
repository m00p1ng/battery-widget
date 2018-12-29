import React from 'react'
import { STATUS as BatteryStatus } from 'macos-battery-level'

import BatteryIcon from './BatteryIcon'
import '../../assets/styles.css'

const notShowStatus = [
  BatteryStatus.AC_ATTACHED,
  BatteryStatus.FINISHING_CHARGE,
  BatteryStatus.CHARGED,
]

const renderEstimateText = (estimate, status) => {
  if (notShowStatus.includes(status)) {
    return ''
  } else {
    const time = estimate.split(' ')[0]
    return `(${time})`
  }
}

const isShowEstimate = ({ showBatteryEstimate, showChargeEstimate, status }) => (
  ((showBatteryEstimate && status === BatteryStatus.DISCHARGING) ||
    (showChargeEstimate && (status === BatteryStatus.CHARGING || status === BatteryStatus.CHARGED))) &&
  (!notShowStatus.includes(status))
)

const BatterySection = ({ battery, showBatteryEstimate, showChargeEstimate }) => {
  const { percentage, status, estimate } = battery
  return (
    <div className="battery-wrapper">
      <BatteryIcon
        percentage={percentage}
        estimate={estimate}
        status={status}
      />

      <span id="battery-percent">
        {percentage}%
      </span>
      {isShowEstimate({ showBatteryEstimate, showChargeEstimate, status }) ?
        <span id="battery-estimate">
          {renderEstimateText(estimate, status)}
        </span> : null
      }
    </div>
  )
}

export default BatterySection