const asyncerrorhandler = require('../Middlewares/AsyncError.js');
const ErrorHandler = require('../Middlewares/ErrorHandler.js');
const Matched = require('../Models/MatchedModel.js');
const User = require('../Models/UserModel.js');



//Get All Mathces For A Specific User
exports.GetAllMatches = asyncerrorhandler(async(req,res,next)=>{
    const ID = req.params.id;
    const UserExists = await User.findById(ID);
    if(UserExists){
       const Matches = await Matched.find({$or:[
        {user:ID},
        {swipedUser:ID},
    ]}).populate([
        {
            path: "user",
            select: "_id ProfileUrl FirstName LastName",
          },
          {
            path: "swipedUser",
            select: "_id ProfileUrl FirstName LastName",
           }
    ]);
       res.status(200).json({success:true,Matches});
    }else{
        next({message:'Error User Not Found',statusCode:404});
    }
});

//Remove A Match
exports.DeleteMatch = asyncerrorhandler(async(req,res,next)=>{
        const ID = req.params.id;
       const MatchExists = await Matched.findById(ID);
       if(MatchExists){
        await Matched.deleteMany(MatchExists);
        res.status(200).json('Match Deleted Successfully');
       }else{
        next({message:'Match Not Found',statusCode:404});
       }
});


