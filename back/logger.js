const winston = require("winston");
require("winston-daily-rotate-file");

const logger = winston.createLogger({
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		new winston.transports.DailyRotateFile({
			filename: "log/error.log",
			zippedArchive: true,
      datePattern: "YYYY-MM-DD-HH",
      level: "error"
		}),
		new winston.transports.DailyRotateFile({
			filename: "log/combined.log",
			level: "info",
			zippedArchive: true,
			datePattern: "YYYY-MM-DD-HH",
      maxFiles: "30d",
      level: "info"
		})
	]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple()
		})
	);
}

module.exports = logger;
