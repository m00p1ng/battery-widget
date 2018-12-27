import React, { Component } from 'react';
import Clock from 'react-live-clock';
import BatterySection from './components/BatterySection'

import './assets/styles.css'

const { ipcRenderer } = window.require('electron')

class App extends Component {
  state = {
    battery: {
      status: '',
      percentage: '',
      estimate: '',
    },
    showBatteryEstimate: false,
    showChargeEstimate: false,
  }

  componentDidMount() {
    ipcRenderer.on("battery-level", (_event, message) => {
      this.setState({ battery: message })
    })

    ipcRenderer.on("show-battery-estimate", (_event, message) => {
      this.setState({ showBatteryEstimate: message })
    })
    ipcRenderer.on("show-charge-estimate", (_event, message) => {
      this.setState({ showChargeEstimate: message })
    })
  }

  render() {
    const { battery, showBatteryEstimate, showChargeEstimate } = this.state

    return (
      <div className="App">
        <Clock ticking={true} format={'ddd HH:mm'} />
        {battery.percentage !== '' ?
          <BatterySection
            battery={battery}
            showBatteryEstimate={showBatteryEstimate}
            showChargeEstimate={showChargeEstimate}
          /> :
          null
        }
      </div>
    )
  }
}

export default App;
