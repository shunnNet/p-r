const fetch = require('node-fetch');
const utils = require("./customUtil");
const Pocket = require("./pocket");

module.exports.redirectIfNotAjax = redirectIfNotAjax;
module.exports.getRequestToken = getRequestToken;
module.exports.rejectIfNotAjax = rejectIfNotAjax;
module.exports.retrieveData = retrieveData;
module.exports.modify = modify;

function redirectIfNotAjax(req,res,next){
    if (req.isAjax){
        next()
    }else{
        res.redirect("/login")
    }
}

function rejectIfNotAjax(req,res,next){
    if (req.isAjax){
        next()
    }else{
        res.json({msg: "failed"})
    }
}


function getRequestToken(req,res,next){
    Pocket.getReqToken()
          .then(response =>{
              if (response.ok){
                req.session.request_token = response.data.code;
                response.data.redirect_url = Pocket.makeUserAuthUrl(req.session.request_token)
                req.pocketResponse = response
              }
           
              res.json(req.pocketResponse)
          })
}

function retrieveData(req,res,next){

    Pocket.getDatas(req.session.access_token,{tags:"未讀"})
          .then(response =>{
             res.json(response)
          })
}

function modify(req,res,next) {    
    Pocket.modify(req.session.access_token,
                  req.body.actions)
          .then(response=>{
              res.json(response)
          })
}
