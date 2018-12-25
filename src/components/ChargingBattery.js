import React from 'react'

import Battery0 from '../assets/images/charging/Battery_0.png'
import Battery5 from '../assets/images/charging/Battery_5.png'
import Battery10 from '../assets/images/charging/Battery_10.png'
import Battery15 from '../assets/images/charging/Battery_15.png'
import Battery20 from '../assets/images/charging/Battery_20.png'
import Battery25 from '../assets/images/charging/Battery_25.png'
import Battery30 from '../assets/images/charging/Battery_30.png'
import Battery35 from '../assets/images/charging/Battery_35.png'
import Battery40 from '../assets/images/charging/Battery_40.png'
import Battery45 from '../assets/images/charging/Battery_45.png'
import Battery50 from '../assets/images/charging/Battery_50.png'
import Battery55 from '../assets/images/charging/Battery_55.png'
import Battery60 from '../assets/images/charging/Battery_60.png'
import Battery65 from '../assets/images/charging/Battery_65.png'
import Battery70 from '../assets/images/charging/Battery_70.png'
import Battery75 from '../assets/images/charging/Battery_75.png'
import Battery80 from '../assets/images/charging/Battery_80.png'
import Battery85 from '../assets/images/charging/Battery_85.png'
import Battery90 from '../assets/images/charging/Battery_90.png'
import Battery95 from '../assets/images/charging/Battery_95.png'
import Battery100 from '../assets/images/charging/Battery_100.png'

import '../assets/styles.css'

const getImagePath = (percent) => {
  if (percent > 95) {
    return Battery100
  } else if (percent > 90) {
    return Battery95
  } else if (percent > 85) {
    return Battery90
  } else if (percent > 80) {
    return Battery85
  } else if (percent > 75) {
    return Battery80
  } else if (percent > 70) {
    return Battery75
  } else if (percent > 65) {
    return Battery70
  } else if (percent > 60) {
    return Battery65
  } else if (percent > 55) {
    return Battery60
  } else if (percent > 50) {
    return Battery55
  } else if (percent > 45) {
    return Battery50
  } else if (percent > 40) {
    return Battery45
  } else if (percent > 35) {
    return Battery40
  } else if (percent > 30) {
    return Battery35
  } else if (percent > 25) {
    return Battery30
  } else if (percent > 20) {
    return Battery25
  } else if (percent > 15) {
    return Battery20
  } else if (percent > 10) {
    return Battery15
  } else if (percent > 5) {
    return Battery10
  } else if (percent > 0) {
    return Battery5
  }
  return Battery0
}

const ChargingBattery = ({ percentage }) => {
  return (
    <img
      src={getImagePath(percentage)}
      alt="battery"
      id="battery-image"
    />
  )
}

export default ChargingBattery