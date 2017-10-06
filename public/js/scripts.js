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
  .then(response => { return response })
  .then(response => response.json())
  .then(response => showProjects(response))
  .catch(error => console.log(error))
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
  .then(response => { return response })
  .then(response => response.json())
  .then(response => showPalettes(response))
}

const destroyProject = (id) => {
  fetch(`/api/v1/projects/${id}`, {
    method: 'DELETE'
  })
}

const deleteProject = (e) => {
  const targetProject = $(e.target).closest('.project-folder');
  const targetProjectId = targetProject.attr('id');
  destroyProject(targetProjectId);
  targetProject.remove();
}

const destroyPalette = (id) => {
  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
}

const deletePalette = (e) => {
  const targetPalette = $(e.target).closest('.mini-palette-container');
  const targetPaletteId = targetPalette.attr('id');
  destroyPalette(targetPaletteId);
  targetPalette.remove();
}

const showProjects = (project) => {
  const { project_name, id } = project;

  $('#project-list').append(`<option value=${id}>${project_name}</option>`);

  $('#project-folders-section').append(
    `<article class='project-folder project-folder-${id}' id=${id}>
      <h2>
        ${project_name}
        <img id='delete-button' src='../assets/garbage.svg' alt='Delete project icon'>
      </h2>
    </article>`);
}

const showPalettes = (palette) => {
  const { palette_name, project_id, color_one, color_two, color_three, color_four, color_five, id } = palette;

  const dropPalette = `<div class='mini-palette-container' id=${id}>
      <h3 value=${project_id}>
        ${palette_name}
        <img id='delete-palette' src='../assets/garbage.svg' alt='Delete palette icon'>
      </h3>

      <span style='background-color:${color_one}' class='small-palette'>${color_one}</span>

      <span style='background-color:${color_two}' class='small-palette'>${color_two}</span>

      <span style='background-color:${color_three}' class='small-palette'>${color_three}</span>

      <span style='background-color:${color_four}' class='small-palette'>${color_four}</span>

      <span style='background-color:${color_five}' class='small-palette'>${color_five}</span>
    </div>`

    $(`.project-folder-${palette.project_id}`).append(dropPalette);
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
  $('#project-name').val('');
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
  $('#palette-name').val('');
}

//Event Listeners
$('#generate-button').on('click', generatePalette);
$(window).keypress(function(e) {
  if (e.which === 32 && !$('#generate-button').is(':focus') && !$('input').is(':focus')){
    generatePalette()
  }
});

$('#save-project-button').on('click', createProject);

$('#save-palette-button').on('click', function() {
  if(!$('#project-list').val()) {
    alert('You must select a project from the drop-down menu first before saving a palette')
  } else if ($('#project-list').val()) {
    createPalette()
  }
})

$('body').on('click', '#delete-button', deleteProject);
$('body').on('click', '#delete-palette', deletePalette);

$(document).ready(generatePalette, fetchProjects, fetchPalettes);
