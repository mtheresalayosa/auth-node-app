const request = require("supertest");
const { expect } = require("chai");

const app = require("../app");
const User = require("../models/user");

//test data
const tempUser = {
  firstname: 'Sample1', 
  lastname: 'Samplelast', 
  email: 'esss@h.com', 
  password: '123456'
};

let tempToken, mockTempId, mockUser;

describe('Users', () =>{
    describe('Register', () => {
      it('should register new user with valid credentials', (done) => {
        request(app)
        .post("/users/register")
        .send(tempUser)
        .expect(201)
        .then((res) => {
          expect(res.body.email).to.be.eql(tempUser.email);
          done();
        })
        .catch((err) => done(err));
      });
    });

    describe('Login', ()=> {
      it('should authenticate user', (done) =>{
        request(app)
        .post("/users/login")
        .send({email: tempUser.email, password: tempUser.password})
        .expect(200)
        .then((res)=>{
          expect(res.body.message).to.be.equal("User logged in successfully.");
          tempToken = res.headers['x-auth-token'];
          mockUser = res.body.user;
          mockTempId = res.body.user._id;
          done();
        })
        .catch((err) => done(err));
      });

    });

    describe('Profile', ()=> {
      it('should retrieve user profile', (done) =>{
        request(app)
        .get("/users/profile/" + mockTempId)
        .set("x-auth-token",tempToken)
        .expect(200)
        .then((res)=>{
          expect(res.body.length).to.be.equal(mockUser.length);
          done();
        })
        .catch((err) => done(err));
      });
      
      it('should update user profile', (done) =>{
        request(app)
        .put("/users/profile/" + mockTempId)
        .set("x-auth-token",tempToken)
        .send({email: tempUser.email})
        .expect(200)
        .then((res)=>{
          expect(res.body.message).to.be.equal("User profile updated successfully.");
          done();
        })
        .catch((err) => done(err));
      });

    });


  });
  
  after(async () => {
    try {
      
      await User.deleteMany({ email: tempUser.email });
    } catch (err) {
      console.error(err);
    }
  });