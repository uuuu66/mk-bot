const discord=require("discord.js");
const Room=require('../../schemas/room');
const User=require('../../schemas/user')
async function gameSet(msg,user,roomid){
   const message=msg.content.split("-")[1];
    if(message=='go')
        {       
            let room=await Room.findOne({roomid:roomid});
            let members=room[0].mstiamembers;
            members.push(user);    
           sendMessageAll(msg,"")
          return  await Room.updateOne({roomid:roomid},{mstiamembers:members,mstiaflag:1 })
        }   
    if(message=='cancle')
        {
            return  await Room.updateOne({roomid:roomid},{mstiamembers:[],mstiaflag:0})
        }
    if(message=='st')
        {
            return gaming(1);
        }
}
function sendMessage(msg,message){
    msg.reply(message);
}
function sendMessageAll(msg,message){
    msg.channel.send(message);
}
function gaming(){

}