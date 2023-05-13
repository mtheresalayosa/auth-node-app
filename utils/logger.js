const winston = require("winston");

//set log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

//show all log levels if the server is in development mode
//else show only warn and error messages
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn'; 
};

//setup colors by level
const colors= {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

winston.addColors(colors);

//logging format
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

const transports = [
    //use console to print messages
    new winston.transports.Console(),
    //allow to print all error level messages in logs/error.log file
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    //print all error messages in logs/all.log file
    new winston.transports.File({ filename: 'logs/all.log'}),
];

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

module.exports = logger;