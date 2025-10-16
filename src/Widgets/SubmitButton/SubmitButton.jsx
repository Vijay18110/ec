import React from 'react'
const SubmitButton = ({ type, className, value, disabled, onClick }) => {
  return (
    <>
      <button disabled={disabled} onClick={onClick} className={!disabled ? "btn btn-outline-success mt-2  w-100" : className} type={type ? type : ""}>
        {value}
      </button>
    </>
  )
}

export default SubmitButton