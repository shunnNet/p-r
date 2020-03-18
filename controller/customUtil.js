
const pocket_url = {
    request : "https://getpocket.com/v3/oauth/request",
    authorize: "https://getpocket.com/v3/oauth/authorize",
    user_auth: "https://getpocket.com/auth/authorize",
    retrieve : "https://getpocket.com/v3/get"
}
const header_base = {
    "Content-Type" : "application/json; charset=UTF-8",
    "X-Accept" : "application/json"
}

function isAjax(req,res,next){
    console.log(req.xhr)
    req.isAjax = req.xhr;
    next()
}


module.exports.isAjax = isAjax;
module.exports.pocket_url = pocket_url;
module.exports.header_base = header_base;
