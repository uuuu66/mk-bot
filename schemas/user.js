const mongoose=require('mongoose');
const{Schema}=mongoose;
const userSchema=new Schema({
    name:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        default:"!@#!@#!@#!@#!@##@#$$",
       
    },

    isgaming:{
        type:Number,
        default:false,

    },createdAt:{
        type:Date,
        default:Date.now,
    },lastConnectAt:{
        type:Date,
        default:Date.now,
    }


});
module.exports=mongoose.model('User',userSchema);