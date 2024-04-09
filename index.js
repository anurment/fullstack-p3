const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))



//cors
const cors = require('cors')
app.use(cors())


let persons = [
  /*
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  },
  */
]

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send( {error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    console.log('test')
    console.log(error)
    return response.status(400).json({ error: error.message })
  }

  next(error)
}



app.use(express.json())


//morgan logging
var morgan = require('morgan')
morgan.token('postData', function getPostData (req) {
  return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status - :response-time ms :postData'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

//part 3.1
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons);
    })
    
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  /*
  if(body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name or number missing' })
  }*/

  const person = new Person( {
      //id: generateId(10**16),
      name: body.name,
      number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))

})

//part 3.2
app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
      const n = persons.length;
      const infoTxt = `Phonebook has info for ${n} people`
      const timestamp = new Date().toString();
      const htmlResponse = 
                        `<p>
                            ${infoTxt}
                            <br />
                            ${timestamp}
                        </p>`;
      response.send(htmlResponse)
    })
    //let n = persons.length;
    
})



//part 3.3
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
//part 3.4
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findByIdAndUpdate(
   request.params.id,
   {name, number},
   { new: true, runValidators: true, context: 'query'} 
  ).then(updatedPerson => {
    response.json(updatedPerson)
  }).catch(error => next(error))
})

//part 3.5
const generateId = (max) => {
    return Math.floor(Math.random() * max);
}

/*
const getErrors = (body) => {
    let errors = {}
    if (!body.name) {
        errors.nameMissing = "name missing from request";
    } else {
        const person = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())
        if (person) {
            errors.uniqueName = "name must be unique";
        }
    }
    if (!body.number){
        errors.numberMissing = "number missing from request";
    }
    //console.log(Object.keys(errors).length)
    if (Object.keys(errors).length > 0) {
        return errors
    } else {
        return false;
    }
}
*/


app.use(unknownEndpoint)
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
