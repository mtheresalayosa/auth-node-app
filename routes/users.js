import * as UserController from '../api/users';
import auth from "../middleware/auth";

const loadUserRoutes = (app, controller = UserController)=>{
  app.post('/users/register', controller.register);
  app.post('/users/login', controller.login);
  app.get('/users/profile/:userId', auth, controller.userProfile);
  app.put('/users/profile/:userId', auth, controller.updateProfile);
}

module.exports = loadUserRoutes;
 
