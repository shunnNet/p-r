<template>
    <div>
        <button @click="produceViewer()">produce</button>
        <div v-for="group in view" >
            <h3> {{ group.name }} </h3>
            <p v-for="article in group.articles">
                <a :href="article.given_url" target="_blank"> 
                    {{ article.given_title }} 
                </a>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    
    data(){
        return {
            view : [] // divided by tag catagory.
        }
    },
    props: ["articles","settings"],
    methods:{
        produceViewer(){
            let articles = _.map(this.articles, article => Object.assign({},article))

            this.view =  _.chain()
                .thru(() => this.getWeekday())
                .thru(weekday => this.getViewerSetByWeekday(this.settings, weekday).missions)
                .map(mission => {
                    const targetNum = mission.targetNum;
                    const missionSet = this.settings.mission[mission.mid];
                    const randomArticles = this.getRandomArticles(articles, missionSet, targetNum);
                    _.pullAllBy(articles,randomArticles,"item_id")

                    return {
                        ...mission,
                        name: missionSet.name,
                        // TO DO : will render with targetNum 
                        // FIX :  need plus by history
                        //        1. get historyArticles by date & missionId => [...Articles]
                        //        2. pullAllBy historyArticles from articles
                        //        3. targetNum - historyArticles.length
                        //        4. if Num > 0 , get random Article
                        //        5. concat random & history
                        //        6. accomplishNum += historyArticles.length
                        accomplishNum: 0, 
                        articles: randomArticles, 
                        // FIX : add custom data for view 
                        // missionId && 
                        havaArticle : randomArticles.length !== 0,
                        // TO DO : if no article, show custom message, and make no accomplish for mission
                        
                    }
                }).value()
            console.log(this.view)
            return this.view
        },
        getRandomArticles(articles, missionSet, num){
            return _.chain(articles)
                    .filter(article => this.checkIfArticleMatch(article, missionSet))
                    .shuffle()
                    .take(num)
                    
                    .value()
        },
        checkIfArticleMatch(article, missionSet) {
            return _.chain(missionSet.protos)
                    .shuffle()        
                    .filter(filter => {
                        return _.intersection(article.tags, filter).length === filter.length;
                    })
                    .value().length > 0
        },
        getViewerSetByWeekday(setting, weekday) {
            const weekdaySet = setting.viewer.weekday[weekday];
            
            return weekdaySet ? weekdaySet : setting.viewer.weekday.internal;
        },
        getWeekday() {
            const weekday = new Date().getDay()
            return weekday != 0 ? weekday : 7;
        },

    }
}
</script>