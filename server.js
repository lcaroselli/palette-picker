const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.get('/', (request, response) => {
  response.send('Hello');
});

// GET all projects
app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then(projects => {
    if (!projects.length) {
      return response.status(404).json({ error: 'No projects found' })
    } response.status(200).json(projects) })
  .catch(error => { response.status(500).json({ error }) })
});

// GET all palettes
app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
  .then(palettes => {
    if (!palettes.length) {
      return response.status(404).json({ error: 'No palettes found' })
    } response.status(200).json(palettes) })
    .catch(error => { response.status(500).json({ error }) })
});

// POST project folder
app.post('/api/v1/projects', (request, response) => {
  const { name } = request.body;

  if (!name) {
    return response.status(422).json({ error: 'Missing required property: name' })
  }

  database('projects').insert({ project_name: name }, '*')
    //string is a db prop.
  .then(project => response.status(201).json( project[0] ))
  .catch(error => response.status(500).json({ error }))
});

// POST palette
app.post('/api/v1/palettes', (request, response) => {
  const { name, color_1, color_2, color_3, color_4, color_5, project_id } = request.body;

  database('palettes').insert({ palette_name: name, color_one: color_1, color_two: color_2, color_three: color_3, color_four: color_4, color_five: color_5, project_id }, '*')

  .then(palette => response.status(201).json( palette[0] ))
  .catch(error => response.status(500).json({ error }))
});


// DELETE project
app.delete('/api/v1/projects/:id', (request, response) => {
  const id = request.params.id;

  database('projects').where({ id }).del()

  .then(response => {
    if(!response) {
      response.status(422).json({ error: 'Project matching id not found' })
    } response.sendStatus(204)})
  .catch( error => response.status(500).json({ error }) );
});

//DELETE Palette
app.delete('/api/v1/palettes/:id', (request, response) => {
  const id = request.params.id;

  database('palettes').where({ id }).del()

  .then(response => {
    if(!response) {
      response.status(422).json({ error: 'Palette matching id not found' })
    } response.sendStatus(204)})
  .catch( error => response.status(500).json({ error }) );
});

module.exports = app;
