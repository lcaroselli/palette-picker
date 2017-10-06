exports.seed = function(knex, Promise) {
  return knex('palettes').del()
  .then(() => knex('projects').del() )
  .then(() => {
    return Promise.all([
      knex('projects').insert({
        id: 1,
        project_name: 'Earthy'
      }, 'id')
  .then(project => {
    return knex('palettes').insert([{
      id: 1,
      palette_name: 'Browns',
      color_one: '#B6BA79',
      color_two: '#6731D0',
      color_three: '#EA6C28',
      color_four: '#7E5701',
      color_five: '#D071A3',
      project_id: project[0]
    },
    {
      id: 2,
      palette_name: 'Greens',
      color_one: '#349DBB',
      color_two: '#05076B',
      color_three: '#7AE7A2',
      color_four: '#83D20C',
      color_five: '#290140',
      project_id: project[0]
    }])
  })
  .catch(error => console.log( {error} ))
  ])})
};
