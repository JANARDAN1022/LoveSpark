module.exports = (asyncerrorhandling)=>(req,res,next)=>{
    Promise.resolve(asyncerrorhandling(req,res,next)).catch(next);
    }