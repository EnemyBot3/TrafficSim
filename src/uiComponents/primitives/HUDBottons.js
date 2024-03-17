import React, { useState } from 'react'

export default function HUDBottons({onClick, title, icon, selected, type}) {

    return (
        <button className={selected? 'selectedButton' : 'buttons'} onClick={onClick}>
            <label className='buttonIcon'>{icon}</label>
            <label className='buttonText'>{title}</label>
        </button>
    )
}