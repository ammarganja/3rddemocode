const express = require("express");
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require("cors");

const userRoutes = require('./routes/user');

const studentRoutes = require('./routes/student');


app.use(cors());

app.use(function (err, req, res, next) {
    console.log('This is the invalid field ->', err.field)
    next(err)
})

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use('/user', userRoutes);

app.use("/student", studentRoutes);


mongoose.connect('mongodb://localhost:27017/3rd', {
    useNewUrlParser :true, useUnifiedTopology:true
}).then(() => console.log('Database is connect'));

module.exports = app;