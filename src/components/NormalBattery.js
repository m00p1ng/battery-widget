import React from 'react'

import Battery0 from '../assets/images/normal/Battery_0.png'
import Battery10 from '../assets/images/normal/Battery_10.png'
import Battery20 from '../assets/images/normal/Battery_20.png'
import Battery30 from '../assets/images/normal/Battery_30.png'
import Battery40 from '../assets/images/normal/Battery_40.png'
import Battery50 from '../assets/images/normal/Battery_50.png'
import Battery60 from '../assets/images/normal/Battery_60.png'
import Battery70 from '../assets/images/normal/Battery_70.png'
import Battery80 from '../assets/images/normal/Battery_80.png'
import Battery90 from '../assets/images/normal/Battery_90.png'
import Battery100 from '../assets/images/normal/Battery_100.png'

import '../assets/styles.css'

const getImagePath = (percent) => {
  if (percent > 90) {
    return Battery100
  } else if (percent > 80) {
    return Battery90
  } else if (percent > 70) {
    return Battery80
  } else if (percent > 60) {
    return Battery70
  } else if (percent > 50) {
    return Battery60
  } else if (percent > 40) {
    return Battery50
  } else if (percent > 30) {
    return Battery40
  } else if (percent > 20) {
    return Battery30
  } else if (percent > 10) {
    return Battery20
  } else if (percent > 5) {
    return Battery10
  }
  return Battery0
}

const NormalBattery = ({ percentage }) => {
  return (
    <img
      src={getImagePath(percentage)}
      alt="battery"
      id="battery-image"
    />
  )
}

export default NormalBattery