import React from 'react'
import './aiUiKitInput.css'

export default function Input({id, type, onChange, placeholder, className, refRef, onChangeR, defaultValue, value, pattern, maxLength, ...props}) {
  return (
        <input id={id} onChange={onChangeR} type={type} className={`aiUiKitInput ${className}`} placeholder={placeholder} ref={refRef} defaultValue={defaultValue} value={value} pattern={pattern} maxLength={maxLength || "18"} {...props}/>
        
  )
}
