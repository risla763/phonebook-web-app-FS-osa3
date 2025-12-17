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



//let persons = [
  //{
    //id: "1",
    //name: "Arto Hellas",
    //number: "040-123456"
  //},
  //{
    //id: "2",
    //name: "Ada Lovelace",
    //number: "39-44-5323523"
  //},
  //{
    //id: "3",
    //name: "Dan Abramov",
    //number: "12-43-234345"
  //},
  //{
    //id: "4",
    //name: "Mary Poppendieck",
    //number: "39-23-6423122"
  //}
//]

//app.get('/api/persons', (request, response) => {
  //response.json(persons)
//})

const password = process.argv[2]
const Password = encodeURIComponent(password)
const url = `mongodb+srv://maijarislakki_db_user:${Password}@cluster0.ombojxl.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`


mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})



personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
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
    const info = persons.length
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
    const message = `Phonebook has info for ${info} people. 
                                                                             ${monthWord} ${wordDay} ${day} ${year} ${hours}:${minutes}:${seconds} GMT+0200 (Eastern European Standard Time)`
    response.end(message)
})



    app.get('/api/persons/:id',(request, response) => {
        const id = request.params.id
        const person = persons.find(person => person.id === id)
        if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

    })


    const generateId = () => {
        const maxId = persons.length > 0
            ? Math.max(...persons.map(n => Number(n.id)))
            : 0
        return String(maxId + 1)
        }
    app.post('/api/persons',(request, response) => {
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
    })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})