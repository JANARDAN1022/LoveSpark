const asyncerrorhandler = require('../Middlewares/AsyncError.js');
const ErrorHandler = require('../Middlewares/ErrorHandler.js');
const Report = require('../Models/ReportModel.js');



//Create A Report 
exports.AddReport = asyncerrorhandler(async(req,res,next)=>{
    const {UserID,ReportedUserID,Reason}=req.body;
    // Check if a report with the same UserID, ReportedUserID, and Reason already exists
const ReportExists = await Report.findOne({
    UserID: UserID,
    ReportedUserID: ReportedUserID,
    Reason: Reason,
  });

    if(ReportExists){
        next({message:'Report Already exists',statusCode:403});
    }else{
        const NewReport = await Report.create({
            ReceivedFrom:UserID,
            ReportedUser:ReportedUserID,
            Reason:Reason,
        });

        res.status(200).json({NewReport});
    }
});


