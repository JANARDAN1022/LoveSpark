const asyncerrorhandler = require('../Middlewares/AsyncError.js');
const User = require('../Models/UserModel.js');
const Matched = require('../Models/MatchedModel.js');
const Swipes = require('../Models/SwipeModel.js');
const ErrorHandler = require('../Middlewares/ErrorHandler.js');
const sendToken = require('../utils/JWToken.js');


//Register User Using Email
exports.RegisterUser = asyncerrorhandler(async(req,res,next)=>{
   const {email, password,confirmPassword}=req.body;

   if(password!==confirmPassword){
    return next({message:'Passwords Do Not Match',statusCode:403});
   }

   const UserExists = await User.findOne({email});
   if(UserExists){
    return next({message:'User already Exists LogIn Instead',statusCode:404});
   }else{
    const user = await User.create({
      FirstName:'',
      LastName:'',
      email,password,
      bio:'',
      Gender:'',
      sexuality:'',
      age:'',
      Birthday:'',
      interests:[],
      occupation:'',
      Location:{
        country:'',
        State:'',
        city:'',
       },
       ProfileUrl:'',
       CoverUrl:'',
       ExtraUrl:[],
    });
    sendToken(user,200,res);
   }
});

//Login User With Email
exports.LoginUser= asyncerrorhandler(async(req,res,next)=>{
  const {email,password} = req.body;

  if(!email || !password){
    return next({message: 'Please Enter Email And Password', statusCode: 400})
  }

  const user = await User.findOne({email}).select('+password');

  if(!user){
    return next({message:'User Does Not Exists, Check Your Email and Password again',statusCode:404});
  }

  const passwordmatched = await user.comparepassword(password);
  if(!passwordmatched){
    return next({message:'Incorrect Email or password',statusCode:401});
  } 
  sendToken(user,200,res);
});


//logout
exports.logout = asyncerrorhandler(async (req,res,next)=>{
  res.cookie('token',null,{
      expires: new Date(Date.now()),
      httpOnly: true,
      path:'/',
      secure: true,// Only if your frontend is served over HTTPS     
   });  
  res.status(200).json({success:true,message:"logged out"});
});


// Update user details
exports.updateUser = asyncerrorhandler(async (req, res, next) => {
  const { id } = req.params;
  const { currentPassword, newPassword, ...updateFields } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id).select('+password');

    if (!user) {
      return next({ message: 'User not found', statusCode: 404 });
    }

    // Verify the current password if provided
    if (currentPassword) {
      const passwordMatched = await user.comparepassword(currentPassword);
      if (!passwordMatched) {
        return next({ message: 'Invalid current password', statusCode: 401 });
      }
    }

    // Update user fields
    for (const field in updateFields) {
      if (updateFields[field] !== '') {
        user[field] = updateFields[field];
      }
    }

    // Update the ProfileStatus after fields are updated
    user.ProfileStatus = 'Complete';

    // Update password if a new password is provided
    if (newPassword) {
      if (newPassword === currentPassword) {
        return next({ message: 'NewPassword Cannot Be Same As Old Password', statusCode: 401 });
      }
      user.password = newPassword;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({ success: true, message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.error(error);
    next(error);
  }
});



//Load User On Reload 
exports.LoadUser = asyncerrorhandler(async(req,res,next)=>{

  const user = await User.findById(req.user.id);
  res.status(200).json({
      success:true,
      user
  });

});

// GetAllUsers
exports.GetAllUsers = asyncerrorhandler(async (req, res, next) => {
  const ID = req.params.id;
  const userExists = await User.findById(ID);
  if (userExists) {
    // Find all users where id is not ID and ProfileStatus is Complete
    const users = await User.find({ _id: { $ne: ID }, ProfileStatus: "Complete" });

    // Get the IDs of the users from the 'users' array
    const userIds = users.map(user => user._id);

    // Use the $lookup stage to check if the users are in the Matched collection
    const matchedUsers = await Matched.find({
      $or: [
        { user: ID, swipedUser: { $in: userIds } },
        { swipedUser: ID, user: { $in: userIds } }
      ]
    });

    const swipeExists = await Swipes.find({user:ID,swipedUser:{$in:userIds}});
    // Filter out the users that are in either Matched or Swipes collections
    const filteredUsers = users.filter(user => {
      const userId = user._id.toString();
      return !matchedUsers.some(match => match.user.toString() === userId || match.swipedUser.toString() === userId) &&
      !swipeExists.some(swipe => swipe.user.toString() === userId || swipe.swipedUser.toString() === userId);
    });

    res.status(200).json({
      success: true,
      users: filteredUsers
    });
  } else {
    next({ message: 'No Id Provided', statusCode: 403 });
  }
});


//Get Specific User 
exports.GetUser = asyncerrorhandler(async(req,res,next)=>{
  const UserId = req.params.id;
  const user = await User.findById(UserId);
  if(user){
    res.status(200).json({success:true,user});
  }else{
    next({message:'User Not Found',statusCode:404});
  }
});


//Delete User Account
exports.DeleteAccount = asyncerrorhandler(async(req,res,next)=>{
  const UserId = req.params.id;
  await User.findByIdAndDelete(UserId);
  res.status(200).json({message:'User Deleted'});
});



