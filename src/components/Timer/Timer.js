import React, { Component } from 'react'

import ModeButton from './ModeButton'
import TimerClock from './TimerClock'

const renderMode = (mode) => {
  if (mode === 'timer') {
    return <TimerClock />
  } else {
    return null
  }
}

class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'timer',
    }
    this.handleSelectMode.bind(this)
  }

  handleSelectMode(mode) {
    this.setState({ mode })
  }

  render() {
    const { mode } = this.state

    return (
      <div id="timer-wrapper">
        {mode === '' ? (
          <ModeButton
            handleSelectMode={this.handleSelectMode}
          />
        ) : renderMode(mode)}
      </div>
    )
  }
}

export default Timer