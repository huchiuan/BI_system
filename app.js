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




const passport = require('passport');
const flash= require('connect-flash');

const app = express()
const path = require ('path');
const ejsMate = require('ejs-mate');
const fs = require('fs');

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views')); //去views資料夾拿ejs

app.use(express.urlencoded({extended:true})); //可以解析req內的東西

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

app.get('/register',  (req,res)=>{
    res.render('users/register' );
})
app.post('/register', async(req,res)=>{

    // const{ rank,username,password}=req.body;
   
    try{
        const{ rank,username,password}=req.body;
        const user =new User ({rank,username});
        const registerdUser = await User.register(user,password);  //.register是passport的fun 可以把不用salt的放前面 要加salt的放後面
        //也會用passport 判斷MONGODB 裡面的資料的狀況
        console.log(registerdUser);

        req.login(registerdUser,err =>{ //passport 的login fun 在註冊完可以直接登入用 不用再自己登入一次
            if (err) return next(err);
            req.flash('success','註冊成功');
            res.redirect('/index');
        })
       
    } catch(e){
        req.flash('error',e.message);
        res.redirect('/index');
    }
})

const port = process.env.PORT || 3000 ;
app.listen(port,() => {
    console.log(`Listening on port${port}`);
})