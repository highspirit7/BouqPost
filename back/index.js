const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const passportConfig = require("./passport");
const hpp = require("hpp");
const redis = require("redis");
const RedisStore = require("connect-redis")(expressSession);
const helmet = require("helmet");
const db = require("./models"); //index.js파일은 명시 안해줘도 된다.
const logger = require("./logger");
const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");
const oauthAPIRouter = require("./routes/oauth");
const searchAPIRouter = require("./routes/search");
const categoryAPIRouter = require("./routes/category");

const app = express();

const prod = process.env.NODE_ENV === "production";
//시퀄라이즈를 DB(이 프로젝트에서는 MySQL)와 연동
db.sequelize.sync();

dotenv.config();

passportConfig();

if (prod) {
	app.use(hpp());
	app.use(helmet());
	app.use(morgan("combined"));
	app.use(
		cors({
			origin: /bouqpost\.xyz$/,
			credentials: true
		})
	);
} else {
	app.use(morgan("dev"));
	app.use(
		cors({
			origin: true,
			credentials: true
		})
	);
}

app.use(cookieParser(process.env.COOKIE_SECRET));
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;

const redisClient = redis.createClient(port, host);

//비밀번호를 쓰는 경우에 아래 코드가 필요한 것으로 보인다.
redisClient.auth(password, function (err) {

  if (err) throw err;

});



//secret – 쿠키를 임의로 변조하는것을 방지하기 위한 값 입니다. 이 값을 통하여 세션을 암호화 하여 저장합니다.
//resave – 세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값입니다. express-session documentation에서는 이 값을 false 로 하는것을 권장하고 필요에 따라 true로 설정합니다.
//saveUninitialized – 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장합니다.
app.use(
	expressSession({
		resave: false,
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET,
		cookie: {
			httpOnly: true,
			secure: false, //https를 쓸 때 true로
			domain: prod && ".bouqpost.xyz",
			maxAge: 604800000 //일주일
		},
		name: "a604m",
		store: new RedisStore({
			client: redisClient,
			host,
			port,
			password,
			logErrors: true
		})
	})
);

//passport가 내부적으로 express-session을 사용하기 때문에 express-session을 use한 후에 사용해야 한다.
app.use(passport.initialize());
app.use(passport.session());


//request의 body 해석하기 위함. 예전에는 body-parser라는 미들웨어를 사용해서 했다고 함.
//extended 는 중첩된 객체표현을 허용할지 말지를 정하는 것이다. 객체 안에 객체를 파싱할 수 있게하려면 true.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use("/user", userAPIRouter);
app.use("/post", postAPIRouter);
app.use("/posts", postsAPIRouter);
app.use("/oauth", oauthAPIRouter);
app.use("/search", searchAPIRouter);
app.use("/category", categoryAPIRouter);

app.get("/", (req, res) => {
	res.send("북포스트 정상 동작!");
});

app.listen(prod ? process.env.PORT : 2019, () => {
	console.log(`server is running on ${prod ? process.env.PORT : "2019"}`);
});
