const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    pocketAccount : { type : String},
    weekdays : {
        "1" : {
            filterCollection : [
                {
                    filter : String,
                    targetNum : {type : Number}
                }
            ]
        },
        "2" : {
            filterCollection : [
                {
                    filter : String,
                    targetNum : {type : Number}
                }
            ]
        },
        "3" : {
            filterCollection : [
                {
                    filter : String,
                    targetNum : {type : Number}
                }
            ]
        },
        "4" : {
            filterCollection : [
                {
                    filter : String,
                    targetNum : {type : Number}
                }
            ]
        },
        "5" : {
            filterCollection : [
                {
                    filter : String,
                    targetNum : {type : Number}
                }
            ]
        },
        "6" : {
            filterCollection : [
                {
                    filter : String,
                    targetNum : {type : Number}
                }
            ]
        },
        "7" : {
            filterCollection : [
                {
                    filter : String,
                    targetNum : {type : Number}
                }
            ]
        },
    },
    filters : {
        /*
        name : {
            id : ? ,
            name : "123456789"
            proto : [ [a,b] , [b,c] ] 
            internal : [ b ]
            spec : [ [a] , [c] ]
        }
        */ // FIX : make it have uniqueID 
    },
    accomplishes : [
        // article objects
    ]
})
/*
    {
        
    }
*/

userSchema.methods.findDocByName = async function (name){
    return await User.findOne({pocketAccount : name}).then(res =>{
        return res
    })
}

const User = new mongoose.model("user", userSchema)



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

module.exports = User;