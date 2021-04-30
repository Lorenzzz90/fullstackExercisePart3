require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express() 

//middleware
app.use(express.static('build')) //serve ad express per mostrare elementi statici (index.html javascript ecc)
app.use(cors()) // abilita il cross-origin resource sharing
app.use(express.json()) //consente ad express di interpretare json
morgan.token('data', (req) => JSON.stringify(req.body)) //definisco un campo personalizzato per morgan(generatore di log)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data')) //genero i log nel formato stabilito
//fine middleware

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result =>{
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    
    const person = {
        name: body.name,
        number: body.number,
    }
    const opts = {
         runValidators: true,
         new: true
    }
    Person.findByIdAndUpdate(request.params.id, { number: request.body.number }, opts)
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.get('/info', (request, response) => {
    Person.countDocuments({}, (err, c) => {
        console.log('Count is ' + c)
        console.log(typeof c)
        response.send(`<div><div>Phonebook has infooo for ${c} people</div><div>${Date()}</div></div>`)
    })

}) 

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})
//per richieste senza route penultimo middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
  }
  
  app.use(unknownEndpoint)
// errorhandler ultimo middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message})
    }
  }
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})