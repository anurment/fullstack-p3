const express = require('express');

const app = express();
require('dotenv').config();

app.use(express.static('dist'));

// cors
const cors = require('cors');

app.use(cors());

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {

    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(express.json());

// morgan logging
const morgan = require('morgan');
const Person = require('./models/person');

morgan.token('postData', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status - :response-time ms :postData'));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

//part 3.1
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;
  /*
  if(body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name or number missing' })
  } */

  const person = new Person({
    // id: generateId(10**16),
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  }).catch((error) => next(error));
});

// part 3.2
app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    const n = persons.length;
    const infoTxt = `Phonebook has info for ${n} people`;
    const timestamp = new Date().toString();
    const htmlResponse = `<p>
                            ${infoTxt}
                            <br />
                            ${timestamp}
                        </p>`;
    response.send(htmlResponse);
  });
  // let n = persons.length;
});

// part 3.3
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
// part 3.4
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  ).then((updatedPerson) => {
    response.json(updatedPerson);
  }).catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
