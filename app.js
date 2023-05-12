require('./config/database').connect();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

//controllers
const users = require('./routes/users');
const artists = require('./routes/artists');
const songs = require('./routes/songs');

app.use(express.static('public'));
app.use(express.json());

app.use(bodyParser.urlencoded({
    extended: false
  }))

app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

//routes
app.use('/users', users);
app.use('/artists', artists);
app.use('/songs', songs);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
 
module.exports = app;
