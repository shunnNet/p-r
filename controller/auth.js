const request = require('request');

function requestTest(url){
    return new Promise( (resolve,reject) => {
        request.get({url:url},(err,res,body) =>{
            if(!body.error){
                console.log(body)
                resolve(body)
            }else{
                console.log("failed.")
                reject(body.error.message)
            }
        })
    })
}

module.exports.requestTest = requestTest;