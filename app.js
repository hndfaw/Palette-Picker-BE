const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.locals.title = 'Palette Picker'

app.use(bodyParser.json());
app.use(cors());


app.get('/', (request, response) => {
  response.send('Palette Picker App!');
});

app.get('/api/v1/projects', (req, res) => {
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

app.get('/api/v1/projects/:id', (req, res) => {
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

app.get('/api/v1/projects/:id/palettes', (req, res) => {
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

app.get('/api/v1/projects/palettes/:id', (req, res) => {
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

app.post('/api/v1/projects', (req, res) => {
  const newProject = req.body

    if (!newProject.name) {
      return res.status(422).json({ error: `Expected format: { name: <String> }. You're missing a name property.` });
    }

  database('projects').insert(newProject, 'id')
    .then(id =>
        res.status(201).json({ id: id[0]})
      )
    .catch(error =>
        res.status(500).json({error})
      )
})

app.post('/api/v1/projects/:id', (req, res) => {
  const newPalette = req.body;
  const { id } = req.params;

  for (let requiredParameter of ['name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if (!newPalette[requiredParameter]) {
      return res.status(422).json({ error: `Expected format: { name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').insert({project_id: id , ...newPalette}, 'id')
    .then(id =>
        res.status(201).json({ id: id[0]})
      )
    .catch(error =>
        res.status(500).json({error})
      )
})


app.delete('/api/v1/projects/:id', (req, res) => {
  const {id} = req.params;
database('palettes').where({
  project_id: id
}).del()
.then(()=>
  database('projects').where({
     id
  }).del()
  .then(() => 
     res.status(201).json({id})
  )
  .catch(error => 
    res.status(422).json({ error })
  )
)
});

app.delete('/api/v1/projects/palettes/:id', (req, res) => {
  const {id} = req.params;

  database('palettes')
    .where({id})
    .del()
    .then(() => 
      res.status(201).json({id})
    )
    .catch(error => 
      res.status(422).json({ error })
  )
});

app.patch('/api/v1/projects/:id', (req, res) => {
  const { id } = req.params;
  const updatedProject = req.body;

  database('projects')
    .where({ id })
    .update({ ...updatedProject })
    .then(() => 
      res.status(201).json({ ...updatedProject })
    )
})


module.exports = app