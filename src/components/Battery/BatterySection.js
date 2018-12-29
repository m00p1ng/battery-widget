import React from 'react'

import BatteryIcon from './BatteryIcon'
import '../../assets/styles.css'

const BatterySection = ({ battery, showEstimate, fontColor }) => {
  const { percentage, estimate, source, status } = battery

  return (
    <div id="battery-wrapper">
      <BatteryIcon
        percentage={percentage}
        source={source}
        status={status}
        fontColor={fontColor}
      />
      <span id="battery-percent">{percentage}%</span>
      {showEstimate && (
        <span id="battery-estimate">
          ({estimate.split(' ')[0]})
        </span>
      )}
    </div>
  )
}

export default BatterySection