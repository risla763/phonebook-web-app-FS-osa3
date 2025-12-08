import React, { useState, useEffect } from 'react';
import axios from 'axios'
import FilterForm from './FilterForm';
import AddPersonForm from './AddPersonForm';
import ListOfPersons from './ListOfPersons';
import personsService from './services/persons'


const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewPerson] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [searchPerson, setNewSearchPerson] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [DeleteMessage, setDeleteMessage] = useState(null)
  const [AddMessage, setAddMessage] = useState(null)
  const [UpdateMessage, setUpdateMessage] = useState(null)
  const [ErrorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService.getAll().then(response => {
      console.log('promise fulfilled', response)
      setPersons(response.data)
    }
      )
  }, [])

  const personsToShow = showAll
      ? persons
      : persons.filter(person => 
        person.name.toLowerCase().includes(searchPerson.toLowerCase())  ||
        person.number.includes(searchPerson)
        )
      
  const handleDelete = (id) => {
    const idfind = id
    const personfound = persons.find(person => person.id === idfind)

    if (window.confirm(`${personfound.name} Delete?`)) {
      personsService.delete(id)
      .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setDeleteMessage(`Deleted ${personfound.name}`)
          setTimeout(() => {
            setDeleteMessage(null)}, 5000)
        })
        .catch(error => {
            console.error('Error deleting person:', error);
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()

    const IsInList = persons.some(person => person.name === newName)

    if (!IsInList) {
      const personObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1),
      }

      axios
      personsService.create(personObject)
      .then(response => {
        console.log('uusi objekti tietokantaan', personObject)
        setPersons(persons.concat(personObject))
        setNewPerson('')
        setNewNumber('')
        setAddMessage(`Added ${newName}`)
        setTimeout(() => {
          setAddMessage(null)}, 5000)
      })
    } else {
    if (window.confirm(`${newName} is already added in phonebook, replace the old number with a new one?`)) {
          const person = persons.find(person => person.name === newName)
          const UpdatedPerson = { name: newName, number: newNumber, id: String(person.id)}
          console.log("update the object", UpdatedPerson)

          personsService.update(person.id, UpdatedPerson).then(response => {
                setPersons(persons.map(person => person.id === IsInList.id ? response.data : person))
                setUpdateMessage(`Updated ${newName}'s number to ${newNumber}`)
                setTimeout(() => 
                  setUpdateMessage(null), 5000)})
            .catch(error => { 
              setErrorMessage(`Information of ${newName} has already been removed from server`)
              setTimeout(() => {
              setErrorMessage(null)}, 5000)
            })
          } // tähän vasta .then sulku
          }
      }


  const handlePersonChange = (event) => {
    console.log(event.target.value, 'uusi nimi kentässä')
    setNewPerson(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    console.log(event.target.value, 'uusi number kentässä')
    setNewNumber(event.target.value)
  }
  
  
  const handleSearchChange = (event) => {
    setNewSearchPerson(event.target.value);
  }
  

  return (
    <div>
      <h2>Phonebook</h2>
      {AddMessage && <div className="addNotification">{AddMessage}</div>}
      {UpdateMessage && <div className="updateNotification">{UpdateMessage}</div>}
      {DeleteMessage && <div className="deleteNotification">{DeleteMessage}</div>}
      {ErrorMessage && <div className="errorNotification">{ErrorMessage}</div>}
      <FilterForm 
      
      searchPerson={searchPerson}
      handleSearchChange={handleSearchChange}
      />
      <h3>Add a new</h3>
      <AddPersonForm
      newName = {newName}
      newNumber = {newNumber}
      handlePersonChange= {handlePersonChange}
      addPerson={addPerson}
      handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <ListOfPersons
      personsToShow = {personsToShow}
      handleDelete={handleDelete}
      />
    </div>
  )

};

export default App;
