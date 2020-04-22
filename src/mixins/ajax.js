export default {
    data() {
        return {
            axioInstance: {},
        }
    },
    created() {
        this.axioInstance = this.$http.create({
            baseUrl: "https://localhost:3000", // FIX : how can I switch env ?
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
            },
            timeout: 5000,
            validateStatus: function (status) {
                return true;
                return  // default
            },
        })
        console.log("create result : ", this.axioInstance)
    },
    methods: {
        ajaxRetrievePreset() {
            return this.axioInstance.get("/ajax/retrieve/preset")
                .then(res => this.ajaxHandleResponse(res));
        },
        ajaxRetrieveArticles() {
            return this.axioInstance.get("/ajax/retrieve")
                .then(res => this.ajaxHandleResponse(res))
        },
        ajaxUpdateSettings(settings) {
            return this.axioInstance.post("/ajax/update/setting",settings)
                .then(res => this.ajaxHandleResponse(res))
        },
        ajaxAccomplishArticle(article,date,mid) {
            const data = {article, date, mid,}
            return this.axioInstance.post("/ajax/accomplish",data)
                .then(res => this.ajaxHandleResponse(res))
        },
        ajaxUnaccomplishArticle(item_id) {
            return this.axioInstance.post("/ajax/removerecord",{item_id})
                .then(res => this.ajaxHandleResponse(res))
        },
        ajaxHandleResponse(response) {
            const responseOk = response.status >= 200 && response.status < 300;
            console.log(response)
            if (responseOk) {
                return Promise.resolve(response.data);
            } else {
                console.log(response);
                return Promise.reject(response.status);
            }
        }
    },
}