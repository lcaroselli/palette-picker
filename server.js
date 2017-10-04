const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Hello');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});


//Endpoints
  //GET all projects
  //GET all palettes

  //POST new project folder
  //SAVE(which method ??) palette in project folder
  //DELETE palette in project folder
  //DELETE PROJECT FOLDER (with and without palettes)
