import * as songController from '../api/songs';
import auth from "../middleware/auth";

const loadSongRoutes = (app, controller = songController)=>{
    app.get('/songs', auth, controller.getSongs);
    app.post('/songs', auth, controller.createSong);
    app.get('/songs/music', auth, controller.searchMusic);
}


export default loadSongRoutes;