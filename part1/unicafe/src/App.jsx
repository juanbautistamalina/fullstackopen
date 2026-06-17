import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => {
  const styles = { "display": "flex", "justifyContent": "space-between", "padding": "5px", "width": "15em" }
  return (
    <td style={styles}>
      <strong>{text}</strong> {value}
    </td>)
}

const Statistics = ({ good, neutral, bad }) => {

  const all = good + neutral + bad;
  const average = (good * 1 + bad * -1) / all;
  const positive = (good * 100) / all;

  const styles = { border: "2px solid #000", borderRadius: "10px", padding: "5px" };

  return (
    <>
      {all === 0
        ? <p>No feedback given</p>
        : <table style={styles}>
          <tbody>
            <tr><StatisticLine text="good" value={good} /></tr>
            <tr><StatisticLine text="neutral" value={neutral} /></tr>
            <tr><StatisticLine text="bad" value={bad} /></tr>
            <tr><StatisticLine text="all" value={all} /></tr>
            <tr><StatisticLine text="average" value={average} /></tr>
            <tr><StatisticLine text="positive" value={`${positive}%`} /></tr>
          </tbody>
        </table >
      }
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <Button onClick={() => setGood(good + 1)} text="good" />
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button onClick={() => setBad(bad + 1)} text="bad" />
      </div>

      <div>
        <h2>statistics</h2>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    </>
  )
}

export default App