const logger = require("../utils/logger");

const baseUrl = "http://api.musixmatch.com/ws/1.1/" 

const searchArtist = async (artist, apiKey) => {
    const srcArtistApi = "artist.search";
    const pagination = "page_size=10&page=1";

    const srcUrl = `${baseUrl}${srcArtistApi}?apikey=${apiKey}&q_artist=${artist}&${pagination}`;
    
    const result = await fetch(srcUrl, {
        method: "GET"
    });

    if (!result.ok) {
        logger.warn("Musixmatch service cannot search artist.");
        throw new Error("Network response was not OK");
      }
    const response = await result.json();
    
    const alists = response.message.body.artist_list;
    let artists = [];

    //get artist name and year active
    alists.forEach((artist)=>{
        artists.push({
            artist_name: artist.artist.artist_name,
            active_year: artist.artist.begin_date_year
        });
    });
    
    return artists;
}

const searchSong = async (track_title, apiKey)=> {
    const srcSongApi = "track.search";
    const pagination = "page_size=3&page=1";

    const srcUrl = `${baseUrl}${srcSongApi}?apikey=${apiKey}&q_track=${track_title}&${pagination}`;
    
    const result = await fetch(srcUrl, {
        method: "GET"
    });

    if (!result.ok) {
        logger.warn("Musixmatch service cannot search song.");
        throw new Error("Network response was not OK");
      }
    const response = await result.json();
    
    const tlists = response.message.body.track_list;
    let tracks = [];

    //get songs
    tlists.forEach((track)=>{
        let getGenre = track.track.primary_genres?.music_genre_list[0]?.music_genre?.music_genre_name;
        tracks.push({
            title: track.track.track_name,
            artist_id: track.track.artist_id,
            artist_name: track.track.artist_name,
            genre: getGenre
        });
    });
    
    return tracks;
}

module.exports = {
    searchArtist,
    searchSong
}