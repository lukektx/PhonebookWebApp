const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

let entries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
morgan.token('content', function (req, res) {
     return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(
    morgan(function (tokens, req, res) {
        return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['content'](req, res)
        ].join(' ')
}))

app.get('/', (request, response) => {
  response.send('welcome to the api')
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${entries.length} people</p>
                <p>${date.toString()}</p>`)
  })

app.get('/api/persons', (request, response) => {
  response.json(entries)
})

const generateID = () => {
    return Math.ceil(Math.random() * 100000)
}

app.post('/api/persons', (request, response) => {
    const content = request.body
    console.log(content)

    if (!content.name || !content.number) {
        return response.status(400).json({ 
          error: 'missing data'
        })
    }

    else if(entries.find(e => e.name === content.name)){
        return response.status(400).json({ 
            error: 'name must be unique'
        })
    }

    const newEntry = {
        "name": content.name,
        "number": content.number,
        "id": generateID()
    }
    entries = entries.concat(newEntry)

    response.json(newEntry)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = entries.find(e => e.id === id)
    if(!person){
        return response.status(404).end()
    }
    response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = entries.find(e => e.id === id)
    if(!person){
        return response.status(404).end()
    } else{
        const newPerson = {...person, number : request.body.number}
        entries = entries.map(e => e.id !== id ? e : newPerson)
        response.json(newPerson)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    entries = entries.filter(e => e.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})