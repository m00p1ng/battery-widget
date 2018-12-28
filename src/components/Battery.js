import React from 'react'

const Battery = ({ percentage, status, estimate }) => (
  <svg id="battery-icon" width="33px" height="18px" viewBox="0 0 129 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <title>Battery</title>
    <defs>
      <rect id="path-1" x="112" y="19" width="12" height="22"></rect>
    </defs>
    <g id="Battery" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <Percentage percent={percentage} />
      <BatteryOutline />
      {renderLightning({ status, estimate })}
    </g>
  </svg>
)

const renderLightning = ({ status, estimate }) => {
  const lightningStatus = ['charged', 'AC attached', 'finishing charge']
  if (lightningStatus.includes(status) || (status === 'charging' && !estimate.includes("0:00 remaining"))) {
    return <Lightning />
  } else {
    return null
  }
}

const Percentage = ({ percent }) => {
  let color
  if (percent > 80) {
    color = '#56AA29'
  } else if (percent > 60) {
    color = '#9CD22D'
  } else if (percent > 40) {
    color = '#FDD835'
  } else if (percent > 20) {
    color = '#FF8700'
  } else {
    color = '#D0021B'
  }

  return <rect id="Rectangle" fill={color} x="14" y="17" width={87 * percent / 100} height="36" rx="3"></rect>
}

const Lightning = () => (
  <g id="Lightning/Black" transform="translate(40.000000, -2.000000)" fill="#FFE010" stroke="#000000" strokeOpacity="0.158825861" strokeWidth="2">
    <path d="M20.3616433,33.6790437 L35.5335852,33.6790437 L4.42513951,74.0313343 L16.5448499,42.4669513 L0.507257113,42.4669513 L31.1064872,1.41955907 L20.3616433,33.6790437 Z" id="lightning"></path>
  </g>
)

const BatteryOutline = () => (
  <g id="Battery_Border/Black" transform="translate(2.000000, 5.000000)">
    <rect id="Rectangle" stroke="#FFFFFF" strokeWidth="8" x="4" y="4" width="102" height="52" rx="12"></rect>
    <mask id="mask-2" fill="white">
      <use xlinkHref="#path-1"></use>
    </mask>
    <g id="Rectangle"></g>
    <circle id="Oval" fill="#FFFFFF" fillRule="evenodd" mask="url(#mask-2)" cx="113" cy="30" r="11"></circle>
  </g>
)

export default Battery