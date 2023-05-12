# auth-node-app
##### Overview
Demo app using nodejs/express.js implementing:
1. User model with JWT authentication
2. MongoDB Schema with 'mongoose'
3. Musixmatch API Integration
4. Unit Tests using Mocha, Supertest, and chai

Built using:
* Node.js LTS (v18.16.0)
* npm (9.6.4)
* MongoAtlas-DB (cloudserver) or MongoDB Compass v1.36.4
* 

###### How to use
1. Download/Fork github folder. 
2. Run **npm install**
3. Setup config/default.json for environmental variables. To get **MUSIC_API_KEY**, you have to register an account with Musixmatch (https://developer.musixmatch.com/) then follow instructions from email confirmation.
4. Run **npm run dev** to run application.
5. Run **npm test** to execute tests.

##### Future Improvements
1. Additional models and fields 
2. Add Auth0 integration to connect to Google/FB
3. Email Verification
4. Additional and flexible search parameters to Musixmatch service
5. Improve unit tests using Sinon to create mocks/stubs
6. Implement front-end interface using React.js