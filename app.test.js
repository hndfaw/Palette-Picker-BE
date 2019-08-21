const request = require('supertest');
const app = require('./app');
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration);



describe('API', () => {

  beforeEach(async () => {
    await database.seed.run()
  })


  describe('GET /projects', () => {
    it('should return a 200 and all of the projects', async () => {

        const expectedProjects = await database('projects').select();
        const fixedExpectedProjects = expectedProjects.map(project => {
          return { id: project.id, name: project.name}
        })

        const response = await request(app).get('/app/v1/projects');
        const projects = response.body;
        const fixedProjects = projects.map(project => {
          return { id: project.id, name: project.name}
        })
    
        expect(response.status).toBe(200);
        expect(fixedProjects).toEqual(fixedExpectedProjects)

    })
  })

  describe('Get one project', () => {
    it('should return a 200 and one student', async () => {

      const expectedProject = await database('projects').first();
      const id = expectedProject.id

      const response = await request(app).get(`/app/v1/projects/${id}`);
      const project = response.body[0];

      expect(response.status).toBe(200);
      expect(project.name).toEqual(expectedProject.name);
     
    })

    it('should return a 404 status code and a messge project not found', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/app/v1/projects/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Cannot find project with id ${invalidId}`)
    })
  })

  describe('Get palletes', () => {
    it('should return a 200 status code and all palettes', async () => {
      const project = await database('projects').first();
      const id = project.id;

      const expectedPalettes = await database('palettes').where('project_id', id).select();

      const fixedExpectedPalettes = expectedPalettes.map(palette => {
        return {name: palette.name, id: palette.id, project_id: palette.project_id, color_1: palette.color_1}
      })

      const response = await request(app).get(`/app/v1/projects/${id}/palettes`);
      const palettes = response.body;
      const fixedPalettes = palettes.map(palette => {
        return {name: palette.name, id: palette.id, project_id: palette.project_id, color_1: palette.color_1}
      })

      expect(response.status).toBe(200);
      expect(fixedPalettes).toEqual(fixedExpectedPalettes)
    })

    it('should return status code 404 and message Cannot find project with id if the project was not exist', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/app/v1/projects/${invalidId}/palettes`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Cannot find project with id ${invalidId}`)
    })

    it('should return status code 404 and message Cannot find palettes if there were no palettes', async () => {
      const project = await database('projects').where('name', 'Seed Project 3').select();
      const id = project[0].id;
      
      const response = await request(app).get(`/app/v1/projects/${id}/palettes`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Cannot find palettes under project with id ${id}`)
    })
  })
  
})