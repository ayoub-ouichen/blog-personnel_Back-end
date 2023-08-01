const express = require('express');
var cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');

app.use(cors({credentials: true, origin: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser())
app.use('/user', userRoute);

module.exports = app;