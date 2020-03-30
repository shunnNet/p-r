const auth = require("../auth");
const fetch = require('node-fetch');

const Pocket = {
    fetchOptionBase : {
        method : "post",
        headers : {
            "Content-Type" : "application/json; charset=UTF-8",
            "X-Accept" : "application/json"
        }
    },
    url : {
        request : "https://getpocket.com/v3/oauth/request",
        authorize: "https://getpocket.com/v3/oauth/authorize",
        user_auth: "https://getpocket.com/auth/authorize",
        retrieve : "https://getpocket.com/v3/get",
        modify : "https://getpocket.com/v3/send"
    },
    action : {
        addTagsById : this.addTagsById
    },
    async getReqToken(){
        const options = this.makeFetchOption(auth);
        return await this.fetch(this.url.request,options)
    },

    async getAccessToken(reqToken){
        const body = {
            consumer_key : auth.consumer_key,
            code : reqToken
        };
        
        const options = this.makeFetchOption(body);
        return await this.fetch(this.url.authorize,options)
    },
    async getDatas(access_token,params={}){
        const body = {
            consumer_key : auth.consumer_key,
            access_token,
            ...params
        }
        const options = this.makeFetchOption(body);
        return await this.fetch(this.url.retrieve,options)

    }, 
    async modify(access_token,actions){ // make action chainable
        const body = {
            consumer_key : auth.consumer_key,
            access_token,
            actions
        };
        const options = this.makeFetchOption(body);
        return await this.fetch(this.url.modify,options)
    },
    

    async fetch(url,options){
        return await fetch(url,options)
                    .then(response => {
                        var data = response.ok ? response.json() : response.text()
                        return data.then(d => {
                            return {
                                ok : response.ok,
                                status : response.status,
                                statusText : response.statusText,
                                data : d
                            }
                        })
                    }, err=> {
                        return {
                            ok : false,
                            status : 404,
                            statusText : "newwork error",
                            data : "network error"
                        }
                    })
    },


    makeFetchOption(body){
        return {
            ...this.fetchOptionBase,
            body : JSON.stringify(body)
        }
    },
    makeUserAuthUrl(reqToken){
        return `${this.url.user_auth}?request_token=${reqToken}&redirect_uri=${auth.redirect_uri}`
    }
};


module.exports = Pocket;