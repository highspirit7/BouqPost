const dotenv = require("dotenv");

dotenv.config();

module.exports = {
	development: {
		username: "root",
		password: process.env.DB_PASSWORD,
		database: "bouqpost",
		host: "127.0.0.1",
		dialect: "mysql"
	},
	test: {
		username: "root",
		password: process.env.DB_PASSWORD,
		database: "bouqpost",
		host: "127.0.0.1",
		dialect: "mysql"
	},
	production: {
		username: "root",
		password: process.env.DB_PASSWORD,
		database: "bouqpost",
		host: "127.0.0.1",
		dialect: "mysql"
	}
};


// const backUrl = process.env.NODE_ENV === 'production' ? 'https://api.nodebird.com' : 'http://localhost:3065';

// export { backUrl };
