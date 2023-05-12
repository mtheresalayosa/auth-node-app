const request = require("supertest");
const { expect } = require("chai");

const app = require("../app");
const Artist = require("../models/artist");

let tempArtist = {
    artist_name: "Ogie A.",
    active_year: "2000"
}

describe("Artist", () =>{
    describe("Create", ()=>{
        it("should create new artist record", (done) =>{
            request(app)
            .post("/artists")
            .send(tempArtist)
            .expect(201)
            .then((res)=>{
                expect(res.body).to.be.not.empty;
                done();
            })
            .catch((err)=> done(err))
        })
    })

    describe("Search", ()=>{
        it("should retrieve all artist records", (done) =>{
            request(app)
            .get("/artists")
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
    await Artist.deleteOne({artist_name: tempArtist.artist_name, active_year: tempArtist.active_year});
  } catch (err) {
    console.error(err);
  }
});