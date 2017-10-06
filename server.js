//Importing dependencies to create an express app
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
//Using the .get method on our express app to retrieve the project resources in our database.
//When the project table is selected, if it has nothing in it, it returns a message 'No projects found'
//Otherwise, if the projects table has projects in it, it returns a json object of those projects
//When it catches a 500 error, it catches and displays the error
app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then(projects => {
    if (!projects.length) {
      return response.status(404).json({ error: 'No projects found' })
    } response.status(200).json(projects) })
  .catch(error => { response.status(500).json({ error }) })
});

// GET all palettes
//Using the .get method on our express app to retrieve the pallete resources in our database.
//When the pallete table is selected, if it has nothing in it, it returns a message 'No palletes found'
//Otherwise, if the palletes table has palletes in it, it returns a json object of those palletes
//When it catches a 500 error, it catches and displays the error
app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
  .then(palettes => {
    if (!palettes.length) {
      return response.status(404).json({ error: 'No palettes found' })
    } response.status(200).json(palettes) })
    .catch(error => { response.status(500).json({ error }) })
});

// POST project folder
//Using the .post method on our express app to post new  project resources in our database.
//If the required property name is not found in our post request, it returns an error message indicating a property is missing
//Otherwise, it inserts that project into our projects database, along with all the necessary properties
//When successfully added, we get a json object of that project
//If an error catches, the error is displayed
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
//Using the .post method on our express app to post new  palette resources in our database.
//It inserts that palette into our palettes database, along with all the necessary properties
//When successfully added, we get a json object of that palette
//If an error catches, the error is displayed
app.post('/api/v1/palettes', (request, response) => {
  const { name, color_1, color_2, color_3, color_4, color_5, project_id } = request.body;

  database('palettes').insert({ palette_name: name, color_one: color_1, color_two: color_2, color_three: color_3, color_four: color_4, color_five: color_5, project_id }, '*')

  .then(palette => response.status(201).json( palette[0] ))
  .catch(error => response.status(500).json({ error }))
});


// DELETE project
//Using the .delete method on our express app to delete a specific project resources in our database.
//It finds that project by the id and then calls the del() method to destroy that resource
//If the id is not found, an error message is displayed indicating the project id was not found
//otherwise, a successful status is sent to the user
//if an internal error is caught, that error is displayed
app.delete('/api/v1/projects/:id', (request, response) => {
  const id = request.params.id;

  database('projects').where({ id }).del()

  .then(response => {
    if(!response) {
      response.status(422).json({ error: 'Project matching id not found' })
    }
    response.sendStatus(204)})
  .catch( error => response.status(500).json({ error }) );
});

//DELETE Palette
//Using the .delete method on our express app to delete a specific palette resources in our database.
//It finds that palette by the id and then calls the del() method to destroy that resource
//If the id is not found, an error message is displayed indicating the palette id was not found
//otherwise, a successful status is sent to the userc
//if an internal error is caught, that error is displayed
app.delete('/api/v1/palettes/:id', (request, response) => {
  const id = request.params.id;

  database('palettes').where({ id }).del()

  .then(response => {
    if(!response) {
      response.status(422).json({ error: 'Palette matching id not found' })
    }
    response.sendStatus(204)})
  .catch( error => response.status(500).json({ error }) );
});

module.exports = app;
