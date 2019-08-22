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

        const response = await request(app).get('/api/v1/projects');
        const projects = response.body;
    
        expect(response.status).toBe(200);
        expect(projects[0].name).toEqual(expectedProjects[0].name)

    })
  })

  describe('GET one project', () => {
    it('should return a 200 and one student', async () => {

      const expectedProject = await database('projects').first();
      const id = expectedProject.id

      const response = await request(app).get(`/api/v1/projects/${id}`);
      const project = response.body[0];

      expect(response.status).toBe(200);
      expect(project.name).toEqual(expectedProject.name);
     
    })

    it('should return a 404 status code and a messge project not found', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/api/v1/projects/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Cannot find project with id ${invalidId}`)
    })
  })

  describe('GET all palletes', () => {
    it('should return a 200 status code and all palettes of one project', async () => {
      const project = await database('projects').first();
      const id = project.id;

      const expectedPalettes = await database('palettes').where('project_id', id).select();

      const response = await request(app).get(`/api/v1/projects/${id}/palettes`);
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

      const response = await request(app).get(`/api/v1/projects/${invalidId}/palettes`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Cannot find project with id ${invalidId}`)
    })

    it('should return status code 404 and message Cannot find palettes if there were no palettes', async () => {
      const project = await database('projects').where('name', 'Seed Project 3').select();
      const id = project[0].id;
      
      const response = await request(app).get(`/api/v1/projects/${id}/palettes`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Cannot find palettes under project with id ${id}`)
    })
  })

  describe('GET one palette', () => {
    it('should return 200 status code and one palette', async () => {

      const expectedPalette = await database('palettes').first();
      const id = expectedPalette.id;

      const response = await request(app).get(`/api/v1/projects/palettes/${id}`)
      const palette = response.body[0];

      expect(response.status).toBe(200);
      expect(palette.name).toEqual(expectedPalette.name);
    })

    it('should return 404 and message cannot find palette with id', async () => {
      const invalidId = -1;
  
      const response = await request(app).get(`/api/v1/projects/palettes/${invalidId}`)
  
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(`Cannot find palette with id ${invalidId}`)
    })
  })

  describe('POST a project',  () => {
    it('should post new projects and return status code 201 with he id of new item', async () => {
      const newProject = {name: 'Project test 2'};

      const response = await request(app).post('/api/v1/projects').send(newProject)

      const id = response.body.id

      const project = await database('projects').where('id', id).select();

      expect(response.status).toBe(201);
      expect(project[0].name).toEqual(newProject.name);
    })

    it('should send status code 422 with message: Expected format: { name: <String> }. You\'re missing a name property.', async () => {
      const newProject = {};

      const response = await request(app).post('/api/v1/projects').send(newProject)

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Expected format: { name: <String> }. You\'re missing a name property.');
    })
  })

  describe('POST a palette',  () => {
    it('should post new projects and return status code 201 with he id of new item', async () => {

      const project = await database('projects').first();
      const id = project.id

      const newPalette = {
        name: 'Project test 2',
        color_1: '#fffff',
        color_2: '#fffff',
        color_3: '#fffff',
        color_4: '#fffff',
        color_5: '#fffff'
      };

      const response = await request(app).post(`/api/v1/projects/${id}`).send(newPalette)
      const paletteId = response.body.id

      const palette = await database('palettes').where('id', paletteId).select();

      expect(response.status).toBe(201);
      expect(palette[0].name).toEqual(newPalette.name);
      expect(palette[0].color_3).toEqual(newPalette.color_3);
    })

    it('should send status code 422 with message mentiong missing parameters', async () => {
      const project = await database('projects').first();
      const id = project.id

      const newPalette = {};

      let setRequiredParameter
      for (let requiredParameter of ['color_5', 'color_4', 'color_3', 'color_2', 'color_1', 'name']) {
        if (!newPalette[requiredParameter]) {
          setRequiredParameter = requiredParameter
        }
      }

      const response = await request(app).post(`/api/v1/projects/${id}`).send(newPalette)

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(`Expected format: { name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String> }. You\'re missing a "${setRequiredParameter}" property.`);
    })
  })

  describe('Delete project', () => {
    it('should return status code of 204 with the id of deleted project', async () => {
      const expectedProject = await database('projects').first();
      const id = expectedProject.id;

      const res = await request(app).delete(`/api/v1/projects/${id}`);
      const projectId = parseInt(res.body.id);

      expect(res.status).toBe(201);
      expect(projectId).toEqual(id);
    })  
  })

  
})