const projectsData = require('../../data/projects');

const createProject = (knex, project) => {

  return knex('projects').insert({
    name: project.name,
  }, 'id')
  .then(projectId => {

    let projectsPromises = [];

    project.palettes.forEach(palette => {

       projectsPromises.push(
         createPalette(knex, {
           name: palette.name,
           color_1: palette.color_1,
           color_2: palette.color_2,
           color_3: palette.color_3,
           color_4: palette.color_4,
           color_5: palette.color_5,
           project_id: projectId[0]
         })
       )
      
     });

    return Promise.all(projectsPromises);
  })
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
};

exports.seed = (knex) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectsPromises = [];

      projectsData.forEach(project => {
        projectsPromises.push(createProject(knex, project));
      });

      return Promise.all(projectsPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};