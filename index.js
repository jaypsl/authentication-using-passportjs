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
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req,res)=>{
    res.render('home');
});


app.get('/secret',  isLoggedIn, (req,res)=> {
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

//login route
//render login form
app.get('/login', (req,res)=> {
    res.render('login')
})


app.post('/login', passport.authenticate('local',{
    successRedirect : '/secret',
    failureRedirect : '/login'
}),(req,res)=> {

});

//logout route
app.get('/logout', (req,res)=>{
    // res.send('You are being logged out');
    req.logout();
    res.redirect('/');
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login');
    }
   
}

app.listen(3000, ()=> {
    console.log('server is running at 3000')
})

