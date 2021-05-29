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



const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
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


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());//app.use(session(sessionConfig));要比此行早用 文件說的
passport.use(new LocalStrategy(User.authenticate())); //LocalStrategy 這個官方API 會專注我們用User 這個LOACL的帳密
passport.serializeUser(User.serializeUser());//幫我們對USER 序列化 序列化是指我們如何拿DATA 或是存USER 在session
passport.deserializeUser(User.deserializeUser());






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
        const{rank,username,password}=req.body;
        const user =new User ({rank,username});
        console.log(user)
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