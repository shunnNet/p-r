import { ValidationObserver, ValidationProvider ,extend, configure } from 'vee-validate';
import { required,min_value } from 'vee-validate/dist/rules';

configure({
    classes:{
        failed : "vee--failed"
    }
})

extend("required",{
    ...required,
    message: "此欄位必填"
})
extend("min_trim",{
    validate: function(value,args){
        return value.trim().length >= args.length
    },
    params:["length"],
    message: "{_field_} 字數至少 {length} 字"
})

extend("max_trim",{
    validate: function(value,args){
        return value.trim().length <= args.length
    },
    params:["length"],
    message: "{_field_} 字數最多 {length} 字"
})

extend("min_num",{
    ...min_value,
    params: ["min"],
    message:`至少 {min}`
})

extend("isUniqueIn",{
    params:["name","list"],
    validate: function(value,{ list, name } ){
        const isUnique = list.indexOf(value) === list.lastIndexOf(value);
        return isUnique
    },
    message: '不能使用相同的{name}'
})
extend("isIn",{
    params:["list"],
    validate: function(value,{ list } ){
        return list.indexOf(value) !== -1
    },
    message: '不存在的名稱'
})

extend("isUniqueIdInGroups",{
    params:["groups"],
    validate: function(value,{ groups } ){
        console.log(groups)
        return groups.filter(group => {
            console.log(group,value)
            return    group.mid === value
        })
                     .length < 2
        
    },
    message: '不能使用相同的名稱'
})

export default {
    components : {
        ValidationObserver, 
        ValidationProvider
    }
}