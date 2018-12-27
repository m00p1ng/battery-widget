import React, { Component } from 'react';
import Clock from 'react-live-clock';

import Battery from './components/Battery'
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
  }

  componentDidMount() {
    ipcRenderer.on("battery-level", (_event, message) => {
      this.setState({ battery: message })
    })

    ipcRenderer.on("show-estimate", (_event, message) => {
      this.setState({ showEstimate: message })
      console.log(this.state.showEstimate)
    })
  }

  render() {
    return (
      <div className="App">
        <Clock ticking={true} format={'ddd HH:mm'} />
        {this.state.battery.percentage !== '' ?
          <Battery battery={this.state.battery} showEstimate={this.state.showEstimate} /> :
          null
        }
      </div>
    )
  }
}

export default App;
