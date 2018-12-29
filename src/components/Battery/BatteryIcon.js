import React from 'react'

import Lightning from './Lightning'
import BatteryOutline from './BatteryOutline'
import Percentage from './Percentage'

const Battery = ({ percentage, source }) => (
  <svg id="battery-icon"
    width="33px"
    height="18px"
    viewBox="0 0 129 70"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <title>Battery</title>
    <defs>
      <rect id="path-1" x="112" y="19" width="12" height="22" />
    </defs>
    <g id="Battery" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <Percentage percent={percentage} />
      <BatteryOutline />
      {source === 'Power Adapter' && <Lightning />}
    </g>
  </svg>
)

export default Battery