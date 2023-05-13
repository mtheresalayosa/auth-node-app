const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const config = require("config");

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-auth-token"];

    if(!token){
        logger.error("Missing authentication token.");
        return res.status(403).send("Missing token!");
    }

    try {
        const decodedToken = jwt.verify(token, config.get('PrivateKey'));
        req.user = decodedToken;
    } catch (error) {
        logger.error(error)
        return res.status(401).send("Invalid Token");
    }
    
    return next();
}

module.exports = verifyToken;