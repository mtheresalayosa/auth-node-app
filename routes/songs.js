const config = require('config');
const logger = require("../utils/logger");
const Songs = require('../models/song');
const musixmatch = require('../services/musixmatch');
const express = require('express');
const songRouter = express.Router();

const MUSIC_API_KEY = config.get("MUSIC_API_KEY");

songRouter.get('/', async(req, res)=>{
    try {
        const searchParams = req.query;
        const songs = await Songs.find(searchParams);

        logger.info("Search songs..");
        res.status(200).json(songs);
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
});

songRouter.post('/', async (req, res) => {
    try {
        const { title, year, artist_id, genre } = req.body;
        
        if(!(title && artist_id)){
            logger.error("Missing title and/or artist_id.");
            return res.status(400).send("Title and Artist are required.");
        }

        const checksong = await Songs.findOne({title, artist_id });

        //if doesn't exists yet, create one
        if(!checksong){
            const song = await Songs.create({
                title,
                artist_id,
                genre,
                year
            });

            logger.info("Created new song");
            res.status(201).json(song);
        }else{
            logger.error("Song already exists.");
            res.status(409).json({message: 'Song already exists.'});
        }
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
});

songRouter.get("/search", async(req, res)=>{
    try {
        const { song_title } = req.query;

        const mSongs = await musixmatch.searchSong(song_title, MUSIC_API_KEY);

        if(!mSongs){
            logger.error("Musixmatch service encountered error");
            return res.status(403).send("Musixmatch service encountered error");
        }
        
        logger.info("Search songs...");
        res.status(200).json({songs: mSongs});
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
    
});


module.exports = songRouter;