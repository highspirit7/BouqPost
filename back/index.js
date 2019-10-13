const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const db = require("./models"); //index.js파일은 명시 안해줘도 된다.

const app = express();

//시퀄라이즈를 DB(이 프로젝트에서는 MySQL)와 연동
db.sequelize.sync();

app.listen(2019, () => {
  console.log('server is running on http://localhost:2019');
})