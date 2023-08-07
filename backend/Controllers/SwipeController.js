const asyncerrorhandler = require('../Middlewares/AsyncError.js');
const ErrorHandler = require('../Middlewares/ErrorHandler.js');
const Swipe = require('../Models/SwipeModel.js');
const User = require('../Models/UserModel.js');
const Matched = require('../Models/MatchedModel.js');



//Add Swiped Left/Right user To Collection
exports.AddSwipe = asyncerrorhandler(async(req,res,next)=>{
    const {userId,SwipedId,direction} = req.body;
    const UserExists = await User.findById(userId);
    if(UserExists){
         const SwipedUserExists = await User.findById(SwipedId);
         if(SwipedUserExists){
            const SwipeExists = await Swipe.find({user:userId,swipedUser:SwipedId});
           
            if(SwipeExists.length>0){
              next({message:'Swipe already Exists',statusCode:403});
            }else{
             // Check if a match already exists
        const MatchExists = await Matched.findOne({
            $or: [
              { user: userId, swipedUser: SwipedId },
              { user: SwipedId, swipedUser: userId },
            ],
          });
          
          if(MatchExists){
                next({message:'Matched Already Cannot Swipe',statusCode:403});
            }else{
            const matched = await Swipe.find({user:SwipedId,swipedUser:userId,direction:'right'});
            const Rejected = await Swipe.find({user:SwipedId,swipedUser:userId,direction:'left'});
            
            if(matched.length>0){
                await Matched.create({
                    user:userId,
                    swipedUser:SwipedId,
                });
               await Swipe.deleteOne({user:SwipedId,swipedUser:userId,direction:'right'});
            }else if(Rejected.length>0){
             var SwipeInfo =  await Swipe.create({
                user:userId,
                swipedUser:SwipedId,
                direction,
                Status:'Rejected'    
            })
            }else{
            var SwipeInfo = await Swipe.create({
                user:userId,
                swipedUser:SwipedId,
                direction,
                Status:'Pending'
            });
        }        
            res.status(200).json({success:true,SwipeInfo});
    }
        }
        }else{
            next({message:'Swiped User Does Not Exist',statusCode:404});
         }
    }else{
        next({message:'User Not Authorized Please Login again',statusCode:403})
    }
});