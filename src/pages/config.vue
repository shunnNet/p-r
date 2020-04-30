<template>
    <validation-observer v-slot="obs" tag="div" v-if="configs">
        <form action="#" method="post" autocomplete="off"
                        @submit.prevent="onsubmit($event,obs)">
            <h3 class="formSection__title">任務</h3> 
            <div class="formSection__body">
                <p class="formSection__line">
                    請設定要篩選的標籤：
                    <button class="btn--base iconBox--hover-rotate"
                            @click.prevent="addMission()"> 
                        <font-awesome-icon class="icon" icon="plus" />
                        <span class="d-none-pad">Add </span> Mission
                    </button>
                </p>
            </div>
            <div class="formSection__body" v-for="(mission, mid,i ) in configs.mission" :key="mid">
                <div class="formSection__body__group">
                    <validation-provider tag="div" class="formSection__body__title d-flex f-wrap f-cross-center" rules="required|min_trim:1|max_trim:30" :name="'任務名稱'+i" v-slot="vee">
                        <font-awesome-icon class="mg-r-050" icon="pen"/>
                        <input class="editableInput flex-1" size="1" placeholder="請輸入任務名稱" type="text" name="mission_name" v-model="mission.name">
                        <button class="btn--sub-em iconBox--hover-scale mg-l-050 f-size-1rem" 
                                v-if="missionNameList.length > 1"
                                @click.prevent="deleteMission(mission.mid)">
                                <font-awesome-icon class="icon" icon="times"/>
                                <span class="d-none-pad">Delete </span> Mission
                        </button>
                        <p class="w-full" :class="vee.classes"> {{ vee.errors[0] }} </p>
                    </validation-provider>
                        
                    <validation-provider v-for="(filter,ii) in mission.protos" :key="mid + ii" 
                                        tag="div" rules="required" :name="mission.name +'標籤'+ii" v-slot="vee">
                        <div class="formSection__line d-flex f-wrap f-cross-center">
                            <span class="mg-r-050 w-full-pad" v-if="ii > 0" > OR </span>
                            
                            <multiselect class="flex-1" placeholder="選擇標籤" :closeOnSelect="false" v-model="mission.protos[ii]" :options="tags" :multiple="true" :taggable="true" @tag="addTag($event,filter)"></multiselect>  
                            <button class="btn--sub iconBox--hover-scale mg-l-050 f-self-cross-start" v-if="mission.protos.length > 1" @click.prevent="removeFromArrayByIndex(mission.protos,ii)">
                                <font-awesome-icon class="icon" icon="times" />
                                Del<span class="d-none-pad">ete</span>
                            </button>
                            <p class="w-full" :class="vee.classes"> {{ vee.errors[0] }} </p>
                        </div>
                    </validation-provider>
                    
                    <button class="btn--contrast iconBox--hover-rotate" @click.prevent="addFilter(mission.protos)"> 
                        <font-awesome-icon class="icon" icon="plus" />
                        <span class="d-none-pad">Add </span>Filter 
                    </button>
                </div>    
            </div>
            

            <h3 class="formSection__title">閱讀</h3>
            <div class="formSection__body">
                <validation-provider tag="div" class="formSection__body__group" rules="required|min_trim:1|max_trim:30" name="accomplishTag" v-slot="vee">
                    <p class="formSection__line">
                        <label for="accomplishTag" class="d-block-pad w-full-pad mg-b-050-pad">標示已看完的標籤名稱：</label>
                        <input id="accomplishTag" type="text" placeholder="自訂標籤名稱" v-model="configs.viewer.accomplishTag">
                    </p>
                    <p :class="vee.classes"> {{ vee.errors[0] }} </p>
                </validation-provider>
                
                <div class="formSection__body__group" v-for="(daySetting, day) in configs.viewer.weekday" :key="day">
                    <p class="formSection__line">請設定每日要閱讀的任務 & 篇數：</p>
                    <div class="d-flex formSection__line f-wrap " v-for="(group,i) in daySetting.missions" :key="day + i">
                        <validation-provider tag="div" class="flex-1" rules="required" :name="'任務名稱'+i" v-slot="vee">
                            <multiselect :options="missionOpts" 
                                         :custom-label="missionCustomLabel"
                                         :show-labels="true" 
                                         placeholder="請選擇任務"
                                         v-model="group.mid"></multiselect>  
                            <p :class="vee.classes" class="w-full">{{vee.errors[0]}}</p>
                        </validation-provider>
                        <validation-provider tag="div" class="mg-l-050" rules="required|min_num:1" :name="'目標數量' + i" v-slot="vee">
                            <input class="w-full" type="text" placeholder="文章數" inputmode="numeric" size="1" pattern="[0-9]+" v-model="group.targetNum">
                            <p :class="vee.classes" class="w-full">{{vee.errors[0]}}</p>
                        </validation-provider>
                        <button class="btn--sub mg-l-050 iconBox--hover-scale f-self-cross-start" v-if="daySetting.missions.length > 1" @click.prevent="removeFromArrayByIndex(daySetting.missions,i)">
                            <font-awesome-icon class="icon" icon="times" />
                            Del<span class="d-none-pad">ete</span>
                        </button>
                    </div>
                    <button class="btn--contrast iconBox--hover-rotate" @click.prevent="addGroup(daySetting.missions)"> 
                        <font-awesome-icon class="icon" icon="plus" />
                            <span class="d-none-pad">Add</span> Group
                    </button>
                </div>
            </div>
            

            <button class="btn--main formSection__submit iconBox--hover-rotate float-r" type="submit">
                <font-awesome-icon class="icon" icon="save"/>
                Submit
            </button>
        </form>
    </validation-observer>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
