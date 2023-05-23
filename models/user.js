const mongoose = require("mongoose");

const User = mongoose.model('User', new mongoose.Schema({
    firstname: { type: String, default: null },
    lastname: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    token: { type: String },
    faves: {
        songs: [String], //arrays of music_id
        artists: [String], //arrays of artist_id
    }
}));

export default User;