const request = require('supertest');
const app = require('./app');
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration);



describe('API', () => {

  beforeEach(async () => {
    await database.seed.run()
  })


  describe('GET all projects', () => {
    it('should return a 200 and all of the projects', async () => {

        const expectedProjects = await database('projects').select();

        const response = await request(app).get('/app/v1/projects');
        const projects = response.body;
    
        expect(response.status).toBe(200);
        expect(projects[0].name).toEqual(expectedProjects[0].name)

    })
  })

  describe('GET one project', () => {
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

  describe('GET all palletes', () => {
    it('should return a 200 status code and all palettes of one project', async () => {
      const project = await database('projects').first();
      const id = project.id;

      const expectedPalettes = await database('palettes').where('project_id', id).select();

      const response = await request(app).get(`/app/v1/projects/${id}/palettes`);
      const palettes = response.body;

      
       if (!palettes.error) {
         expect(response.status).toBe(200);
         expect(palettes[0].name).toEqual(expectedPalettes[0].name)
        } else {
          expect(response.status).toBe(404);
          expect(response.body.error).toEqual(`Cannot find palettes under project with id ${id}`)
        }

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

  describe('GET one palette', () => {
    it('should return 200 status code and one palette', async () => {

      const expectedPalette = await database('palettes').first();
      const id = expectedPalette.id;

      const response = await request(app).get(`/app/v1/projects/palettes/${id}`)
      const palette = response.body[0];

      expect(response.status).toBe(200);
      expect(palette.name).toEqual(expectedPalette.name);
    })

    it('should return 404 and message cannot find palette with id', async () => {
      const invalidId = -1;
  
      const response = await request(app).get(`/app/v1/projects/palettes/${invalidId}`)
  
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Cannot find palette with id ${invalidId}`)
    })
  })

  describe('POST a project',  () => {
    it('should post new projects and return status code 201 witht he id of new item', async () => {
      const newProject = {name: 'Testing project'};

      const response = await request(app).post('/app/v1/projects').send(newProject)

      const id = response.body.id

      const project = await database('projects').where('id', id).select();

      expect(response.status).toBe(201);
      expect(project[0].name).toEqual(newProject.name);
    })
  })

  
})