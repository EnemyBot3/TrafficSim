import React, { useState } from 'react'
import { Animate } from "react-simple-animate";

export default function TopControls({onSave, onCancel, visible, placeholder, height}) {

    const [input, setInput] = useState("")

  return (
    <Animate
        play={visible}
        start={{...topControls, top: "-560px" }}
        end={topControls}>

        <textarea 
            rows={height} 
            cols={30} 
            placeholder={placeholder} 
            onChange={(e) => setInput(e.target.value)}
            className={"textInput"} />
        <div className={"saveCancelDiv"}>
            <button onClick={onCancel} className={"inputButton red"}> Cancel </button>
            <button onClick={() => onSave(input)} className={"inputButton blue"}> Save </button>
        </div>
    </Animate>
  )
}

const topControls = {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    top: "130px",
    backgroundColor: "rgba(87, 85, 63, 0.3)",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    padding: "20px 30px"
}