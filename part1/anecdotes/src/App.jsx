import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  // State
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  // Obtener la anécdota más votada
  const mostVotedNumber = Math.max(...votes)
  const mostVotedIndex = votes.indexOf(mostVotedNumber)

  // Seleccionar una anécdota aleatoriamente
  const handleClick = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  // Creo una copia del array de votos, luego modifico la copia y finalmente actualizo el state
  const updateVotes = () => {
    const copyVotes = [...votes]
    copyVotes[selected] += 1;
    setVotes([...copyVotes])
  }

  console.log(votes)
  // console.log("cantidad mayor de votos:", mostVotedNumber)
  // console.log("la anecdota más votada:", mostVotedIndex )

  return (
    <>
      <section>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <p>has a {votes[selected]} votes</p>
        <button onClick={updateVotes}>vote</button>
        <button onClick={handleClick}>next anecdote</button>
      </section>

      <section>
        <h1>Anecdote with most votes</h1>
        <p>{anecdotes[mostVotedIndex]}</p>
        <p>has a {mostVotedNumber} votes</p>
      </section>

    </>
  )
}

export default App