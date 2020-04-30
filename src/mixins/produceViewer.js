export default {
    data() {
        return {
            view : []  // divided by tag catagory.
        }
    },
    props: ["articles","settings","records"],
    methods: {
        produceViewer(){
            let allArticles = _.map(this.articles, article => JSON.parse(JSON.stringify(article)));
            
            // FIX : I am ugly....................
            this.view = [];

            const recordChain = this.chainFiltedRecordByToday(this.records);
            const historyArticles = recordChain.map(record => record.article).value();
            _.pullAllBy(allArticles,historyArticles,"item_id");

            const recordGroupByMission = recordChain.groupBy("mid")
                                                    .value();
            for (const mid in recordGroupByMission){
                const records = recordGroupByMission[mid];
                recordGroupByMission[mid] = records.map(record => record.article)
            }

            


            const newView =  _.chain()
                .thru(() => this.getWeekday())
                .thru(weekday => this.getViewerSetByWeekday(this.settings, weekday).missions)
                .map(mission => {
                    const targetNum = mission.targetNum;
                    const missionSet = this.settings.mission[mission.mid];

                    // const historyArticles = this.getRecordArticles(this.records,"2020/4/20",mission.mid);
                    let historyArticlesOfMission = recordGroupByMission[mission.mid];
                    historyArticlesOfMission = historyArticlesOfMission ? historyArticlesOfMission : [];

                    const restNum = targetNum - historyArticlesOfMission.length;

                    const randomArticles = restNum > 0 ? this.getRandomArticles(allArticles, missionSet, restNum)
                                                       : [];
                    _.pullAllBy(allArticles,randomArticles,"item_id");

                    // FIX : add historyArticle accomplish status
                    this.addArticleStatus(randomArticles,"unaccomplish"); // FIX : will modify proto array ?
                    this.addArticleStatus(historyArticlesOfMission,"accomplish"); 
                    const resultArticles = historyArticlesOfMission.concat(randomArticles);
                    
                    return {
                        ...mission,
                        name: missionSet.name,
                        // TO DO : will render with targetNum 
                        
                        //  OK      1. get historyArticles by date & missionId => [...Articles]
                        //  OK      2. pullAllBy historyArticles from articles
                        //  OK      3. targetNum - historyArticles.length
                        //  OK      4. if Num > 0 , get random Article
                        //  OK      5. concat random & history
                        //  OK      6. accomplishNum += historyArticles.length
                        accomplishNum: historyArticlesOfMission.length, 
                        articles: resultArticles, 
                        // FIX : add custom data for view 
                        // missionId && 
                        havaArticle : resultArticles.length !== 0,
                        // TO DO : if no article, show custom message, and make no accomplish for mission
                        
                    }
                }).value();
            this.view.push(...newView);
            return this.view
        },
        chainFiltedRecordByToday(records){
            const date = "2020/4/20"
            return _.chain(records)
                    .filter(record => {
                        return record.date === date 
                    })
        },

        addArticleStatus(articles,status){
            //FIX : 1.will modify proto array  2.need add another reason like record
            _.each(articles,article => {
                article.accomplishStatus = status;
                article.isLoading = false;

            })
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
    },
}