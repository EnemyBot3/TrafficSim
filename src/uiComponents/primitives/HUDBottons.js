import React, { useState } from 'react'
import ScaleLoader from "react-spinners/ScaleLoader";

export default function HUDBottons({onClick, title, icon, selected, load}) {

    return (
        <button className={selected? 'selectedButton' : 'buttons'} onClick={onClick}>
            {load && selected ? <ScaleLoader  color="#36d7b7" height={"25px"}/> :<> <label className='buttonIcon'>{icon}</label></>}
            <label className={title.length > 8 ? 'smallButtonText' :'buttonText'}>{title}</label>
        </button>
    )
}