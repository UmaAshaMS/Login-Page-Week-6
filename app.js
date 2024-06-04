const express = require('express');
const dotenv = require('dotenv').config()
const path = require('path');
const bodyparser = require("body-parser");
const { v4: uuid4 } = require("uuid");
const session = require('express-session');
const cookieParser = require('cookie-parser')
const { mongoose, User } = require("./config");
const { Console } = require('console');
const bcrypt = require('bcrypt');
const nocache = require('nocache')
const userRouter = require('./router/userRouter')
const adminRouter = require('./router/adminRouter')


const app = express(); // invoking a function to create an instant
const port = process.env.PORT || 4000;
const saltRounds = 10;

//body parser
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

//session
app.use(session({
    secret: uuid4(),
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false, maxAge :3600000}
}));

app.use(nocache());


//port 
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}/user/login`);
    console.log(`Admin at http://localhost:${port}/admin/login`);
});
//ejs as view engine
app.set('view engine', 'ejs');

//static asset
app.use(express.static('public'))

//routes
app.use('/user', userRouter);
app.use('/admin', adminRouter);

//Session initialization
app.use(cookieParser());

app.get('/home', (req, res) => {
    // Check if user is logged in
    if (req.session.userId) {
        res.render('home', { title: 'Home Page' });
    } else {
        res.redirect('/user/login'); // Redirect to login page if user is not logged in
    }
   
})




