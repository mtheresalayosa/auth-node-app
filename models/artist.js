const mongoose = require("mongoose");

const Artist = mongoose.model('Artist', new mongoose.Schema({
    artist_name: { type: String, required: true, default: null },
    active_year: { type: Number },
}));

export default Artist;