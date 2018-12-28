import React from 'react'

import Battery from './Battery'
import '../assets/styles.css'

const notShowStatus = ['AC attached', 'finishing charge', 'charged']

const renderEstimateText = (estimate, status) => {
  if (notShowStatus.includes(status)) {
    return ''
  } else {
    const time = estimate.split(' ')[0]
    return `(${time})`
  }
}

const isShowEstimate = ({ showBatteryEstimate, showChargeEstimate, status }) => (
  ((showBatteryEstimate && status === 'discharging') ||
    (showChargeEstimate && (status === 'charging' || status === 'charged'))) &&
  (!notShowStatus.includes(status))
)

const BatterySection = ({ battery, showBatteryEstimate, showChargeEstimate }) => {
  const { percentage, status, estimate } = battery
  return (
    <div className="battery-wrapper">
      <Battery
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