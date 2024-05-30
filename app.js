const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const{v4:uuid4} = require("uuid");
const session = require('express-session');
const {mongoose,User} = require("./config");
const { Console } = require('console');
const bcrypt = require('bcrypt');



const app = express(); // invoking a function to create an instant
const port = process.env.PORT || 4000;

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.use(session({
    secret:uuid4(),
    resave:false,
    saveUninitialized:true
}));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
//ejs as view engine
app.set('view engine','ejs');

//static asset
app.use(express.static('public'))

app.get('/', (req,res) => {
     res.render("login",{title:"Login System", message:''});
});

app.get('/home', (req,res) => {
    res.render("home",{title:"Home Page"});
})

app.get('/signUp', (req,res) => {
    res.render("signUp",{title:"Sign-Up Page", message:''});
})

app.post('/signUp', async (req, res) => {
    const userData = {
      firstName: req.body.fname,
      lastName:req.body.lname,
      email:req.body.email,
      password: req.body.password
    };
  
    try {

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        return res.render('signUp', { title: "Sign-Up Page", message: 'User already exists' });
    }
    else{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds)
        userData.password = hashedPassword; 
    
    
    // if new user
      const newUser = new User(userData);

      await newUser.save();
      
      res.render('home');
    }

    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving user data');
    }
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //email validation
    if(!emailRegex.test(email)){
        return res.render('login',{ message : 'Invalid email format', title:'Login System'});
    }

    try {
        // Find user in the database
        const user = await User.findOne({ email, password });
        //console.log(user)

        // If user doesn't exist or password is incorrect, return error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { message: 'Invalid email or password',title:'Login System' });
        }

        // If user exists and password is correct, redirect to home page
        res.render('home');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});