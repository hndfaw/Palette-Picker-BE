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
  const { id } = req.params;
  database('projects').where('id', id).select()
    .then(project => {
      if(project.length) {
        res.status(200).json( project )
      } else {
        res.status(404).json({error: `Cannot find project with id ${id}`})
      }
    })
  .catch(error => 
      res.status(500).json({ error })
    )
})

app.get('/app/v1/projects/:id/palettes', (req, res) => {
  const { id } = req.params;
  database('projects').where('id', id).select()
  .then(project => {
    if(!project.length) {
      res.status(404).json({
        error: `Cannot find project with id ${id}`
      })
    } else {
      database('palettes').where('project_id', id).select()
      .then(palettes => {
        if(palettes.length) {
          res.status(200).json(palettes)
        } else {
          res.status(404).json({error: `Cannot find palettes under project with id ${id}`})
        }
      })
      .catch(error =>
          res.status(500).json({error})
        )
    }
  })
})

app.get('/app/v1/projects/palettes/:id', (req, res) => {
  const {id} = req.params;
  database('palettes').where('id', id).select()
  .then(palette => {
    if(palette.length) {
      res.status(200).json(palette)
    } else {
      res.status(404).json({error: `Cannot find palette with id ${id}`})
    }
  })
  .catch(error => 
      res.status(500).json({error})
    )
})





module.exports = app