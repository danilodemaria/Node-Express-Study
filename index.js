const startupDebugger = require('debug')('app:startup');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled...');
}
app.use(logger);
app.use(autehntication);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
