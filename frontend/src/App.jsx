import axios from 'axios'
import { useState, useEffect } from 'react'
import Numbers from './components/Numbers'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import numberService from './services/numbers'

const App = () => {
  const [people, setPeople] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const hook = () => {
    numberService
      .getall()
      .then((response) => {
        setPeople(response)
      })
  }

  useEffect(hook, [])

  const nameExists = (name) => people.find(p => p.name === name)

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    const person = nameExists(newName)
    if(!person){
      numberService
        .create(newPerson)
        .then(response => {
          setSuccessMessage(`Successfully added ${newName}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
          setPeople(people.concat(response))
          setNewName('')
          setNewNumber('')
        })
    }
    else{
      if(window.confirm(`${newName} already exists, would you like to update their number`)){
        numberService
        .update(person.id, newPerson)
        .then(response => {
          console.log('updating number')
          setPeople(people.map(p => p.id !== person.id ? p : response))
          setNewName('')
          setNewNumber('')
        })
      }
    }
  }

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterInput = (event) => {
    setFilter(event.target.value)
  }

  const showPeople = people.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const deleteID = (id) => {
    const name = people.find(p => p.id === id).name
    if(window.confirm(`Are you sure you want to delete ${name}`)){
        numberService
          .remove(id)
          .then(() => {
            setPeople(people.filter(p => p.id !== id))
          })
          .catch(() => {
            numberService
            .getall()
            .then((response) => {
              setPeople(response)
            })
            setErrorMessage(`Can't delete ${name} (already been deleted)`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
    }
}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} style='error' />
      <Notification message={successMessage} style='success' /> 
      <Filter filter={filter} handleFilterInput={handleFilterInput}/>

      <h3>Add a new entry</h3>
      <PersonForm 
        newName={newName} 
        handleNameInput={handleNameInput}
        newNumber={newNumber} 
        handleNumberInput={handleNumberInput}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Numbers people={showPeople} deleteID={deleteID}/>
    </div>
  )
}

export default App