import config from "config";
import { error as _error, info } from "../utils/logger";
import Songs from "../models/song";
import musixmatch from "../services/musixmatch";

const MUSIC_API_KEY = config.get("MUSIC_API_KEY");

const getSongs = async (req, res) => {
  try {
    const searchParams = req.query;
    const songs = await Songs.find(searchParams);

    logger.info("Search songs..");
    res.status(200).json(songs);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

const createSong = async (req, res) => {
  try {
    const { title, year, artist_id, genre } = req.body;

    if (!(title && artist_id)) {
      logger.error("Missing title and/or artist_id.");
      return res.status(400).send("Title and Artist are required.");
    }

    const checksong = await Songs.findOne({ title, artist_id });

    //if doesn't exists yet, create one
    if (!checksong) {
      const song = await Songs.create({
        title,
        artist_id,
        genre,
        year,
      });

      logger.info("Created new song");
      res.status(201).json(song);
    } else {
      logger.error("Song already exists.");
      res.status(409).json({ message: "Song already exists." });
    }
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

const searchMusic = async (req, res) => {
  try {
    const { song_title } = req.query;

    const mSongs = await musixmatch.searchSong(song_title, MUSIC_API_KEY);

    if (!mSongs) {
      logger.error("Musixmatch service encountered error");
      return res.status(403).send("Musixmatch service encountered error");
    }

    logger.info("Search songs...");
    res.status(200).json({ songs: mSongs });
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
}

export {
  getSongs,
  createSong,
  searchMusic
};
// module.exports = {
//   getSongs,
//   createSong,
//   searchMusic
// }