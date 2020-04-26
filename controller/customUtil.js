

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
function deepCopyObj(obj){
    return JSON.parse(JSON.stringify(obj))
}

function responseByPocketError(res,err){
    console.trace("handle err:" + err)
    switch(err.name){
        case "FetchError":
            res.sendStatus(408)
            break;
        case "SyntaxError":
            res.sendStatus(400)
            break;
        default:
            res.sendStatus(404)
    }
}

function responseByUserError(res,err){
    console.trace("handle err:" + err)
    switch (err) {
        case this.ERROR.noDoc:
            res.status(403).send("Can't find user.") 
            break;
        case this.ERROR.articleNotExist:
            res.status(400).send("Article not exist in records.") 
            break;
        case this.ERROR.validation:
            res.status(400).send("format error") 
            break;
        case this.ERROR.unknown: 
        default :
            res.status(500).send("There is an unknown error occur.") 
            break;
    }
}

function getSessionStatus(session){
     return  !session.request_token ? "noState" 
            :!session.access_token  ? "waitAuthorizeApp"
            :!session.setting       ? "needAuthenticateAccToken"
            : "Logged in"
}
function resetSession(session) {
    session.request_token = null;
    session.access_token = null;
    session.username = null;
    session.setting = null;
    return session
}



const ERROR = {
    noDoc : "noDocError",
    validation : "validationError",
    timeout : "timeoutError",
    articleNotExist : "articleNotExist",
    unknown : "unknownError",
}

module.exports = {
    isAjax,
    deepCopyObj,
    ERROR,
    responseByPocketError,
    responseByUserError,
    resetSession,
    getSessionStatus
}

