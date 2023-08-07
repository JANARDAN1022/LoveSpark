const router = require('express').Router();
const passport = require('passport');
const User = require('../Models/UserModel');


router.get('/login/failed',(req,res)=>{
    res.status(401).json({
        success:false,
        message:"Login Error Failed"
    })
})

router.get('/login/success',(req,res)=>{
    if(req.user){
    res.status(200).json({
        success:true,
        message:"Login success",
        user:req.user,
        cookies:req.cookies
    })
}
})





//Google Client Req
router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))

//Call Back Google
/*router.get("/google/callback",passport.authenticate('google',{
    successRedirect:'http://localhost:3000/CompleteProfile',
    failureRedirect:"/login/failed"
}))*/
router.get("/google/callback", passport.authenticate('google', {
    failureRedirect: '/'
  }), async function (req, res) {
    const user = await User.findOne({ email: req.user.email });
    if (user.ProfileStatus==='Complete') {
      // Redirect to the profile page if the user's email exists
      res.redirect('http://localhost:3000/Profile');
    } else {
      // Redirect to the complete profile page if the user's email does not exist
      res.redirect('http://localhost:3000/CompleteProfile');
    }
  });



module.exports = router;