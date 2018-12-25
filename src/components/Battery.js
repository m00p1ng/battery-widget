import React from 'react'

import NormalBattery from './NormalBattery'
import ChargingBattery from './ChargingBattery'

import '../assets/styles.css'

const renderBattery = (percent, status) => {
  if (status === 'charging' || status === 'charged') {
    return <ChargingBattery percentage={percent} />
  }
  return <NormalBattery percentage={percent} />
}

const Battery = ({ battery }) => {
  const { percentage, status } = battery
  return (
    <div className="battery-wrapper">
      {renderBattery(percentage, status)}
      <span id="battery-percent">{percentage}%</span>
    </div>
  )
}

export default Battery