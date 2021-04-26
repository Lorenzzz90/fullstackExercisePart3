const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express() 

//middleware
app.use(express.static('build')) //serve ad express per mostrare elementi statici (index.html javascript ecc)
app.use(cors()) // abilita il cross-origin resource sharing
app.use(express.json()) //consente ad express di interpretare json
morgan.token('data', (req) => JSON.stringify(req.body)) //definisco un campo personalizzato per morgan(generatore di log)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data')) //genero i log nel formato stabilito
//fine middleware

const PORT = process.env.PORT || 3001 //process.env serve ad heroku la 3001 serve per il locale
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    }, 
    {
        id: 2,
        name: "Lorenz",
        number: "030-123456"
    }, 
    {
        id: 3,
        name: "Peppe",
        number: "050-123456"
    }, 
    {
        id: 4,
        name: "MiaoBau",
        number: "060-123456"
    }
]

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: getRandomInt(10, 100000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.send(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (!person) {
        response.status(404).end()
    }
    response.json(person)
})

app.get('/info', (request, response) => {
    //const r = "<div><div>Phonebook has info for " + persons.length + " people</div><div>" + Date() + "</div></div>"
    const r = `<div><div>Phonebook has info for ${persons.length} people</div><div>${Date()}</div></div>`
    response.send(r)
}) 

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
