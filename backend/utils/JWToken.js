const sendtoken = (user,statuscode,res)=>{
    const token = user.getjwtToken();

    //options
    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        path:'/',
        secure: true, // Only if your frontend is served over HTTPS
        sameSite: 'none'   
    };
    res.status(statuscode).cookie('token',token,options).json({success:true,user,token});

}

module.exports = sendtoken;