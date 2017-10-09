const generateColor = () => {
  return "#000000".replace(/0/g, () => (~~(Math.random()*16)).toString(16))
}

const generatePalette = () => {
  for (let i = 1; i < 6; i++) {
    let color = generateColor();
    if ($(`#color-${i}`).hasClass('lock')) {
      $(`#color-${i}`).css('background-color', color);
      $(`#color-${i}`).text(color.toUpperCase());
    }
  }
}

const storeProject = (name) => {
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then(response => { return response })
  .then(response => response.json())
  .then(response => { return response })
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
  .then(response => { return response })
  .catch(error => console.log(error))
}

const fetchProjects = () => {
  fetch('/api/v1/projects')
  .then(response => response.json())
  .then(response => { return response })
  .then(response => showProjects(response))
}

const fetchPalettes = () => {
  fetch('/api/v1/palettes')
  .then(response => response.json())
  .then(response => { return response })
  .then(response => showPalettes(response))
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
  if (project !== undefined) {
    return project.map(key => {
      $('#project-list').append(`<option value=${key.id}>${key.project_name}</option>`)

      $('#project-folders-section').append(
        `<article class='project-folder project-folder-${key.id}' id=${key.id}>
        <h2>
        ${key.project_name}
        </h2>
        </article>`)
      })
  }
}

const showNewProjects = (project) => {
  const filteredId = project.filter((el, i) => i === 0)
  const filteredName = project.filter((el, i) => i === 1)
  const combinedProject = [...filteredId, ...filteredName]

  const filteredProject = combinedProject.filter((el, i) => i === 1)

  return filteredProject.map(key => {
    $('#project-list').append(`<option value=${key.id}>${key.project_name}</option>`)

    $('#project-folders-section').append(
      `<article class='project-folder project-folder-${key.id}' id=${key.id}>
        <h2>
          ${key.project_name}
        </h2>
      </article>`)
  })
}

const showPalettes = (palette) => {
  return palette.map(key => {
    $(`.project-folder-${key.project_id}`).append(
        `<div class='mini-palette-container' id=${key.id}>
        <h3 value=${key.project_id}>
          ${key.palette_name}
          <img id='delete-palette' src='../assets/garbage.svg' alt='Delete palette icon'>
        </h3>

        <span style='background-color:${key.color_one}' class='small-palette'>${key.color_one}</span>

        <span style='background-color:${key.color_two}' class='small-palette'>${key.color_two}</span>

        <span style='background-color:${key.color_three}' class='small-palette'>${key.color_three}</span>

        <span style='background-color:${key.color_four}' class='small-palette'>${key.color_four}</span>

        <span style='background-color:${key.color_five}' class='small-palette'>${key.color_five}</span>
      </div>`
    )
  })
}

const showNewPalettes = (palette) => {
  const filteredPalette = palette.filter((el, i) => i === 0)

  return filteredPalette.map(key => {
    $(`.project-folder-${palette[7].project_id}`).append(
      `<div class='mini-palette-container' id=${palette[0].id}>
      <h3 value=${palette[0].id}>
      ${palette[1].palette_name}
      <img id='delete-palette' src='../assets/garbage.svg' alt='Delete palette icon'>
      </h3>

      <span style='background-color:${palette[2].color_one}' class='small-palette'>${palette[2].color_one}</span>

      <span style='background-color:${palette[3].color_two}' class='small-palette'>${palette[3].color_two}</span>

      <span style='background-color:${palette[4].color_three}' class='small-palette'>${palette[4].color_three}</span>

      <span style='background-color:${palette[5].color_four}' class='small-palette'>${palette[5].color_four}</span>

      <span style='background-color:${palette[6].color_five}' class='small-palette'>${palette[6].color_five}</span>
      </div>`
    )
  })
}

const createProject = () => {
  const name = $('#project-name').val();
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then(response => { return response })
  .then(response => response.json())
  .then(response => {
    const responseKeys = Object.keys(response)
    return responseKeys.map(key => {
      return { [key]: response[key] }
    })
  })
  .then(response => {
    if(response !== undefined) {
      showNewProjects(response)
    }})
  .catch(error => console.log(error))

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

  fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify(palette),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then(response => { return response })
  .then(response => response.json())
  .then(response => {
    const responseKeys = Object.keys(response)
    return responseKeys.map(key => {
      return { [key]: response[key] }
    })
  })
  .then(response => {
    if(response !== undefined) {
      showNewPalettes(response)
    }})
  .catch(error => console.log(error))

  $('#palette-name').val('');
}

const toggleLockColor = (e) => {
  if ($(e.target).hasClass('lock')) {
    $(e.target).removeClass('lock').addClass('unlock')
  } else {
    $(e.target).removeClass('unlock').addClass('lock')
  }
}

const loadPageInfo = (project) => {
  generatePalette();
  fetchProjects();
  fetchPalettes();
}


//Event Listeners
$(window).on('load', loadPageInfo);

$('#generate-button').on('click', generatePalette);

$(window).keypress(function(e) {
  if (e.which === 32 && !$('#generate-button').is(':focus') && !$('input').is(':focus')){
    generatePalette();
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

$('body').on('click', '#delete-palette', deletePalette);

$('body').on('click', '#palette-section', toggleLockColor);
