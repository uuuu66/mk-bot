const mongoose=require('mongoose');
const {Schema}=mongoose
const RoomSchema=new Schema({
    roomid:{
        type:String,
        required: true,
        unique:true,
    },
    cats:{
        type:Array,
        default:null,
    },
    whoiscall:{
        type:Array,
        default:new Array(),
    },
    mstiamember:{
        type:Array
    },
    mstiaflag:{
        type:Number,
        default:0
    },
    mstianames:{
        type:Array
    }

    
});

module.exports=mongoose.model('Room',RoomSchema);
