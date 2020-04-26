const pocketSet = require("../auth").pocketSet ;
const fetch = require('node-fetch');
const Custom = require("../controller/customUtil");

// FIX : timeout and retry.
const Pocket = {
    fetchOptionBase : {
        method : "post",
        headers : {
            "Content-Type" : "application/json; charset=UTF-8",
            "X-Accept" : "application/json"
        },
        timeout: 10000, // ms, node-fetch extension
    },
    url : {
        request : "https://getpocket.com/v3/oauth/request",
        authorize: "https://getpocket.com/v3/oauth/authorize",
        user_auth: "https://getpocket.com/auth/authorize",
        retrieve : "https://getpocket.com/v3/get",
        modify : "https://getpocket.com/v3/send",
    },
    action : {
        addTagsById : this.addTagsById
    },
    getReqToken(){
        const options = this.makeFetchOption(pocketSet);
        return this.fetch(this.url.request,options)
                   .then(response =>{
                       response.redirect_url = this.makeUserAuthUrl(response.code)
                       return response
                   })
    },

    getAccessToken(reqToken){
        const body = {
            consumer_key : pocketSet.consumer_key,
            code : reqToken
        };
        
        const options = this.makeFetchOption(body);
        return this.fetch(this.url.authorize,options)
    },
    authenticate(access_token){
        const body = {
            consumer_key : pocketSet.consumer_key,
            access_token : access_token,
            state : "all",
            tag : "random_readed_testtest"
        };
        
        const options = this.makeFetchOption(body);
        return this.fetch(this.url.retrieve,options)
    },
    getDatas(access_token,params={}){
        const body = {
            consumer_key : pocketSet.consumer_key,
            access_token,
            ...params
        }
        const options = this.makeFetchOption(body);
        return this.fetch(this.url.retrieve,options)
                   .then(this.reformRetriveResponse)

    }, 
    modify(access_token,actions){ // make action chainable
        const body = {
            consumer_key : pocketSet.consumer_key,
            access_token,
            actions
        };
        const options = this.makeFetchOption(body);
        return this.fetch(this.url.modify,options)
    },

    tag_add(access_token,item_id,tag){
        const actions = [{
            action : "tags_add",
            item_id : item_id,
            tags : tag
        }]
        return this.modify(access_token,actions)
    },
    tag_remove(access_token,item_id,tag){
        const actions = [{
            action : "tags_remove",
            item_id : item_id,
            tags : tag
        }]
        return this.modify(access_token,actions)
    },

    fetch(url,options){
        return fetch(url,options)
                .then(response => response.json())
                
    },
    reformRetriveResponse(response) {
        let result = [];
        for (let id in response.list){
            let article = response.list[id]
            article.tags = article.tags ? Object.keys(article.tags) : [];
            result.push(article)
        }
        return result
    },


    makeFetchOption(body){
        return {
            ...this.fetchOptionBase,
            body : JSON.stringify(body)
        }
    },
    makeUserAuthUrl(reqToken){
        return `${this.url.user_auth}?request_token=${reqToken}&redirect_uri=${pocketSet.redirect_uri}`
    }
};

module.exports = Pocket;