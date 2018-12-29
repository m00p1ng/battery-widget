import React, { Component } from 'react'
import parseMs from 'parse-ms'

import ControlButton from './ControlButton'

class TimerClock extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 0,
      isOn: false,
      start: 0
    }
    this.startTimer = this.startTimer.bind(this)
    this.pauseTimer = this.pauseTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
  }

  startTimer() {
    this.setState({
      isOn: true,
      time: this.state.time,
      start: Date.now() - this.state.time
    })
    this.timer = setInterval(() => {
      this.setState({
        time: Date.now() - this.state.start
      })
    }, 1);
  }

  pauseTimer() {
    this.setState({ isOn: false })
    clearInterval(this.timer)
  }

  stopTimer() {
    this.setState({ time: 0, isOn: false })
  }

  formatOutput() {
    const zeroPad = (num) => num < 10 ? `0${num}` : num
    const time = parseMs(this.state.time)

    let output = `${zeroPad(time.minutes)}:${zeroPad(time.seconds)}`
    if (time.hours > 0) {
      output = `${time.hours}:${output}`
    }

    return output
  }

  render() {
    return (
      <div id="timer-wrapper">
        <div id="display-time">
          {this.formatOutput()}
          <ControlButton
            startTimer={this.startTimer}
            pauseTimer={this.pauseTimer}
            stopTimer={this.stopTimer}
            time={this.state.time}
            isOn={this.state.isOn}
          />
        </div>
      </div>
    )
  }
}

export default TimerClock