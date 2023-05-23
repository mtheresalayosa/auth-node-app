const mongoose = require("mongoose");

const Song = mongoose.model('Song', new mongoose.Schema({
    title: { type: String, required: true, default: null },
    year: { type: Number },
    artist_id: { type: String },
    genre: {type: String}
}));

export default Song;