import React from 'react'
import './aiUIKitButton.css'


export default function Button({name, className, type, disabledBtn,  onClick, onChange, icon, iconLast,tooltipBtn, ...props}) {

  return (
    <div className="tooltip">
    <button className={`aiUIKitButton ${className}`} type={type} disabled={disabledBtn}  onClick={onClick} onChange={onChange} {...props} >
      {icon} {name} {iconLast}
    </button>
    {tooltipBtn && <span className="tooltipBtnText">{tooltipBtn}</span>}
    </div>
  )
}
