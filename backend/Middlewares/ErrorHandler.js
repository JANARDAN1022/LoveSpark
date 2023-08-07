const errorHandler = (err, req, res, next) => {
    console.log('error',err);
  
    let message = err.message || 'Server Error';
    let statusCode = err.statusCode || 500;
    if(err.name==='CastError'){
        message =`Resource Not Found. Invalid : ${err.path}`;
        statusCode = 400;
    }
  
    res.status(statusCode).json({ success: false, message });
  };
  
  module.exports = errorHandler; 