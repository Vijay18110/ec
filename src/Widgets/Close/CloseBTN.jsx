
import React from 'react'
import './Close.css'
const CloseButton = ({ handleCloseModal }) => {
    return (
        <button  className="button" onClick={handleCloseModal}>
            <span className="X"></span>
            <span className="Y"></span>
            <div className="close">Close</div>
        </button>

    )
}

export default CloseButton