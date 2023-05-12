const request = require("supertest");
const { expect } = require("chai");

const app = require("../app");
const Songs = require("../models/song");

let tempSong = {
    title: 'Hello',
    year: 2008,
    artist_id: 1, 
    genre: 'Romance'
}

describe("Songs", () =>{
    describe("Create", ()=>{
        it("should create new songs record", (done) =>{
            request(app)
            .post("/songs")
            .send(tempSong)
            .expect(201)
            .then((res)=>{
                expect(res.body).to.be.not.empty;
                done();
            })
            .catch((err)=> done(err))
        })
    })

    describe("Search", ()=>{
        it("should retrieve all songs records", (done) =>{
            request(app)
            .get("/songs")
            .expect(200)
            .then((res)=>{
                expect(res.body).to.be.not.empty;
                done();
            })
            .catch((err)=> done(err))
        })
    })
})
  
after(async () => {
  try {
    await Songs.deleteOne({title: tempSong.title, artist_id: tempSong.artist_id});
  } catch (err) {
    console.error(err);
  }
});