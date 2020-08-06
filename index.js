const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const logger = require('./logger');
const autehntication = require('./authentication');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled...');
}
app.use(logger);
app.use(autehntication);

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

app.get('/', (req, res) => {
  res.render('index', { title: 'My express App', message: 'Hello' });
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.post('/api/courses', (req, res) => {
  // validate
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  // find the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send({ message: 'The course with the given ID was not found.' });

  // validate
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // update the course
  course.name = req.body.name;

  // return the course
  res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send({ message: 'The course with the given ID was not found.' });
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send({ message: 'The course with the given ID was not found.' });

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the deleted course
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

function validateCourse(course) {
  console.log('aqui');
  const schema = Joi.object({ name: Joi.string().min(3).required() });
  return schema.validate(course);
}
