import React, { Component } from 'react';

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
          "Loading..." : (<Battery battery={this.state.battery} />)
        }
      </div>
    );
  }
}

export default App;
