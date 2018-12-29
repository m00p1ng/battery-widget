import React from 'react'

import BatteryIcon from './BatteryIcon'
import '../../assets/styles.css'

const BatterySection = ({ battery, showEstimate }) => {
  const { percentage, estimate, source } = battery

  return (
    <div className="battery-wrapper">
      <BatteryIcon
        percentage={percentage}
        source={source}
      />
      <span id="battery-percent">{percentage}%</span>
      {showEstimate && (
        <span id="battery-estimate">
          {showEstimate && `(${estimate.split(' ')[0]})`}
        </span>
      )}
    </div>
  )
}

export default BatterySection