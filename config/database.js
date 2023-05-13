const logger = require("../utils/logger");
const mongoose = require("mongoose");
const config = require("config");

if (!config.get('PrivateKey')) {
  logger.error('FATAL ERROR: PrivateKey is not defined.');
  process.exit(1);
}

const MONGO_URI = config.get("MONGO_URI");

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      logger.info("Successfully connected to database");
    })
    .catch((error) => {
      logger.info("database connection failed. exiting now...");
      logger.error(error);
      process.exit(1);
    });
};
