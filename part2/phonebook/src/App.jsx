import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from "./services/persons"

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const nameExist = persons.filter(p => p.name === newName)

  const [nameFilter, setNameFilter] = useState("")
  const personsFilter = persons.filter(p => p.name.toLowerCase().includes(nameFilter.toLowerCase()))

  // Setear personas
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  // Agregar una persona
  const addPerson = (event) => {
    event.preventDefault()

    if (nameExist.length == 1) {
      const confirm = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      const person = persons.find(p => p.name === newName)

      // actualizar el número de la persona
      confirm
        ? personService
          .update(person.id, { ...person, number: newNumber })
          .then(updatedPerson => setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson)))
        : ""

      return;
    }

    const newPerson = { name: newName, number: newNumber }

    personService
      .create(newPerson)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName("")
        setNewNumber("")
      })
  }

  const handleDelete = (id) => {
    const person = persons.find(n => n.id === id)
    const confirm = window.confirm(`Delete ${person.name} ?`)
    confirm
      ? personService
        .remove(id)
        .then(() => setPersons(persons.filter(p => p.id !== id)))
      : ""
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} setNameFilter={setNameFilter} />

      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />

      <h2>Numbers</h2>
      <Persons personsFilter={personsFilter} handleDelete={handleDelete} />
    </div>

  )
}

export default App