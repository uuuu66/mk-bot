
 module.exports= getRandomArbitrary=function(min, max){
    return Math.random() * (max - min) + min;
  } 
module.exports= measureTime=function(startTime,endTime,settingTime,flag){
  
    if(startTime==undefined){
      startTime=Date.now();
    }
    if(endTime==undefined){
      endTime=Date.now();
    }
    
    function isMatchFunc(measure,set){
      if(measure>set)
      return true;
      else
      return false;
    }
  
  
    let isMatch=0;
    const measureTime=endTime-startTime;
 
    let remainHours=parseInt(measureTime/3600000);

    let remainMinutes=parseInt(parseInt(measureTime%360000)/60000);
    let remainSeconds=parseInt(parseInt(parseInt(measureTime%360000)%60000)/1000);  
      switch(flag){
        case null:      
            isMatch=isMatchFunc(measureTime,settingTime);
        break;  
        case "hour":
          remainHours=parseInt(((startTime+settingTime*3600000)-endTime)/3600000);
         
          remainMinutes=60-(remainMinutes+1);
          remainSeconds=60-(remainSeconds+1);
          isMatch=isMatchFunc(measureTime,settingTime*3600000);
          break;  
        case "minute":
          isMatch=isMatchFunc(measureTime,settingTime*60000);
          remainMinutes=parseInt(((startTime+settingTime*60000)-endTime)/60000);
          remainSeconds=60-(remainSeconds+1);
          break;  
        case "second":
          isMatch=isMatchFunc(measureTime,settingTime*1000);
    
          remainSeconds=parseInt(((startTime+settingTime*1000)-endTime)/1000);
          break;  
      }  
    
      if(isMatch){
        return true;
      }else{
        if(remainHours==0){
          return [false,`다음 행동까지  ${remainMinutes}분,${remainSeconds}초 남았어요.`];
        }else{
          return [false,`다음 행동까지 ${remainHours}시,${remainMinutes}분,${remainSeconds}초 남았어요.`];
        }
      }
    
  }
  async function execute(message, serverQueue) {
    const args = await message.content.split("-");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "음악을 틀려면 보이스채널에 있어야 해요."
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "보이스 채널에 접근할 허가가 필요해요.!"
      );
    }
    youtube.addParam('type', 'video'); 
    youtube.addParam('topicId','/m/04rlf');
        youtube.search(args[2],1,async function(err,result){
      if (err) { console.log(err); return message.reply("서버가 한성컴퓨터라서 느려요. 무슨 오류가 생겼나봐요."); }
    
     args[3]=result.items[0].id.videoId;
     const songInfo = await ytdl.getInfo(args[3]);
    
     const song = {
           title: songInfo.videoDetails.title,
           url: songInfo.videoDetails.video_url,
      };
   
     if (!serverQueue) {
       const queueContruct = {
         textChannel: message.channel,
         voiceChannel: voiceChannel,
         connection: null,
         songs: [],
         volume: 5,
         playing: true
       };
   
       queue.set(message.guild.id, queueContruct);
   
       queueContruct.songs.push(song);
   
       try {
         var connection = await voiceChannel.join();
         queueContruct.connection = connection;
         play(message.guild, queueContruct.songs[0]);
       } catch (err) {
         console.log(err);
         queue.delete(message.guild.id);
         return message.channel.send(err);
       }
     } else {
       serverQueue.songs.push(song);
       return message.channel.send(`${song.title} 이 음악대기열에 넣어졌어요.`);
     }
    });  
  }
  
  