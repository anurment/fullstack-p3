const express = require('express')
const app = express()

let persons = [
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
]




app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

//part 3.1
app.get('/api/persons', (request, response) => {
    response.json(persons);
})

//part 3.2
app.get('/info', (request, response) => {
    let n = persons.length;
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

//part 3.3
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      console.log('x')
      response.status(404).end()
    }
})

//part 3.4
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

//part 3.5
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
} 

const getErrors = (body) => {
    let errors = {}
    if (!body.name) {
        errors.nameMissing = 'name missing from request';
    } else {
        const person = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())
        if (person) {
            errors.uniqueName = 'name must be unique'
        }
    }
    if (!body.number){
        errors.numberMissing = 'number missing from request';
    }
    //console.log(Object.keys(errors).length)
    if (Object.keys(errors).length > 0) {
        return errors
    } else {
        return false;
    }
}

app.post('/api/persons', (request, response) => {
    const body = request.body;
    const errors = getErrors(body);

    if(errors){
        return response.status(400).json(errors)
    }

    const person = {
        id: getRandomInt(10**16),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person);
    response.json(persons);

})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
