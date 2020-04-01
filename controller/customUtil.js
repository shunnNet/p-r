

function isAjax(req,res,next){
    req.isAjax = req.xhr;
    next()
}

function sendBackIfPocketApiError(req,res,next){
    if (!req.pocketResponse.ok){
        res.json(req.pocketResponse)
    }else{
        next()
    }
}


module.exports.isAjax = isAjax;

