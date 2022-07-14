import Die from './components/Die'

import React, {useState, useEffect, useRef} from 'react'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

import './App.css';



function App() {
    const [dice, setDice] = useState(newDices())
    const [tenzies, setTenzies] = useState(false)
    const [numOfRolls, setNumOfRolls] = useState(0);
    const [bestScore, setBestScore] = useState(
        () => JSON.parse(localStorage.getItem("bestScore")) || 0
    );
    const gameWindow = useRef(null)

    useEffect(() => {
        const allDiceHeld = dice.every(die => die.isHeld === true)
        const allSameValue = dice.every(die => die.value === dice[0].value)

        if (allDiceHeld && allSameValue)
            setTenzies(true);
    }, [dice])

    useEffect(() => {
        if (bestScore === 0) {
            localStorage.setItem("bestScore", JSON.stringify(numOfRolls))
            setBestScore(numOfRolls)
        }

        if (numOfRolls < bestScore && numOfRolls !== 0) {
            localStorage.setItem("bestScore", JSON.stringify(numOfRolls))
            setBestScore(numOfRolls)
        }
    }, [tenzies])

    // Creating new Dice object
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    // Creating 10 new dices
    function newDices() {
        const dices = []
        for (let i = 0; i < 10; i++)
            dices.push(generateNewDie())

        return dices
    }

    function rollDice() {
        setDice(prevDice => {
            return prevDice.map(die => die.isHeld ? die : generateNewDie())
        });
        setNumOfRolls(prevNum => prevNum + 1)
    }

    function holdDice(id) {
        setDice(prevDice =>
            prevDice.map(die => {
                return die.id === id
                    ? {...die, isHeld: !die.isHeld}
                    : die
            })
        )
    }

    function resetGame() {
        setTenzies(false)
        setDice(newDices())
        setNumOfRolls(0);
    }

    const diceElements = dice.map(die =>
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            handleClick={() => holdDice(die.id)}
        />
    )

    return (
        <main className="container" ref={gameWindow}>
            {
                tenzies &&
                <Confetti
                    width={gameWindow.current.offsetWidth}
                    height={gameWindow.current.offsetHeight}
                />
            }
            <h1 className="title">Tenzies</h1>
            <h4 className="description">
                Roll until all dices are the same. Click
                each dice to freeze it at its current value
                between rolls.
            </h4>
            <div className="grid-container">
                {diceElements}
            </div>
            <button
                className="roll-dice-btn"
                onClick={tenzies ? resetGame : rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <h3>Rolls: {numOfRolls}</h3>
            <h3>Best: {bestScore}</h3>
        </main>
    );
}

export default App;
