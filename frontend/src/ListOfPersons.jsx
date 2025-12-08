import React from 'react';

const ListOfPersons = ({ personsToShow, handleDelete, deleteMessage }) => {
  return (
    <div>
      <ul>
        {personsToShow.map(person => {
        console.log('tässä listassa nimet',person.name);
        return  <li key={person.name}> {person.name} {person.number}
        <button onClick={() => handleDelete(person.id)}>delete</button></li>
        })}
      </ul>
    </div>
  )
}

export default ListOfPersons;