const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

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
      return response.status(404).json({ error: 'No projects exist' })
    } response.status(200).json(projects) })
  .catch(error => { response.status(500).json({ error }) })
});

// GET all palettes
app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
  .then(palettes => {
    if (!palettes.length) {
      return response.status(404).json({ error: 'No palettes exist' })
    } response.status(200).json(palettes) })
    .catch(error => { response.status(500).json({ error }) })
});

// POST project folder
app.post('/api/v1/projects', (request, response) => {
  const { project_name } = request.body;

  if (!project_name) {
    return response.status(422).json({ error: 'Missing property: project_name' })
  }
  database('projects').insert({ project_name }, '*')
  .then(project => response.status(201).json(project))
  .catch(error => response.status(500).json({ error }))
});


// POST palette
// DELETE palette
// DELETE PROJECT FOLDER (with and without palettes)
