import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>
const StatisticLine = ({ text, value }) => <td>{text}: {value}</td>
const Statistics = ({ good, neutral, bad, all, average, positive }) => {

  return (
    <div>
      {all === 0
        ? <p>No feedback given</p>
        : <table>
          <tbody>
            <tr><StatisticLine text="good" value={good} /></tr>
            <tr><StatisticLine text="neutral" value={neutral} /></tr>
            <tr><StatisticLine text="bad" value={bad} /></tr>
            <tr><StatisticLine text="all" value={all} /></tr>
            <tr><StatisticLine text="average" value={average} /></tr>
            <tr><StatisticLine text="positive" value={String(positive).concat("%")} /></tr>
          </tbody>
        </table>}

    </div>
  )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad;
  const average = (good * 1 + neutral * 0 + bad * -1) / all
  const positive = (good * 100) / all


  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text={"good"} />
      <Button handleClick={() => setNeutral(neutral + 1)} text={"neutral"} />
      <Button handleClick={() => setBad(bad + 1)} text={"bad"} />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App