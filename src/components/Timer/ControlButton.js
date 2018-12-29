import React from 'react'

const ControlButton = ({ time, isOn, startTimer, stopTimer, resetTimer }) => {
  let start = (time === 0) ?
    <button onClick={startTimer} className="button" > start </button> : null
  let stop = (time === 0 || !isOn) ?
    null : <button onClick={stopTimer} className="button">stop</button>
  let resume = (time === 0 || isOn) ?
    null : <button onClick={startTimer} className="button">resume</button>
  let reset = (time === 0 || isOn) ?
    null : <button onClick={resetTimer} className="button">reset</button>

  return (
    <div className="mode-button-wrapper">
      {start}
      {resume}
      {stop}
      {reset}
    </div>
  )
}
export default ControlButton