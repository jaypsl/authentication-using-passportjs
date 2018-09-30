var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.render('home');
});

app.get('/secret', (req,res)=> {
    res.render('secret');
});

app.listen(3000, ()=> {
    console.log('server is running at 3000')
})

