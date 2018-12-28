import React, { Component } from 'react'

class Timer extends Component {
  state = {
    time: '00:20'
  }

  render() {
    return (
      <div id="timer-wrapper">
        {this.state.time}
      </div>
    )
  }
}

export default Timer