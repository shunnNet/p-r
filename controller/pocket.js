const fetch = require('node-fetch');
const auth = require("../auth");
const utils = require("./customUtil");

function redirectIfNotAjax(req,res,next){
    if (req.isAjax){
        next()
    }else{
        res.redirect("/login")
    }
}


function getRequestToken(req,res,next){
    fetch(utils.pocket_url.request,{
        method : "post",
        body : JSON.stringify(auth),
        headers : utils.header_base
    })
    .then(response => response.json())
    .then( response =>{
        req.session.request_token = response.code;
        next()
    })
}
function sendAuthUrl(req,res,next){
    const redirect_url = `${utils.pocket_url.user_auth}?request_token=${req.session.request_token}&redirect_uri=${auth.redirect_uri}`
    const sendBack ={
        redirect_url
    }
    res.json(sendBack)
}

function rejectIfNotAjax(req,res,next){
    if (req.isAjax){
        next()
    }else{
        res.json({msg: "failed"})
    }
}

function retrieveData(req,res,next){
    const body = {
        consumer_key : auth.consumer_key,
        access_token : req.session.access_token
    }
    fetch(utils.pocket_url.retrieve,{
        method : "post",
        body : JSON.stringify(body),
        headers : utils.header_base
    }).then(response => response.json())
      .then(response => {
          res.json(response)
      })
}


module.exports.redirectIfNotAjax = redirectIfNotAjax;
module.exports.getRequestToken = getRequestToken;
module.exports.sendAuthUrl = sendAuthUrl;
module.exports.rejectIfNotAjax = rejectIfNotAjax;
module.exports.retrieveData = retrieveData;
