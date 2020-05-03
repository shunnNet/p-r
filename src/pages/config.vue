<template>
    <validation-observer tag="div" v-if="configs" v-slot="obs">
        <form action="#" method="post" autocomplete="off"
              @submit.prevent="onsubmit($event,obs)">
            <section class="formSection">
                <h3 class="formSection__title">任務</h3> 
                <div class="formSection__body">
                    <div class="formSection__group">
                        <p class="formSection__group__line">
                            請設定要篩選的標籤：
                            <button class="btn--base btn--icon-rotate"
                                    @click.prevent="addMission()"> 
                                <font-awesome-icon icon="plus" class="icon" />
                                <span class="d-none-pad">Add </span> Mission
                            </button>
                        </p>
                    </div>
                    <div v-for="(mission, mid,i ) in configs.mission" :key="mid"
                         class="formSection__group">
                        
                        <validation-provider class="formSection__group__title d-flex f-wrap f-cross-center"
                                             tag="h5" 
                                             :name="'任務名稱'+i" rules="required|min_trim:1|max_trim:30" 
                                             v-slot="vee">
                            <font-awesome-icon icon="pen" class="mg-r-050"/>
                            <input class="editableInput flex-1" size="1" 
                                   placeholder="請輸入任務名稱" type="text" 
                                   name="mission_name" v-model="mission.name">

                            <button v-if="missionOpts.length > 1"
                                    class="btn--lightSub btn--icon-scale mg-l-050 fz-rem100"
                                    @click.prevent="deleteMission(mission.mid)">
                                    <font-awesome-icon icon="times" class="icon" />
                                    <span class="d-none-pad">Delete </span> Mission
                            </button>
                            <p class="w-full" :class="vee.classes"> {{ vee.errors[0] }} </p>
                        </validation-provider>
                            
                        <validation-provider v-for="(filter,ii) in mission.protos" :key="mid + ii"
                                             class="formSection__group__line d-flex f-wrap f-cross-center" 
                                             tag="div" 
                                             rules="required" :name="mission.name +'標籤'+ii" 
                                             v-slot="vee">
                            <span class="mg-r-050 w-full-pad" v-if="ii > 0" >
                                OR：
                            </span>
                            <multiselect placeholder="選擇標籤"
                                         class="flex-1"
                                         v-model="mission.protos[ii]" 
                                         :multiple="true" 
                                         :options="tags" 
                                         :closeOnSelect="false" 
                                         :taggable="true" 
                                         @tag="addTag($event,filter)"></multiselect>  
                            <button class="btn--sub btn--icon-scale mg-l-050 f-self-cross-start" 
                                    v-if="mission.protos.length > 1" 
                                    @click.prevent="mission.protos.splice(ii,1)">
                                <font-awesome-icon class="icon" icon="times" />
                                Del<span class="d-none-pad">ete</span>
                            </button>
                            <p class="w-full" :class="vee.classes"> {{ vee.errors[0] }} </p>
                        </validation-provider>

                        <div class="formSection__group__line">
                            <button class="btn--contrast btn--icon-rotate" 
                                    @click.prevent="addFilter(mission.protos)"> 
                                <font-awesome-icon icon="plus" class="icon" />
                                <span class="d-none-pad">Add </span>Filter 
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="formSection">
                <h3 class="formSection__title">閱讀</h3>
                <div class="formSection__body">
                    <validation-provider class="formSection__group" tag="div"
                                         name="accomplishTag" rules="required|min_trim:1|max_trim:30" v-slot="vee">
                        <p class="formSection__group__line">
                            <label for="accomplishTag" class="d-block-pad mg-b-050-pad">
                                標示已看完的標籤名稱：
                            </label>
                            <input id="accomplishTag" placeholder="自訂標籤名稱" type="text"
                                   class="w-full-pad" 
                                   v-model="configs.viewer.accomplishTag">
                        </p>
                        <p :class="vee.classes"> {{ vee.errors[0] }} </p>
                    </validation-provider>
                    
                    <div v-for="(daySetting, day) in configs.viewer.weekday" :key="day"
                         class="formSection__group" >
                        <p class="formSection__group__line">
                            請設定每日要閱讀的任務 & 篇數：
                        </p>
                        <div v-for="(group,i) in daySetting.missions" :key="day + i"
                             class="formSection__group__line d-flex f-wrap" >
                            <validation-provider tag="div" class="flex-1" 
                                                 :rules="'required|isIn:' + missionOpts " 
                                                 :name="'任務名稱'+i" v-slot="vee">
                                <multiselect placeholder="請選擇任務"
                                             v-model="group.mid"
                                             :options="missionOpts" 
                                             :custom-label="multi_missionCustomLabel"
                                             :show-labels="true"></multiselect>  
                                <p :class="vee.classes" class="w-full">{{vee.errors[0]}}</p>
                            </validation-provider>
                            <validation-provider tag="div" class="mg-l-050" 
                                                 rules="required|min_num:1" :name="'目標數量' + i" v-slot="vee">
                                <input placeholder="文章數" type="text" inputmode="numeric" pattern="[0-9]+"
                                       class="w-full" size="2"
                                       v-model="group.targetNum">
                                <p :class="vee.classes" class="w-full">{{vee.errors[0]}}</p>
                            </validation-provider>
                            <button class="btn--sub btn--icon-scale f-self-cross-start mg-l-050" 
                                    v-if="daySetting.missions.length > 1" 
                                    @click.prevent="daySetting.missions.splice(i,1)">
                                <font-awesome-icon icon="times" class="icon"/>
                                Del<span class="d-none-pad">ete</span>
                            </button>
                        </div>
                        <div class="formSection__group__line">
                            <button class="btn--contrast btn--icon-rotate" 
                                    @click.prevent="addGroup(daySetting.missions)"> 
                                <font-awesome-icon class="icon" icon="plus" />
                                <span class="d-none-pad">Add</span> Group
                            </button>
                        </div>
                        
                    </div>
                </div>
            </section>

            <button class="btn--main btn--icon-rotate fz-120 float-r" type="submit">
                <font-awesome-icon icon="save" class="icon"/>
                Submit
            </button>
        </form>
    </validation-observer>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
