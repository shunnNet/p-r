const fetch = require('node-fetch');
const auth = require("../auth");
const utils = require("./customUtil");
const path = require("path");
const Pocket = require("./pocket");

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
        Pocket.getAccessToken(req.session.request_token)
            .then(response => {
                if (response.ok){
                    req.session.access_token = response.data.access_token; 
                    req.session.username = response.data.username;
                    next()
                }else{
                    res.redirect("/login") // FIX : need return response to webpage
                }
               
            })
    }else{
        next()
    }
}

function toApp(req,res,next){
    res.sendFile( process.cwd() + "/views/app.html")
}



