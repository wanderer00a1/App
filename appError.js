class appError extends Error{
    constructor(status, message){
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = appError;

module.exports.handleAsync = (fn) =>{
    return function(req,res,next){
      fn(req,res,next).catch(e => next(e));
    }
  }
