const mongoose=require('mongoose');
const {Schema}=mongoose;
const {Types:ObjectId}=Schema;

const catSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    owner:{
        type: String,
        required:true,
      
    },
    character:{
        type:String,
        required:true,
    },
    stats:{
        type:Array,
        required:true,
    },
    lastfeed:{
        type:Number,
        default:0,
    },
    skills:{
        type:Array,
        default:new Array(),
    },
    isdelete:{
        type:Boolean,
        default:false,
    },
    level:{
        type:Number,
        defalut:1,
    },
    experience:{
        type:Number,
        default:0,
    },
    lastcall:{
        type:Number,
        default:0,
    }
    
});
module.exports=mongoose.model("Cat",catSchema);