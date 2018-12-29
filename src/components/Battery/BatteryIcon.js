import React from 'react'
import { STATUS as BatteryStatus } from 'macos-battery-level'

import Lightning from './Lightning'
import Plug from './Plug'
import BatteryOutline from './BatteryOutline'
import Percentage from './Percentage'

const renderSymbol = (status) => (
  status === BatteryStatus.CHARGING ?
    <Lightning /> : <Plug />
)

const Battery = ({ percentage, source, status, fontColor }) => (
  <svg id="battery-icon"
    width="33px"
    height="18px"
    viewBox="0 0 129 70"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <rect id="path-1" x="112" y="19" width="18" height="33" />
    </defs>
    <g id="Battery" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <Percentage percent={percentage} />
      <BatteryOutline fontColor={fontColor} />
      {(source === 'Power Adapter') && renderSymbol(status)}
    </g>
  </svg>
)

export default Battery