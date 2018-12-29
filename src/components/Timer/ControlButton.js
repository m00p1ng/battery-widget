import React from 'react'

const ControlButton = ({ time, isOn, startTimer, pauseTimer, stopTimer }) => {
  return (
    <div id="mode-button-wrapper">
      {time === 0 && (
        <button onClick={startTimer} className="button">
          start
        </button>
      )}
      {(time !== 0 && isOn) && (
        <button onClick={pauseTimer} className="button">
          pause
        </button>
      )}
      {(time !== 0 && !isOn) && (
        <>
          <button onClick={startTimer} className="button">
            resume
          </button>
          <button onClick={stopTimer} className="button">
            stop
          </button>
        </>
      )}
    </div>
  )
}
export default ControlButton