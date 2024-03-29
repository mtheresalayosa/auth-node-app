import config from "config";
import logger from "../utils/logger";
import Artist from "../models/artist";
import musixmatch from "../services/musixmatch";

const MUSIC_API_KEY = config.get("MUSIC_API_KEY");

const getArtists = async (req, res) => {
  try {
    const searchParams = req.query;
    const artists = await Artist.find(searchParams);
    logger.info("Search artist");
    res.status(200).json(artists);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

const newArtist = async (req, res) => {
  try {
    const { artist_name, active_year } = req.body;

    if (!(artist_name && active_year)) {
      logger.error("Artist Name and Active Year are required.");
      return res.status(400).send("Artist Name and Active Year are required.");
    }

    const checkArtist = await Artist.findOne({ artist_name, active_year });

    //if doesn't exists yet, create one
    if (!checkArtist) {
      const artist = await Artist.create({
        artist_name,
        active_year,
      });
      logger.info("Create new artist");
      res.status(201).json(artist);
    } else {
      logger.error("Cannot create new artist record. Artist already exists.");
      res.status(409).json({ message: "Artist already exists." });
    }
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

const searchArtistsMatch = async (req, res) => {
  try {
    const { artist_name } = req.query;

    const mArtists = await musixmatch.searchArtist(artist_name, MUSIC_API_KEY);

    if (!mArtists) {
      logger.error("Musixmatch service encountered error");
      return res.status(403).send("Musixmatch service encountered error");
    }
    logger.info("Search artist");
    res.status(200).json({ artists: mArtists });
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

export {
  getArtists,
  newArtist,
  searchArtistsMatch,
};