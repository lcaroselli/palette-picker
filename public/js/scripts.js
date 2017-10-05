const generateColor = () => {
  return "#000000".replace(/0/g, () => (~~(Math.random()*16)).toString(16))
}

const generatePalette = () => {
  for (let i = 1; i < 6; i++) {
    let color = generateColor();
    $(`#color-${i}`).css('background-color', color);
    $(`#color-${i}`).text(color.toUpperCase());
  }
}

const storeProject = (name) => {
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({name}),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => showProjects(response))
}

const storePalette = (name) => {
  fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify(name),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => showPalettes(response))
}

const showProjects = (project) => {
  const { project_name, id } = project;

  $('#project-list').append(`<option value=${id}>${project_name}</option>`);

  $('#project-folders-section').append(
    `<article>
      <h2 value=${id}>${project_name}<img src='../assets/garbage.svg' alt='Delete project icon'></h2>
    </article>`);
}

const showPalettes = (palette) => {
  const { palette_name, project_id } = palette;

  $('#project-folders-section').append(
    `<article>
      <h2 value=${project_id}>${palette_name}</h2>
    </article>`);
}

const fetchProjects = () => {
  fetchAll('projects', showProjects);
}

const fetchPalettes = () => {
  fetchAll('palettes', showPalettes);
}

const createProject = () => {
  const name = $('#project-name').val();
  storeProject(name);
}

const createPalette = () => {
  const palette = Object.assign({}, {
    name: $('#palette-name').val(),
    color_1: $('#color-1').text(),
    color_2: $('#color-2').text(),
    color_3: $('#color-3').text(),
    color_4: $('#color-4').text(),
    color_5: $('#color-5').text(),
    project_id: $('#project-list option:selected').val()
  })
  storePalette(palette);
}

$('#generate-button').on('click', generatePalette);

$('#save-project-button').on('click', createProject);

$('#save-palette-button').on('click', createPalette);

$(document).ready(generatePalette, fetchProjects, fetchPalettes);
