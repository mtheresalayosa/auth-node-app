import * as ArtistController from '../api/artists';
import auth from "../middleware/auth";

const loadArtistRoutes = (app, controller = ArtistController) => {
    app.get('/artists', auth, controller.getArtists);
    app.post('/artists', auth, controller.newArtist);
    app.get('/artists/searchMatch', auth, controller.searchArtistsMatch);
}

export default loadArtistRoutes;