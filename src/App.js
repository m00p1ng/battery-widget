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
    ipcRenderer.on("battery", (event, battery) => {
      this.setState({ battery })
    })

    ipcRenderer.on("show-batteryEstimate", (event, showBatteryEstimate) => {
      this.setState({ showBatteryEstimate })
    })
    ipcRenderer.on("show-chargingEstimate", (event, showChargeEstimate) => {
      this.setState({ showChargeEstimate })
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
