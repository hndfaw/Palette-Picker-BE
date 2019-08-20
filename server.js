const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3001)

app.get('/', (req, res) => {
  res.send('This is paletter picker project')
})

app.listen(app.get('port'), () => {
  console.log(`Listening on localhost://${app.get('port')} `)
})