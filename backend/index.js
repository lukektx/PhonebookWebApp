const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Entry = require('./models/entry');
require('dotenv').config();

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());
morgan.token('content', (req, res) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));
app.use(
  morgan((tokens, req, res) => [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.content(req, res),
  ].join(' ')),
);

app.get('/', (request, response) => {
  response.send('welcome to the api');
});

app.get('/info', (request, response) => {
  const date = new Date();
  Entry.count({}).then((count) => {
    response.send(`<p>Phonebook has info for ${count} people</p>
                <p>${date.toString()}</p>`);
  });
});

app.get('/api/persons', (request, response) => {
  Entry.find({}).then((notes) => {
    response.json(notes);
  });
});

app.post('/api/persons', (request, response, next) => {
  const content = request.body;

  if (!content.name || !content.number) {
    return response.status(400).json({
      error: 'missing data',
    });
  }

  const newEntry = new Entry({
    name: content.name,
    number: content.number,
  });

  return newEntry.save().then((entry) => {
    response.json(entry);
  })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then((entry) => {
      response.json(entry);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Entry.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedEntry) => {
      response.json(updatedEntry);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
