import React from 'react'
import './App.css'
import check from './pictures/check.png'
import uncheck from './pictures/uncheck.png'

// definerer kartlag-komponenten som brukes i navbaren
function Layer(props){
    const { name, active} = props
    if (active){
        return <div className="active-layer layer"> {name} <img src={check} className="icon" alt=""/> </div>
    }
    else{
        return <div className="disabled-layer layer"> {name} <img src={uncheck} className="icon" alt=""/> </div>
    }
}

export default Layer