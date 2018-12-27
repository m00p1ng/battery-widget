import React from 'react'

import Battery from './Battery'
import '../assets/styles.css'

const renderEstimateText = (estimate, status) => {
  const notShowStatus = ['AC attached', 'finishing charge']

  if (notShowStatus.includes(status)) {
    return ''
  } else if (estimate.includes("no estimate") || estimate.includes("not charging")) {
    return "(-:--)"
  } else {
    const time = estimate.split(' ')[0]
    return `(${time})`
  }
}

const isShowEstimate = ({ showBatteryEstimate, showChargeEstimate, status }) => {
  return (showBatteryEstimate && status === 'discharging') ||
    (showChargeEstimate && (status === 'charging' || status === 'charged'))
}

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