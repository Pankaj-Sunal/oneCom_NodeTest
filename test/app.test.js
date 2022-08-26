let User = require('../userModel');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
describe('Users', () => {
    // beforeEach((done) => { 
    //     User.deleteMany({}, (err) => { 
    //        done();           
    //     });        
    // });
  describe('/POST User', () => {
      it('it should create a user', (done) => {
        let user = {
            "userName":"pankaj_sunal",
            "password":"pankaj@1235",
            "role":"admin"
        }
        chai.request(server)
            .post('/signup')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
              done();
            });
      });

      it('it should not create a user without username', (done) => {
        let user = {
            "password":"pankaj@1235",
            "role":"admin"
        }
        chai.request(server)
            .post('/signup')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Missing fields')
              done();
            });
      });

      it('it should login a user', (done) => {
        let user = {
          "userName":"pankaj_sunal",
          "password":"pankaj@1235"
      }
        chai.request(server)
            .post('/login')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Login Successfully')
              done();
            });
      });
  
      it('it should not login a user with wrong credentials', (done) => {
          let user = {
              "userName":"pankaj_sunal",
              "password":"pankaj@123"
          }
        chai.request(server)
            .post('/login')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(401);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Unauthorized')
              done();
            });
      });
  });

});