const express = require('express');
var cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const posteRoute = require('./routes/poste');

app.use(cors({credentials: true, origin: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '50mb'}));
app.use('/user', userRoute);
app.use('/poste', posteRoute);

module.exports = app;