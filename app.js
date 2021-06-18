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
const MongoDBStore = require('connect-mongo').default;;
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



const sessionConfig={ //要先設定sessoion 才能用flask顯示
   
    name:'session',
    secret: 'secret',///secret(必要選項)：用來簽章 sessionID 的cookie, 可以是一secret字串或是多個secret組成的一個陣列。
    //如果是陣列, 只有第一個元素會被 簽到 sessionID cookie裡。而在驗證請求中的簽名時，才會考慮所有元素。
    resave:false, //resave：強制將session存回 session store, 即使它沒有被修改。預設是 true
    saveUninitialized:true, //saveUninitialized：強制將未初始化的session存回 session store，未初始化的意思是它是新的而且未被修改。
    cookie: {
       httpOnly:true,
       //secure:true,
       expires:Date.now() +1000*60*60*24*7,  
       //expires (日期) cookie的到期日，超過此日期，即失效。
       //httpOnly (布林) 標記此cookie只能從web server　訪問，以避免不正確的進入來取得竄改。
       //maxAge (數字) 設定此cookie的生存時間(毫秒為單位)，比方60000(10分鐘後到期，必須重新訪問)
       maxAge:1000*60*60*24*7
    }
 }

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());//app.use(session(sessionConfig));要比此行早用 文件說的
passport.use(new LocalStrategy(User.authenticate())); //LocalStrategy 這個官方API 會專注我們用User 這個LOACL的帳密
passport.serializeUser(User.serializeUser());//幫我們對USER 序列化 序列化是指我們如何拿DATA 或是存USER 在session
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
 
    res.locals.success=req.flash('success');
    res.locals.error =req.flash('error');  //丟到partials的flash處理
    next();
 })




app.get('/',(req,res)=>{
     res.render('users/login' );
})


app.get('/pic/:picid',(req,res)=>{
    // console.log(req.params.picid);
    // console.log(__dirname);
    res.sendFile(__dirname + `/pic/${req.params.picid}`);
})

app.get('/index',(req,res)=>{
    if(res.locals.currentUser== undefined){
        req.flash('error', '請先登入系統!');
        return res.redirect('/login')
    }
    // const {id} = req.params;
    const {rank} = res.locals.currentUser
     console.log(res.locals.currentUser)
     console.log(rank)
    //  const guest = await User.findById(id);
  
  
    
  
  
     res.render('main/index' );
})

app.get('/PremierFinancialAccountingInformationAnalysis',async(req,res)=>{

      
    if(res.locals.currentUser== undefined){
        req.flash('error', '帳號權限不夠，無法進入');
        return res.redirect('/index')
    }
    // const {id} = req.params;
    const {rank} = res.locals.currentUser
     console.log(res.locals.currentUser)
     console.log(rank)
    //  const guest = await User.findById(id);
  
  
     if (rank<3) {
        req.flash('error', '帳號權限不夠，無法進入');
        return res.redirect('/index')
     }
  
  
     res.render('main/PremierFinancialAccountingInformationAnalysis' );
})

app.get('/AdvancedFinancialAccountingInformationAnalysis',async(req,res)=>{

      
    if(res.locals.currentUser== undefined){
        req.flash('error', '帳號權限不夠，無法進入');
        return res.redirect('/index')
    }
    // const {id} = req.params;
    const {rank} = res.locals.currentUser
     console.log(res.locals.currentUser)
     console.log(rank)
    //  const guest = await User.findById(id);
  
  
     if (rank<2) {
        req.flash('error', '帳號權限不夠，無法進入');
        return res.redirect('/index')
     }
  
  
     res.render('main/AdvancedFinancialAccountingInformationAnalysis' );
})

app.get('/GeneralFinancialAccountingInformationAnalysis',async(req,res)=>{

      
    if(res.locals.currentUser== undefined){
        req.flash('error', '帳號權限不夠，無法進入');
        console.log('test')
        return res.redirect('/index')
    }
    // const {id} = req.params;
    const {rank} = res.locals.currentUser
     console.log(res.locals.currentUser)
     console.log(rank)
    //  const guest = await User.findById(id);
  
  
     if (rank<1) {
        req.flash('error', '帳號權限不夠，無法進入');
        return res.redirect('/index')
     }
  
  
     res.render('main/GeneralFinancialAccountingInformationAnalysis' );
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
        res.redirect('/register');
    }
})





app.get('/login',  (req,res)=>{
    res.render('users/login');
})

app.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), (req,res)=>{
    req.flash('success','歡迎回來');
    const redirectUrl = req.session.returnTo ||'index';
    res.redirect(redirectUrl);
})

app.get('/logout',  (req,res)=>{
    req.logout();
    req.flash('success','登出成功!');
    res.redirect('/login');
})


const port = process.env.PORT || 3000 ;
app.listen(port,() => {
    console.log(`Listening on port${port}`);
})