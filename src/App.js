import React, { useState, useEffect } from 'react';
import Clock from 'react-live-clock';
import BatterySection from './components/Battery/BatterySection'
import TimerClock from './components/Timer/TimerClock'

import './assets/styles.css'

const { ipcRenderer } = window.require('electron')

const useBattery = () => {
  const [battery, setBattery] = useState(null)
  const [showEstimate, setShowEstimate] = useState(false)
  const [timerEnable, setTimerEnable] = useState(false)
  const [fontColor, setFontColor] = useState('#FFFFFF')

  useEffect(() => {
    ipcRenderer.on('battery', (_event, battery) => {
      setBattery(battery)
    })

    ipcRenderer.on('timer', (_event, timerEnable) => {
      setTimerEnable(timerEnable)
    })

    ipcRenderer.on('show-estimate', (_event, showEstimate) => {
      setShowEstimate(showEstimate)
    })

    ipcRenderer.on('color-theme', (_event, theme) => {
      document.body.style.backgroundColor = theme.backgroundColor
      document.body.style.color = theme.fontColor
      setFontColor(theme.fontColor)
    })
  }, [])

  return {
    battery,
    showEstimate,
    timerEnable,
    fontColor,
  }
}

const App = () => {
  const { battery, showEstimate, timerEnable, fontColor } = useBattery()

  return (
    <div id="app">
      {timerEnable && <TimerClock />}
      <div id="widget-wrapper">
        <Clock ticking={true} format={'ddd HH:mm'} />
        {battery && (
          <BatterySection
            battery={battery}
            showEstimate={showEstimate}
            fontColor={fontColor}
          />
        )}
      </div>
    </div>
  )
}

export default App;
