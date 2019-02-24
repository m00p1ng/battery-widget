import React, { useReducer, useRef } from 'react'
import parseMs from 'parse-ms'

import ControlButton from './ControlButton'

const START_TIMER = 'START_TIMER'
const STOP_TIMER = 'STOP_TIMER'
const PAUSE_TIMER = 'PAUSE_TIMER'
const SET_TIME = 'SET_TIME'

const reducer = (state, action) => {
  switch (action.type) {
    case START_TIMER:
      return {
        isOn: true,
        time: state.time,
        start: Date.now() - state.time
      }
    case SET_TIME:
      return {
        ...state,
        time: Date.now() - state.start
      }
    case PAUSE_TIMER:
      return {
        ...state,
        isOn: false,
      }
    case STOP_TIMER:
      return {
        ...state,
        time: 0,
        isOn: false,
      }
    default:
      return state
  }
}

const useTimer = () => {
  const initialState = {
    time: 0,
    start: 0,
    isOn: false,
  }

  const [{ time, isOn }, dispatch] = useReducer(reducer, initialState)

  const intervalRef = useRef()
  const startTimer = () => {
    dispatch({ type: START_TIMER })
    intervalRef.current = setInterval(() => dispatch({ type: SET_TIME }), 0)
  }
  const pauseTimer = () => {
    dispatch({ type: PAUSE_TIMER })
    clearInterval(intervalRef.current)
  }
  const stopTimer = () => {
    dispatch({ type: STOP_TIMER })
    clearInterval(intervalRef.current)
  }

  return {
    time,
    isOn,
    startTimer,
    pauseTimer,
    stopTimer,
  }
}

const formatOutput = (time) => {
  const zeroPad = (num) => num < 10 ? `0${num}` : num
  const newTime = parseMs(time)

  let output = `${zeroPad(newTime.minutes)}:${zeroPad(newTime.seconds)}`
  if (newTime.hours > 0) {
    output = `${newTime.hours}:${output}`
  }

  return output
}

const TimerClock = () => {
  const {
    time, isOn,
    startTimer, pauseTimer, stopTimer
  } = useTimer()

  return (
    <div id="timer-wrapper">
      <div id="display-time">
        {formatOutput(time)}
        <ControlButton
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          stopTimer={stopTimer}
          time={time}
          isOn={isOn}
        />
      </div>
    </div>
  )
}

export default TimerClock