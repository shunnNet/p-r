const fetch = require('node-fetch');
const auth = require("../auth");
const utils = require("./customUtil");
const path = require("path");
const Pocket = require("./pocket");
const User = require("../model/user");

module.exports.redirectIfhasLogin = redirectIfhasLogin;
module.exports.getLogin = getLogin;
module.exports.redirectIfNoReqToken = redirectIfNoReqToken;
module.exports.getAccessTokenIfhavent = getAccessTokenIfhavent;
module.exports.toApp = toApp;
module.exports.createUserIfNotExist = createUserIfNotExist

function redirectIfhasLogin(req, res, next){
    if (req.session.access_token){
        res.redirect("/app")
    }else{
        next()
    }
}

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

function createUserIfNotExist (req,res,next){
    User.findOne({pocketAccount : req.session.username }).then(doc =>{
        if (!doc){
            const user = new User({ pocketAccount : req.session.username })
            user.save( err => {
                if (!err) { console.log("create successfully!") }
                else { console.log(err)/* FIX : Need Clear Session and login once again ?  */ }
                next()
            })
        }
    })

}

function toApp(req,res,next){
    res.sendFile( process.cwd() + "/views/app.html")
}



