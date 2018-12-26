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
      estimate: ''
    }
  }

  componentDidMount() {
    ipcRenderer.on("battery-level", (_event, message) => {
      this.setState({ battery: message })
    });
  }

  render() {
    return (
      <div className="App">
        <Clock ticking={true} format={'ddd HH:mm'} />
        {this.state.battery.percentage !== '' ?
          <Battery battery={this.state.battery} /> :
          null
        }
      </div>
    );
  }
}

export default App;
