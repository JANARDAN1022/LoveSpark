const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    FirstName:{
        type:String,
     },
    LastName:{
        type:String,
        maxlength:[30,"SecondName Cannot Exceed 30 Characters"],
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a Valid Email"]
    },
    password:{
        type:String,
        minlength:[8,"Password Should be of Atlease 8 Characters"],
        select:false
    },
    bio:{
        type:String}
        ,
    Gender:{type:String,},
    sexuality:{  type:String},
    age: {type:String},
     Birthday:{type:String},
  interests: [{type:String}],
  occupation: {type:String},
   Location:[{
    country:{type:String},
    State:{type:String},
    city:{type:String}
   }],
   pincode:{type:String},
    createdAt:{
       type:Date,
       default:Date.now,
    },
    ProfileUrl:{type:String},
    CoverUrl:{type:String},
  ExtraUrl:[{type:String}],
    role:{
        type:String,
        default:"user",
    },
    ProfileStatus:{
        type:String,
        default:'Incomplete',
    },
    resetpasswordtoken:String,
    resetpasswordexpired:Date
});
//hiding password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);    
})
//jwt token
 

userSchema.methods.getjwtToken = function(){
    return jwt.sign({id:this._id},process.env.SEC_KEY,{
        expiresIn: process.env.jwtExpire
    });
};

//compare password

userSchema.methods.comparepassword = async function(enteredpassword){
    return  await  bcrypt.compare(enteredpassword,this.password);
}

//resetpassword token
userSchema.methods.getResetPasswordToken = function(){
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hashing and adding to userschema

    this.resetpasswordtoken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetpasswordexpired = Date.now() + 10 * 60 * 1000;

    return resetToken;

}

module.exports = mongoose.model("user",userSchema);