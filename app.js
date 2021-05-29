const express = require("express");
const mongoose=require('mongoose');
require('dotenv').config()




const dbUrl=process.env.DB_URL;

//'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log("Db連接了:)")
});





const app = express()
const path = require ('path');
const ejsMate = require('ejs-mate');
const fs = require('fs');

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views')); //去views資料夾拿ejs

app.use(express.static(path.join(__dirname,'public')));

app.use(express.static(__dirname + '/views/css'));










app.get('/',(req,res)=>{
    res.render('main/index')
})


app.get('/pic/:picid',(req,res)=>{
    // console.log(req.params.picid);
    // console.log(__dirname);
    res.sendFile(__dirname + `/pic/${req.params.picid}`);
})

app.get('/index',(req,res)=>{
    res.render('main/index')
})
app.get('/ch-peng',(req,res)=>{
    res.render('main/ch-peng')
})
app.get('/tp-liang',(req,res)=>{
    res.render('main/tp-liang')
})

app.get('/labmember',  (req,res)=>{
  
    res.render('main/labmember' );
 
       
  
})

const port = process.env.PORT || 3000 ;
app.listen(port,() => {
    console.log(`Listening on port${port}`);
})