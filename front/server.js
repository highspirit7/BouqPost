const express = require("express");
const next = require("next");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
// const path = require('path');

const dev = process.env.NODE_ENV !== "production";
// const prod = process.env.NODE_ENV === 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
dotenv.config();

app.prepare().then(() => {
	const server = express();

	server.use(morgan("dev"));
	// server.use('/', express.static(path.join(__dirname, 'public')));
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));
	server.use(cookieParser(process.env.COOKIE_SECRET));
	server.use(
		expressSession({
			resave: false,
			saveUninitialized: false,
			secret: process.env.COOKIE_SECRET,
			cookie: {
				httpOnly: true,
				secure: false
			}
		})
	);

	server.get("*", (req, res) => {
		return handle(req, res);
	});

	//EC2 인스턴스에서 3000번 포트를 80으로 받아버리는 설정을 해버려서 어떻게 되돌리는지 아직 모르는 상황이라 항상 3000으로
	const port = dev ? 3000 : process.env.PORT;
	server.listen(port, () => {
		console.log(`next+express running on port ${port}`);
	});
});
