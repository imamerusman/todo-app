/* eslint-disable no-console */
const express = require('express');
const { v4: generateId } = require('uuid');
const database = require('./database');
//Logger
const logging = require('./utils/logger');

//Error handling
const handleErrors = require('./middleware/handleErrors');
const { BadRequest } = require('./utils/errors');
const app = express();

app.use(logging.requestLogger);
app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', async (req, res) => {
  const todos = database.client.db('todos').collection('todos');
  const filter = req.query.filter;
  const query = {};
  //Create the filter for DB if due date is passed
  if(filter) {
    query.due_date = filter;
  }
  const response = await todos.find(query).toArray();
  res.status(200);
  res.json(response);
});

app.post('/', async (req, res, next) => {
  const { text, due_date } = req.body;
  try {
    if (!text || typeof text !== 'string') {
      throw new BadRequest("invalid data for 'text' field!");
    }
    //Store due date along with the task's text
    const todo = { id: generateId(), text, completed: false, due_date };
    await database.client.db('todos').collection('todos').insertOne(todo);
    res.status(201);
    res.json(todo);
  } catch (err) {
    next(err);
  }
});


app.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    if (!completed ||typeof completed !== 'boolean') {
      throw new BadRequest("invalid data for 'completed' field!");
    }
    await database.client.db('todos').collection('todos').updateOne({ id },
      { $set: { completed } });
    res.status(200);
    res.end();
  } catch (err) {
    next(err);
  }
});

app.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new BadRequest("missing param 'id'!");
    }
    await database.client.db('todos').collection('todos').deleteOne({ id });
    res.status(203);
    res.end();
  } catch (err) {
    next(err);
  }
});

app.post('/all', async (req, res, next) => {
  try {
    await database.client.db('todos').collection('todos').remove({});
    res.status(203);
    res.end();
  } catch (err) {
    next(err);
  }
});

app.use(handleErrors);

module.exports = app;
