import React, { Component } from 'react';
import Clock from 'react-live-clock';
import BatterySection from './components/Battery/BatterySection'
import TimerClock from './components/Timer/TimerClock'

import './assets/styles.css'

const { ipcRenderer } = window.require('electron')

class App extends Component {
  state = {
    battery: {
      status: '',
      percentage: '',
      estimate: '',
    },
    showEstimate: false,
    timerEnable: false,
  }

  componentDidMount() {
    ipcRenderer.on('battery', (event, battery) => {
      this.setState({ battery })
    })

    ipcRenderer.on('timer', (event, timerEnable) => {
      this.setState({ timerEnable })
    })

    ipcRenderer.on('show-estimate', (event, showEstimate) => {
      this.setState({ showEstimate })
    })
  }

  render() {
    const { battery, showEstimate, timerEnable } = this.state

    return (
      <div className="app">
        {timerEnable && <TimerClock />}
        <div id="widget-wrapper">
          <Clock ticking={true} format={'ddd HH:mm'} />
          {battery.percentage !== '' ?
            <BatterySection
              battery={battery}
              showEstimate={showEstimate}
            /> :
            null
          }
        </div>
      </div>
    )
  }
}

export default App;
