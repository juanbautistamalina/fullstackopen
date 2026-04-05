import { useState, useEffect } from "react"
import Note from "./components/Note"
import noteService from "./services/notes"
import Notification from "./components/Notification"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("a new note...")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  // Utilizando el 'servidor' para setear las notas
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  }, [])


  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }

    // Agregar la nueva nota al servidor (json-server) y al frontend (state)
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  // Manejar state del input
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }



  // Botón para cambiar la importancia de la nota
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => setNotes(notes.map(note => note.id !== id ? note : returnedNote)))
      .catch(() => {
        // alert(`the note '${note.content}' was already deleted from server`)
        setErrorMessage(`the note '${note.content}' was already deleted from server`)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) => <Note key={i} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App