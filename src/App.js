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
    ipcRenderer.on("battery-level", (event, message) => {
      this.setState({ battery: message })
    });
  }
  render() {
    return (
      <div className="App">
        {this.state.battery.percentage === '' ?
          "Loading..." : (
            <>
              <Clock ticking={true} format={'ddd HH:mm'} />
              <Battery battery={this.state.battery} />
            </>
          )
        }
      </div>
    );
  }
}

export default App;
