require("dotenv").config();

const log4js = require("log4js");

log4js.configure({
    appenders: {
        fileAppender: { type: 'file', filename: './logs/log.log' },
        warnAppender: { type: 'file', filename: './logs/warn.log' },
        errorAppender: { type: 'file', filename: './logs/error.log' },
        consoleAppender: { type: 'console' }
    },
    categories: {
        default: { appenders: ["fileAppender", "consoleAppender", "errorAppender", "warnAppender"], level: 'error' },
        trace: { appenders: ["fileAppender", "consoleAppender", "errorAppender", "warnAppender"], level: "trace"},
        info: { appenders: ["fileAppender", "consoleAppender"], level: "info"},
        warn: { appenders: ["fileAppender", "warnAppender"], level: "warn" },
        error:{ appenders: ["fileAppender", "errorAppender"], level: "error" }
    }
})

const logger = log4js.getLogger();

if(process.env.NODE_ENV === "PRD"){
    logger.level = "warn";
}else if(process.env.NODE_ENV === "DEV"){
    logger.level = "trace"
}

logger.trace("Treis");
logger.debug("debug")
logger.info("Info")
logger.warn("Guarn")
logger.error(" error")
logger.fatal("feiral")

module.exports = {
    log4js: log4js,
    logger: logger
}