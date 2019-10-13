const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');


const app = express();



app.listen(2019, () => {
  console.log('server is running on http://localhost:2019');
})