const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

//CLIENT
describe('Client Routes', () => {
  it('should retrieve the homepage with some text at /', (done) => {
    chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.include('Palette Picker');
      done();
    });
  });

  it('should return a 404 route that does not exist', (done) => {
    chai.request(server)
    .get('/partyhard')
    .end( (error, response) => {
      response.should.have.status(404);
      done();
    });
  });
});


//API
describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
  });

  describe('GET /api/v1/projects', () => {
    it('should retrieve all projects', (done) => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('project_name');
        response.body[0].project_name.should.equal('Earthy');
        done();
      });
    });

    it('should error 404 if the url does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/projectpartytime')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });


  describe('GET /api/v1/palettes', () => {
    it('should retrieve all palettes', (done) => {
      chai.request(server)
      .get('/api/v1/palettes')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('palette_name');
        response.body[0].palette_name.should.equal('Browns');
        response.body[0].should.have.property('color_one');
        response.body[0].color_one.should.equal('#B6BA79');
        response.body[0].should.have.property('color_two');
        response.body[0].color_two.should.equal('#6731D0');
        response.body[0].should.have.property('color_three');
        response.body[0].color_three.should.equal('#EA6C28');
        response.body[0].should.have.property('color_four');
        response.body[0].color_four.should.equal('#7E5701');
        response.body[0].should.have.property('color_five');
        response.body[0].color_five.should.equal('#D071A3');
        done();
      });
    });

    it('should error 404 if the url does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/partyhardpalettes')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });
});
