const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

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



let notes = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/api/info',(request, response) => {
    const info = notes.length
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
        const person = notes.find(person => person.id === id)
        if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

    })

    app.delete('/api/persons/:id',(request, response) => {
        const id = request.params.id
        notes = notes.filter(note => note.id !== id)

        response.status(204).end()
    })

    const generateId = () => {
        const maxId = notes.length > 0
            ? Math.max(...notes.map(n => Number(n.id)))
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
        
        if (notes.map(n => n.name).includes(body.name))
        {            
        return response.status(400).json({ error: 'name must be unique' })
    }
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number,
        }
        
        notes = notes.concat(person)
        response.json(person)
    })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})