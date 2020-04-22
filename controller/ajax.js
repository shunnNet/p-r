const fetch = require('node-fetch');
const Custom = require("./customUtil");
const Pocket = require("./pocket");
const CustomModel = require("./customModel");

// FIX : need refuse when not login
module.exports = {
    redirectIfNotAjax,
    getRequestToken,
    rejectIfNotAjax,
    retrieveData,
    modify,
    updateSettings,
    rejectIfHaventLogin,
    addTagForAccomplish,
    pushRecord,
    removeAccomplishTag,
    removeRecord,
    retrievePresetData
}

function redirectIfNotAjax(req, res, next) {
    if (req.isAjax) { next() }
    else { res.redirect("/login") }
}

function rejectIfNotAjax(req, res, next) {
    if (req.isAjax) { next() }
    else { res.sendStatus(400) }
}
function rejectIfHaventLogin(req, res, next) {
  
    if (Custom.getSessionStatus(req.session) === "Logged in") { next() }
    else { res.sendStatus(401) }
}


function getRequestToken(req, res, next) {
    Pocket.getReqToken()
        .then(response => {
            req.session.request_token = response.code;
            res.json(response);
        },
            err => Custom.responseByPocketError(res, err))
}

function retrieveData(req, res, next) {
    Pocket.getDatas(req.session.access_token, { state: "all", detailType: "complete" })
          .then(response => res.json(response),
              err => Custom.responseByPocketError(res, err))
}

function retrievePresetData(req, res, next) {
    Promise.all([
        Pocket.getDatas(req.session.access_token, { state: "all", detailType: "complete" }),
        CustomModel.getUserByName(req.session.username)
        // FIX : if Custom.getUserByName, Promise will not catch the error.
    ]).then(datas =>{
        
        const response = {
            all_articles : datas[0],
            document : datas[1]
        }
        console.log("retrievePresetData Ok. send response")
        res.json(response)
    }).catch(err => {
        // Fix : try to combine two error function
        if (err.hasOwnProperty("name")){
            Custom.responseByPocketError(res,err)
        }else{
            Custom.responseByUserError(res,err)
        }
    })
}


function updateSettings(req, res, next) {
    console.log("update setting");
    CustomModel.getUserByName(req.session.username)
        .then(doc => {

            return doc.updateSettings(req.body)
        })
        .then(turnBack => {
            console.log("model : save complete. send response.");
            req.session.setting.accomplishTag = turnBack.viewer.accomplishTag;
            console.log("update session : accomplishTag")
            res.json(turnBack)
        })
        .catch(err => Custom.responseByUserError(err))
}

function addTagForAccomplish(req, res, next) {

    const accomplishTag = req.session.setting.accomplishTag;
    console.log("req.body:", req.body)
    Pocket.tag_add(req.session.access_token,
        req.body.article.item_id,
        accomplishTag)
        .then(response => {
            console.log("accomplish request ok")
            console.log("response :" + response)
            next()
        },
            err => Custom.responseByPocketError(res, err))
}

function pushRecord(req, res, next) {
    const accomplishTag = req.session.setting.accomplishTag;
    CustomModel.getUserByName(req.session.username)
        .then(doc => {
            req.targetDoc = doc;
            return doc.pushRecordWithTag(req.body, accomplishTag)
        })
        .then(savedDoc => {
            const response = savedDoc ? savedDoc.records 
                            : req.targetDoc.records;
            res.json(response)
        })
        .catch(err => {
            if (err !== Custom.ERROR.validation) {
                Custom.responseByUserError(res, err)
            } else {
                const accomplishTag = req.session.setting.accomplishTag;
                Pocket.tag_remove(req.session.access_token,
                    req.body.item_id,
                    accomplishTag)
                    .finally(() => Custom.responseByUserError(res, err))
            }

        })
}

function modify(req, res, next) {
    Pocket.modify(req.session.access_token,
        req.body.actions)
        .then(response => res.json(response),
            err => Custom.responseByPocketError(res, err))
}

function removeRecord(req, res, next) {
    CustomModel.getUserByName(req.session.username)
        .then(doc => {
            req.targetDoc = doc;
            return doc.removeRecord(req.body)
        })
        .then(deprecateRecord => {
            console.log("set deprecateRecord.")
            req.deprecateRecord = deprecateRecord;
            next()
        })
        .catch(err => Custom.responseByUserError(res, err))

}

function removeAccomplishTag(req, res, next) {
    const accomplishTag = req.deprecateRecord ? req.deprecateRecord.article.accomplishTag
        : req.session.setting.accomplishTag
    Pocket.tag_remove(req.session.access_token,
        req.body.item_id,
        accomplishTag)
        // TODO : make this send saved records or make add tags send single record
        // Note : is about how it recover on error, check the catch block below.
        .then(() => res.json(req.deprecateRecord),
            err => Custom.responseByPocketError(res, err))
        .catch(err => {
            if (req.deprecateRecord){
                // NOTE : recovery mechnism ?
                doc.pushRecordWithTag(deprecateRecord, accomplishTag)
                .then(() => Custom.responseByPocketError(res, err))
                .catch(() => {
                    console.log("unknown error. need handle.")
                    Custom.responseByUserError(res, err)
                })
            }else{
                Custom.responseByPocketError(res, err)
            }
        })
}








/* Blog source
function pushRecord(req,res,next){
    const saveDocProcess = CustomModel.getUserByName(req.session.username)
                                   .then(doc => doc.pushRecordWithTag(req.body,accomplishTag),
                                         noDocError => Promise.reject( noDocError ) )

    saveDocProcess.then(savedDoc => res.json(savedDoc.records))
    saveDocProcess.catch(err =>{
        switch (err){
            case "noDocError":
                res.sendStatus(403)
                break;
            case "validationError":
                return //Do something function call
        }
    })
    CustomModel.getUserByName(req.session.username)
            .then(doc => doc.pushRecordWithTag(req.body,accomplishTag),
                  noDocError => Promise.reject( noDocError ) )
            .then(savedDoc => res.json(savedDoc.records),
                  err =>{
                    switch (err){
                        case "noDocError":
                            res.sendStatus(403)
                            break;
                        case "validationError":
                            //Do something function call
                            return
                    }
                  })

    CustomModel.getUserByName(req.session.username)
            .then(doc =>{
                return doc.pushRecordWithTag(req.body,accomplishTag)
                          .then(savedDoc => { res.json(savedDoc.records) },
                                validationError => Promise.reject(validationError))
            },err => { res.sendStatus(403) })
            .reject(err => {
                const accomplishTag = req.session.setting.accomplishTag;
                const actions = [
                    {
                      action: "tags_remove",
                      tags: accomplishTag ,
                      item_id : req.body.item_id
                    }
                ];
                Pocket.modify(req.session.access_token,actions)
                      .then(response =>{
                          if (response.ok){
                            res.sendStatus(400)
                          }else{
                            res.sendStatus(400)
                            // FIX : 第一次成功，第二次連線逾時 ？
                          }
                      })
            })
}*/