@import '../scss/env';
.formSection{
    margin-bottom: 3em;
    &__title{
        font-size: 1.75em;
        font-weight: bold;
        border-bottom: 1px solid #000;
        margin-bottom: 0.5em;
    }
    &__body{
        padding-left : 1em;
    }
    &__group{
        margin-bottom: 2em;

        &__title{
            font-size: 1.25em;
            margin-bottom: 0.5em;
        }
        &__line{
            margin-bottom: 0.5em;
        }
    }
}
    
.multiselect{
    word-break: break-all;
}
</style>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import validate from '../mixins/validate.js';

const multiSelectEx = Vue.component('multiselect',{
    name : 'multiselect',
    extends: Multiselect,
    mounted() {
        this.$el.querySelector(".multiselect__input")
                .setAttribute("readonly","readonly")
    },
})

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
    created(){
        this.configs = this.$set(this,'configs',
                            JSON.parse(JSON.stringify(this.settings)));
    },
    mixins: [ validate ],
    components :{
        Multiselect : multiSelectEx,
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

        missionOpts(){
            let result = [];
            for (const mid in this.configs.mission) {
                result.push(mid);
            }
            return result
        }
    },
    methods: {
        disableMultiselectKeyboard(){
            const multiSelectInputs = document.querySelectorAll(".multiselect__input");
            multiSelectInputs.forEach(ele =>{
                ele.setAttribute("readonly","readonly");
            })
        },
        addMission(){
            var name = "任務" + Math.floor(Math.random()*10000000);
            const newMission = {
                mid : name,
                name,
                protos : [ [] ],
                status : "active",
                weekday: []
            }
            this.$set(this.configs.mission,name,newMission)
        },
        deleteMission(mid){
            this.$delete(this.configs.mission,mid);
        },

        addFilter(filters){
            const newFilter = [];
            filters.push(newFilter)
        },
        addGroup(missions){
            const newGroup = { mid: undefined, targetNum: 1 } ;
            missions.push(newGroup)
        },
        addTag (newTag,target) {
            target.push(newTag);
        },
        onsubmit(event,obs){
            event.preventDefault();
            obs.validate();
            if (obs.valid){
                this.registerDayAtMission();
                this.countWeekdayGroupTargetNum();
                this.$emit("configure",this.configs)
            }
        },
        registerDayAtMission(){
            const missionDict = this.configs.mission;
            for (const mid in missionDict) {
                const mission = missionDict[mid];
                mission.weekday = this.getWeekdaysOfMission(mid);
            }
        },
        countWeekdayGroupTargetNum(){
            const weekdays = this.configs.viewer.weekday;
            for (const day in weekdays){
                weekdays[day].targetNum_total = this.getTargetNumTotalOfWeekday(day);
            }
        },
        getWeekdaysOfMission(mid){
            return this.viewerStack.filter(item => item.mid === mid)
                                   .map(item => item.day)
        },
        getTargetNumTotalOfWeekday(day){
            return this.viewerStack.filter(item => item.day === day)
                                   .reduce((total,current)=> total + parseInt(current.targetNum,10),0)
        },
        multi_missionCustomLabel(mid){
            var mission = this.configs.mission[mid];
            return mission ? mission.name : "不存在的任務";
        },
    },

}
</script>
