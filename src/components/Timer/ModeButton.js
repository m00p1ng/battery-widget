import React from 'react'

const ModeButton = ({ handleSelectMode }) => {
  return (
    <div className="mode-button-wrapper">
      <button
        className="button"
        onClick={() => handleSelectMode('timer')}
      >
        Timer
      </button>
      <button
        className="button"
        onClick={() => handleSelectMode('countdown')}
      >
        Countdown
      </button>
    </div>
  )
}

export default ModeButton