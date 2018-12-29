import React, { Component } from 'react';
import Clock from 'react-live-clock';
import BatterySection from './components/Battery/BatterySection'
import TimerClock from './components/Timer/TimerClock'

import './assets/styles.css'

const { ipcRenderer } = window.require('electron')

class App extends Component {
  state = {
    battery: null,
    showEstimate: false,
    timerEnable: false,
    fontColor: '#FFFFFF'
  }

  componentDidMount() {
    ipcRenderer.on('battery', (_event, battery) => {
      this.setState({ battery })
    })

    ipcRenderer.on('timer', (_event, timerEnable) => {
      this.setState({ timerEnable })
    })

    ipcRenderer.on('show-estimate', (_event, showEstimate) => {
      this.setState({ showEstimate })
    })

    ipcRenderer.on('color-theme', (_event, theme) => {
      document.body.style.backgroundColor = theme.backgroundColor
      document.body.style.color = theme.fontColor
      this.setState({ fontColor: theme.fontColor })
    })
  }

  render() {
    const { battery, showEstimate, timerEnable, fontColor } = this.state

    return (
      <div id="app">
        {timerEnable && <TimerClock />}
        <div id="widget-wrapper">
          <Clock ticking={true} format={'ddd HH:mm'} />
          {battery &&
            <BatterySection
              battery={battery}
              showEstimate={showEstimate}
              fontColor={fontColor}
            />
          }
        </div>
      </div>
    )
  }
}

export default App;
