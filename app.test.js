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
      expect(response.body.error).toEqual('Cannot find project')
    })
  })
  
})