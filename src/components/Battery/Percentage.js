import React from 'react'

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

  return (
    <rect id="Rectangle"
      fill={color}
      x="14"
      y="17"
      width={87 * percent / 100}
      height="36"
      rx="3"
    />
  )
}

export default Percentage