@import '../scss/env';
.formSection{
    &__title{
        font-size: 1.75em;
        font-weight: bold;
        border-bottom: 1px solid #000;
        margin-bottom: 0.5em;
    }
    &__line{
        margin-bottom: 0.5em;
    }
    &__body{
        margin-bottom: 2em;
        padding-left : 1em;
        &__title{
            font-size: 1.25em;
            margin-bottom: 0.5em;
        }
        &__group{
            margin-bottom: 1.5em;
        }
    }
    &__submit{
        font-size: 1.2em;
    }
}
    
.multiselect{
    word-break: break-all;
}
</style>

<script>
import Multiselect from 'vue-multiselect';
import validate from '../mixins/validate.js';

export default {
    inheritAttrs: false,
    name: 'config',
    data(){
        return {
            configs : {}
        }
    },
    props: { // Object and Array type default value need return by function.
        settings : {
            type : Object,
            default(){
                return {
                    viewer :{
                        accomplishTag : "random_readed",
                        weekday : {
                            internal : {
                                targetNum_total: 0,
                                mission: [ { mid:"", targetNum:0 } ]
                            },
                        }
                    },
                    mission:{
                        "":{
                            mid: "",
                            name: "",
                            protos: [],
                            status: "",
                            weekday : []
                        }
                    }
                }
            }
        },
        tags: {
            type : Array,
            default(){ return [] }
        }
    },
    // ["settings","tags"],

    watch: {
        settings (newValue,oldValue){
            // TODO : check is this work.
            console.log("watch change");
            this.configs = this.$set(this,'configs',
                                     JSON.parse(JSON.stringify(newValue)))
        }
    },
    created(){
        // FIX: error occur before ajax data back
        this.configs = this.$set(this,'configs',
                            JSON.parse(JSON.stringify(this.settings)))
        console.log("created",this.configs)
        
    },
    mixins:[ validate ],
    components :{
        Multiselect,
    },
    computed: {
    
        viewerStack(){
            const result = [];
            const weekdays = this.configs.viewer.weekday;
            for (const day in weekdays){
                const missions = weekdays[day].missions;
                missions.forEach(mission => {
                    result.push( { mid :mission.mid, day, targetNum :mission.targetNum })
                })
            }
            return result
        },
        
        missionNameList(){
            return Object.values(this.configs.mission).map(mission => mission.name)
        },
        missionIdListInDays(){
            const weekdays = this.configs.viewer.weekday;
            
            const result = {}
            for (const day in weekdays){
                result[day] = weekdays[day].missions ? weekdays[day].missions.map(group => group.mid)
                                                    : [];
            }
            console.log("update",result)
            return result
        },
        missionOpts(){
            const result = [];
            for (const mid in this.configs.mission) {
                if (this.configs.mission.hasOwnProperty(mid)) {
                    result.push(mid)
                }
            }
            //  result.push({mid : "123456789", $isDisabled: true })
            return result
        }
    },
    methods: {
        addMission(){
            var tempName = "任務" + Math.floor(Math.random()*10000000);
            const newMission = {
                mid : tempName,
                name : tempName,
                protos : [ [] ],
                status : "active",
                weekday: []
            }
            this.$set(this.configs.mission,tempName,newMission)

            console.log("newMission", this.configs.mission);
        },
        deleteMission(mid,vee,obs){
            this.$delete(this.configs.mission,mid);
        },
        getWeekdaysOfMission(mid){
            return this.viewerStack.filter(item => item.mid === mid)
                                   .map(item => item.day)
        },
        getTargetNumTotalOfWeekday(day){
            return this.viewerStack.filter(item => item.day === day)
                                   .reduce((total,current)=> total + parseInt(current.targetNum,10),0)
        },
        removeFromArrayByIndex(target,index){
            target.splice(index,1);
        },
        addFilter(filters){
            const newFilter = [];
            filters.push(newFilter)
            console.log("addFilter", filters);
        },
        addGroup(missions){
            const newGroup = { mid: undefined, targetNum: 1 } ;
            missions.push(newGroup)
            console.log("addGroup", missions);
        },

        missionCustomLabel(mid){
            var mission = this.configs.mission[mid];
            return mission ? mission.name : "不存在的任務";
        },
        
        addTag (newTag,target) {
            target.push(newTag);
        },
        onsubmit(event,obs){
            event.preventDefault();
            console.log(obs);
            obs.validate().then(passed=> console.log("obs",passed))
            if (obs.valid){
                this.registerDayAtMission();
                this.countWeekdayGroupTargetNum();
                this.$emit("configure",this.configs)
                console.log(this.configs,"submit")
            }
        },
        registerDayAtMission(){
            const missions = this.configs.mission;
            for (const mid in missions) {
                const mission = missions[mid];
                mission.weekday = this.getWeekdaysOfMission(mid);
            }
        },
        countWeekdayGroupTargetNum(){
            const weekdays = this.configs.viewer.weekday;
            for (const day in weekdays){
                weekdays[day].targetNum_total = this.getTargetNumTotalOfWeekday(day);
            }
        }
    },

}
</script>
