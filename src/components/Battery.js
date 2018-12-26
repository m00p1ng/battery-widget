import React from 'react'

import NormalBattery from './NormalBattery'
import ChargingBattery from './ChargingBattery'
import '../assets/styles.css'

const renderBattery = (percent, status, estimate) => {
  if (status === 'charged' || status === "AC attached" ||
    (status === 'charging' && !estimate.includes("0:00 remaining"))
  ) {
    return <ChargingBattery percentage={percent} />
  }
  return <NormalBattery percentage={percent} />
}

const renderEstimateText = (estimate) => {
  if (estimate.includes("no estimate") || estimate.includes("not charg")) {
    return "(-:--)"
  } else {
    const time = estimate.split(' ')[0]
    return `(${time})`
  }
}

const Battery = ({ battery }) => {
  const { percentage, status, estimate } = battery
  return (
    <div className="battery-wrapper">
      {renderBattery(percentage, status, estimate)}
      <span id="battery-percent">
        {percentage}%
        <span id="battery-estimate">{renderEstimateText(estimate)}</span>
      </span>
    </div>
  )
}

export default Battery