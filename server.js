const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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
  database('projects').select();
  .then(projects => {
    if (!projects.length) {
      return response.status(404).json({ error: 'No projects exist' });
    } else {
      response.status(200).json(projects)
    } });
  .catch(error => { response.status(500).json({ error }) });
});

// GET all palettes
app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select();
  .then(palettes => {
    if (!palettes.length) {
      return response.status(404).json({ error: 'No palettes exist' });
    } else {
      response.status(200).json(palettes)
    } });
    .catch(error => { response.status(500).json({ error }) });
});

  //DELETE palette in project folder
  //DELETE PROJECT FOLDER (with and without palettes)
