const fetch = require('node-fetch');
const auth = require("../auth");
const utils = require("./customUtil");
const path = require("path")

module.exports.getLogin = getLogin;
module.exports.redirectIfNoReqToken = redirectIfNoReqToken;
module.exports.getAccessTokenIfhavent = getAccessTokenIfhavent;
module.exports.toApp = toApp;


function getLogin(req,res,next) {
    res.sendFile( process.cwd() + "/views/login.html")
}

function redirectIfNoReqToken(req,res,next){
    if (req.session && req.session.request_token){
        next()
    }else{
        res.redirect("/login")
    }
}

function getAccessTokenIfhavent(req,res,next){
    if (!req.session.access_token){
        const body = {
            consumer_key : auth.consumer_key,
            code : req.session.request_token
        }
        fetch(utils.pocket_url.authorize,{
            method : "post",
            body : JSON.stringify(body),
            headers : utils.header_base
        })
        .then(response => response.json())
        .then(data => {
            req.session.access_token = data.access_token; 
            req.session.username = data.username;
            console.log(req.session)
            next()
        })
    }else{
        next()
    }
}

function toApp(req,res,next){
    res.sendFile( process.cwd() + "/views/app.html")
}



