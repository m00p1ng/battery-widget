import React from 'react'

const BatteryOutline = () => (
  <g id="Battery_Border" transform="translate(2.000000, 5.000000)">
    <rect id="Rectangle"
      stroke="#FFFFFF"
      strokeWidth="8"
      x="4"
      y="4"
      width="102"
      height="52"
      rx="12"
    />
    <mask id="mask-2" fill="white">
      <use xlinkHref="#path-1" />
    </mask>
    <g id="Rectangle" />
    <circle id="Oval"
      fill="#FFFFFF"
      fillRule="evenodd"
      mask="url(#mask-2)"
      cx="113"
      cy="30"
      r="11"
    />
  </g>
)

export default BatteryOutline