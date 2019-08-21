const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.locals.title = 'Palette Picker'

app.use(bodyParser.json())

app.get('/', (request, response) => {
  response.send('Palette Picker App!');
});

app.get('/app/v1/projects', (req, res) => {
  database('projects').select()
    .then(projects => {
      if(projects.length) {
        res.status(200).json(projects)
      } else {
        res.status(404).json('Cannot find projects')
      }
    })
  .catch(error =>
      res.status(500).json({ error })
    )
})

app.get('/app/v1/projects/:id', (req, res) => {
  database('projects').where('id', req.params.id).select()
    .then(project => {
      if(project.length) {
        res.status(200).json( project )
      } else {
        res.status(404).json({error: 'Cannot find project'})
      }

    })
})

module.exports = app