const fetch = require('node-fetch');
const auth = require("../auth");
const Custom = require("./customUtil");
const CustomModel = require("./customModel");
const path = require("path");
const Pocket = require("./pocket");
const User = require("../model/user");

module.exports.redirectIfhasLogin = redirectIfhasLogin;
module.exports.getLogin = getLogin;
module.exports.toApp = toApp;
module.exports.loginProcess = loginProcess;

function redirectIfhasLogin(req, res, next) {
    if (Custom.getSessionStatus(req.session) === "Logged in") {
        res.redirect("/app")
    } else {
        next()
    }
}

function getLogin(req, res, next) {
    res.sendFile(process.cwd() + "/dist/login.html")
}

function toApp(req, res, next) {
    res.sendFile(process.cwd() + "/dist/app.html")
}

async function loginProcess(req,res,next) {
    const sessionState = Custom.getSessionStatus(req.session);
    
    try {
        switch (sessionState) {
            case "noState" :
                await Promise.reject("User unAuthorize");
                break;
            case "waitAuthorizeApp" :
                var pocketRes = await Pocket.getAccessToken(req.session.request_token);                                            
                req.session.access_token = pocketRes.access_token;
                req.session.username = pocketRes.username;
    
            case "needAuthenticateAccToken":
                await Pocket.authenticate(req.session.access_token)
        }
        const userDoc = await CustomModel.getUserByName(req.session.username)
                                         .catch(() => {
                                            const user = new User({})
                                            return user.initUser(req.session.username)
                                        })
        req.session.setting = {};
        req.session.setting.accomplishTag = userDoc.viewer.accomplishTag ;
        console.log("Login successfully. direct to /app")
        next()
    }catch(e){
        console.log(`login failed: ${e}`)
        Custom.resetSession(req.session);
        res.redirect("/login");;
    }

}



/* login Process
function loginProcess1(req,res,next){
    const hasReqToken = req.session.status === "waitLogin" || req.session.status === "hasLogin";
        
    Promise.resolve(hasReqToken ? true : Promise.reject("User unAuthorize"))
           .then(() => req.session.access_token ? true 
                     : Pocket.getAccessToken(req.session.request_token)
                                .then(response => { 
                                    req.session.access_token = response.access_token
                                    req.session.username = response.username
                                    return true
                                })
                                .catch(err => Promise.reject("Request_token expired, please try again."))
               
            )
           .then(() => {
               return Pocket.authenticate(req.session.access_token)
                            .catch(err => Promise.reject("Access_token invalid, user might disable app authorize once."))
            })
           .then(() => {
                CustomModel.getUserByName(req.session.username)
                    .then(doc => doc)
                    .catch(() => {
                        const user = new User({})
                        return user.initUser(req.session.username)
                    })
                    .then(doc => { 
                        req.session.setting = {
                            accomplishTag : doc.viewer.accomplishTag 
                        }
                    })
                    .catch()

           })
           .then(() => {
                console.log("Login successfully. direct to /app")
                next()
           })
           .catch(err =>{
                console.trace(err)
                Custom.setSessionStatus(req.session,"noState")

                res.redirect("/login");
           })
}

function redirectIfNoReqToken(req, res, next) {
    if (req.session.status === "waitLogin" || 
        req.session.status === "hasLogin") {
        next()
    } else {
        res.redirect("/login")
    }
}

function getAccessTokenIfhavent(req, res, next) {
    if (!req.session.access_token){
        console.log("-------get Access Token")
        Pocket.getAccessToken(req.session.request_token)
        .then(response => {
            req.apiResponse = {
                access_token: response.access_token,
                username: response.username
            };
            next()
        }, err => {
            Custom.setSessionStatus(req.session, "noState")
            res.redirect("/login")
            // FIX : need return response to webpage)
        }) 
    }else{
        req.apiResponse = {
            access_token: req.session.access_token,
            username: req.session.username
        };
        next()
    }
}
function authAccessToken(req, res, next) {
    if (req.session.access_token){
        console.log("-------authenticat Access Token")
        Pocket.authenticate(req.session.access_token)
        .then(response => {
            next()
        }, err => {
            Custom.setSessionStatus(req.session, "noState")
            res.redirect("/login")
            // FIX : need return response to webpage)
        }) 
    }else{
        next()
    }
}

function createUserIfNotExist(req, res, next) {
    CustomModel.getUserByName(req.apiResponse.username)
        .then(doc => doc)
        .catch(res => {
            const user = new User({})
            return user.initUser(req.apiResponse.username)
        })
        .then(doc => { 
            
            req.apiResponse.setting = { 
                accomplishTag : doc.viewer.accomplishTag 
            };
            Custom.setSessionStatus(req.session, "hasLogin", req.apiResponse);
            next()
        })
        .catch(err =>{
            console.log(err)
            Custom.responseByUserError(res,err)
        })
}*/
