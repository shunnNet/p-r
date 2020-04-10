const mongoose = require("mongoose");
const Custom = require("../controller/customUtil");

const userSchema = new mongoose.Schema({
    pocketAccount : { 
        type : String ,
        required : true
    },
    viewer : {
        accomplishTag: String,
        weekday : {
            internal : {
                targetNum_total: {type : Number},
                missions: [
                    {
                        mid: String,
                        targetNum: {type: Number}
                    }
                ]
            },
        }

    },
    mission : {
        // Sample
        /*"123456789": {
            mid: "sample",
            name: "sample",
            protos: [
                ["動畫", "學校"],
                ["工作"]
            ],
            status: "active",
            weekday : ["internal","1","2"]
        },*/
    },
    records : []
    /* [ { 
            article: {}, 
            date: dataString,
             missionId : id 
        } ] */
})

userSchema.methods.initUser = function(username){
    this.overwrite({ // replace document with input object
        pocketAccount : username,
        viewer : {
            accomplishTag : "random_readed",
            weekday : {
                internal : {
                    targetNum_total: 0,
                    missions: []
                }
            }
        },
        mission : {},
        records : [],
    }) 
    return this.customSave()
}


userSchema.methods.updateSettings = function (newSetting){
    // FIX :
    // missions in weekday will generate new _id when update
    // and mid will not
    // try only update new setting
    // and there is so many layer in weekday
    
    console.log("model : update setting start.");
    this.viewer = newSetting.viewer;
    this.mission = newSetting.mission;
    const inputMissionSets = this.mission; 

    const updateIdList = [];

    for (inputMissionId in inputMissionSets){
        const isNewMission = !mongoose.isValidObjectId(inputMissionId);
        
        if(isNewMission){
            const realId = String(new mongoose.Types.ObjectId());
            updateIdList.push({ inputMissionId, realId  })
        }
    }
    console.log("model : realId generate end. start replace them.");
    
    const realMissionSets = this.replaceTempIdInMissionSet(inputMissionSets,updateIdList);
    console.log("model : replace realMissionSets end.");
    
    const realViewer = this.replaceTempIdInViewer(this.viewer,inputMissionSets,updateIdList);
    console.log("model : replace realViewer end.");
    
    this.mission = realMissionSets;
    this.viewer = realViewer;
    
    console.log("model : save.");
    return this.customSave().then(savedDoc => (
        {viewer : this.viewer, mission: this.mission}
    ))
}

userSchema.methods.replaceTempIdInMissionSet = function(inputMissionSets,updateIdList){
    const copyMissionSets = Custom.deepCopyObj(inputMissionSets)

    updateIdList.forEach(update =>{
        const copyMission = Custom.deepCopyObj(inputMissionSets[update.inputMissionId]);
        copyMission.mid = update.realId ;
        copyMissionSets[update.realId] = copyMission;

        delete copyMissionSets[update.inputMissionId];
    })

    return copyMissionSets
}

userSchema.methods.replaceTempIdInViewer = function(viewer,inputMissionSets,updateIdList){
    
    const copyViewer = Custom.deepCopyObj(viewer)
    
    try {
        updateIdList.forEach(update =>{
            const missionInDay = inputMissionSets[update.inputMissionId].weekday;
            missionInDay.forEach(day =>{
                copyViewer.weekday[day]
                          .missions
                          .find(mission => {
                              console.log("find");
                              
                            console.log(mission)
                            console.log(update.inputMissionId)
                            return mission.mid == update.inputMissionId
                            })
                          .mid = update.realId
            })
        })
        
    }catch(e){
        console.log("error occur: "+e)
    }
    return copyViewer
}

userSchema.methods.removeRecord = function(body){
    const recordPos = this.findIndexOfRecordByItemId(body.item_id);
    
    if (recordPos >= 0){
        const deprecateRecord = this.records[recordPos];
        this.records.splice(recordPos,1);
        return this.customSave().then(()=> deprecateRecord);
    }else{
        return Promise.resolve()
    }
}

userSchema.methods.pushRecordWithTag = function(body,accomplishTag){
    // FIX : Validation
    const recordPos = this.findIndexOfRecordByItemId(body.article.item_id);
    if (recordPos === -1){
        body.article.accomplishTag = accomplishTag;
        this.records.push(body)
        return this.customSave();
    }else{
        return Promise.resolve()
    }
    /*{
        msg : "body must be the example like.",
        body : {
            article : {
                item_id : item_id
            },
            date : "2020/4/9",
            mid :  "5e8ef0d5968ab2377c61e25a"
        }
    } */
}

userSchema.methods.customSave = function(){
    console.log("try to save.")
    return this.save()
               .catch(err =>{
                   console.log(err)
                    return err.name === "ValidationError" ? 
                            Promise.reject(Custom.ERROR.validation)
                            : Promise.reject(Custom.ERROR.unknown)
               })
}

userSchema.methods.findIndexOfRecordByItemId = function(item_id){
    return this.records.findIndex(record => {
        return record.article.item_id == item_id
    })
}


const User = new mongoose.model("user", userSchema)


module.exports = User;

/*


var people = new User({
    pocketAccount : "testUpdateSetting",
    mission : {
        a : {
            id : "a",
            name : "teacher",
            protos: [
                ["動畫", "學校"],
                ["工作"]
            ],
            status: "active",
            weekday : ["internal","1","2"]
        }
    },
    viewer : {
        weekday : {
            internal:{
                targetNum_total: 2,
                missions:[ { id: "a" , targetNum: 2} ]
            },
            "1":{
                targetNum_total: 2,
                missions:[ { id: "a" , targetNum: 2} ]
            },
            "2":{
                targetNum_total: 2,
                missions:[ { id: "a" , targetNum: 2} ]
            }
        }
    }
})*/
/*
people.updateSettings()
      .then(res =>{
          console.log("OK",res)
      },err => {
          console.log("failed",err)
      })
*/
/*
people.save(err =>{
    if (err){ console.log(err) }else{
        console.log(people)
    }
})*/



/*
User.findById("5e8305d39d59a94ec4060b57",(err ,res)=>{
    res.filters = {}
    res.filters.test = "123"
    res.save((err)=>{
        if(err){ console.log(err)}else{console.log("Save successfully.")}
    })
})


/*
const user = new User({
    pocketAccount : "wendell20904102@gmail.com",

})
/*
User.


User..test = {
    proto : [ ["html","vue"] ],
    internal : ["html"],
    spec : ["vue"] 
}

user.save((err)=>{
    if(err){ console.log(err)}else{console.log("Save successfully.")}
})
*/
