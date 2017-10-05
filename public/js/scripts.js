const generateColor = () => {
  return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}
//Note: this sometimes brings back invalid hex codes

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
    body: JSON.stringify({ name }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => showProjects(response[0]))
}

const showProjects = (project) => {
  const { id, project_name } = project;

  $('#project-list').append(`<option value='${id}'>${project_name}</option>`);

  $('#project-folders-section').append(
    `<article id='project-${id}'>
      ${project_name}
      <img src='../assets/garbage.svg' alt='Delete project icon'>
    </article>`);
}

const fetchProjects = () => {
  fetchAll('projects', showProjects);
}

const createProject = () => {
  const name = $('.project-name').val();
  storeProject(name);
}

$('#generate-button').on('click', generatePalette);

$('#save-project-button').on('click', createProject);

$(document).ready(generatePalette, fetchProjects);
