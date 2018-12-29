import React from 'react'

const ControlButton = ({ time, isOn, startTimer, pauseTimer, stopTimer }) => {
  let start = (time === 0) ?
    <button onClick={startTimer} className="button" > start </button> : null
  let pause = (time === 0 || !isOn) ?
    null : <button onClick={pauseTimer} className="button">pause</button>
  let resume = (time === 0 || isOn) ?
    null : <button onClick={startTimer} className="button">resume</button>
  let stop = (time === 0 || isOn) ?
    null : <button onClick={stopTimer} className="button">stop</button>

  return (
    <div className="mode-button-wrapper">
      {start}
      {resume}
      {pause}
      {stop}
    </div>
  )
}
export default ControlButton