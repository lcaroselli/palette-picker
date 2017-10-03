const generateColor = () => {
  return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

const generatePalette = () => {
  for (let i = 1; i < 6; i++) {
    let color = generateColor();
    // console.log(color)
    $(`#color-${i}`).css('background', color);
    $(`#color-${i}`).text(color.toUpperCase());
  }
}

$('#generate-button').on('click', generatePalette);

$(document).ready(generatePalette);
