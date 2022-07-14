import React from 'react'
import './Die.css'

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return (
        <div
            className={`die-container`}
            onClick={props.handleClick}
            style={styles}
        >
            <h1>
                {props.value}
            </h1>
        </div>
    )
}
