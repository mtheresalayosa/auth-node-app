require('./config/database').connect();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morganMiddleware = require('./middleware/morgan.middleware');
const logger = require("./utils/logger");
const {createYoga} = require("graphql-yoga");
const schema = require("./middleware/graphqlschema");

const app = express();
const yoga = createYoga({ schema });

//controllers
import loadUserRoutes from './routes/users';
import loadSongRoutes from './routes/artists';
import loadArtistRoutes from './routes/songs';

app.use(morganMiddleware);
app.use(yoga);

app.use(express.static('public'));
app.use(express.json());

//routes
loadUserRoutes(app);
loadSongRoutes(app);
loadArtistRoutes(app);

app.use(bodyParser.urlencoded({
    extended: false
  }))

app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
 
export default app;
