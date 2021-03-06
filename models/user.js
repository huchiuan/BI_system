const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    rank:{
        type:String,
        required:true
    }
 
})

UserSchema.plugin(passportLocalMongoose);  //在UserSchema 插入passport-local-mongoose 例如加密完的密碼

module.exports=mongoose.model('User',UserSchema);
