require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const { default: persons } = require('../frontend/src/services/persons')


const app = express()

app.use(express.static('dist'))

app.use(express.json())

app.use(cors())

app.use(morgan(function (tokens, request, response) {
    if (request.method === 'POST'){
        return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'name-length'), '-',
    tokens['response-time'](request, response), 'ms'
    ].join(' ') + ' '
    + JSON.stringify(request.body)
    }
    return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'name-length'), '-',
    tokens['response-time'](request, response), 'ms'
    ].join(' ')
}))


// .env tiedostossa reitti url:lle

const url = process.env.MONGODB_URI 

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

// person schema
const peopleSchema = new mongoose.Schema({
  name: String,
  number: String
})



peopleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', peopleSchema)




app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.delete('/api/persons/:id',(request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/info',(request, response) => {
  Person.countDocuments({}).then(count => {

    const today = new Date()
    const dayWord = today.getDay()
    const day = today.getDate()
    const month = today.getMonth()
    const year = today.getFullYear()
    const hours = today.getHours()
    const minutes = today.getMinutes()
    const seconds = today.getSeconds()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const days = ["Sunday", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const wordDay = days[dayWord]
    const monthWord = months[month]
    const message = `Phonebook has info for ${count} people. 
                                                                             ${monthWord} ${wordDay} ${day} ${year} ${hours}:${minutes}:${seconds} GMT+0200 (Eastern European Standard Time)`
    response.send(message)
  })
  .catch(error => next(error))
})



app.get('/api/persons/:id',(request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons',(request, response, next) => {
    const body = request.body

      if (!body.name) {
          return response.status(400).json({error: 'name missing'
          })
      }

      if (!body.number) {
          return response.status(400).json({ error: 'number missing' })
      }
        
      const person = new Person({
          name: body.name,
          number: body.number,
        })
        
      person.save().then(savedPerson => {
        response.json(savedPerson)
        })
      .catch(error => next(error))
    })
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body
  console.log('puttiin tultu', body)
  Person.findById(id).then(person => {
    person.number = body.number
    person.save()
    return
  })
  .catch(error => next(error))
})


const PORT = process.env.PORT //|| 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(unknownEndpoint)

//virheiden käsittelijä
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)