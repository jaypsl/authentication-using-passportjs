var express = require('express'),
mongoose = require('mongoose'),
passport = require('passport'),
bodyParser = require('body-parser'),
localStrategy = require('passport-local'),
passportLocalMongoose = require('passport-local-mongoose'),
User = require('./models/user');

mongoose.connect('mongodb://localhost/authentication_app');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('express-session')({
    secret : 'jay-auth-key',
    resave : false,
    saveUninitialized : false
}))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req,res)=>{
    res.render('home');
});

app.get('/secret', (req,res)=> {
    res.render('secret');
});

//auth routes

//sign up form
app.get('/register', (req,res)=>{
res.render('register');
})

//handle user sign up
app.post('/register', (req,res)=> {
    // res.send('register post route');
    // req.body.username
    // req.body.password
    User.register(new User({username : req.body.username}), req.body.password, (err,user)=> {
        if(err){
            console.log(err);
            res.render('register');
        }
        passport.authenticate('local')(req,res,()=>{
            res.redirect('/secret')
        })
    })
})

app.listen(3000, ()=> {
    console.log('server is running at 3000')
})

