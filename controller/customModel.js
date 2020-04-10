const User = require("../model/user");
const Custom = require("./customUtil");

function getUserByName(username) {
    
    return new Promise((resolve, reject) => {
        User.findOne({ pocketAccount: username }).then(doc => {
            if (doc) {
                resolve(doc)
            } else {
                reject(Custom.ERROR.noDoc)
            }
        })
    })
}


module.exports = {
    getUserByName
}