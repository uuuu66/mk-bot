const {Client,MessageEmbed,MessageAttachment,Guild,Emoji}=require('discord.js');
const ytdl=require('ytdl-core');
const token=require('./token.json');
const fs=require('fs');
const catProperties=require("./catProperties.json");
const logpath="./logs/logs.txt";
const client=new Client();
const command='$mk';
const joke=fs.readFileSync('./joke.txt','utf-8');
const jokes=joke.split('\r\n');
const connect=require('./schemas/index');
const User=require('./schemas/user');
const Cat=require('./schemas/cat');
const Room=require('./schemas/room');
const CatActivity=require('./catActivity/catActivity');
const catCharacters=catProperties.character;
const prefix="$mkmusic-";
const queue = new Map();
const youtubenode=require('youtube-node');
const keys=require('./key.json');
const youtube=new youtubenode();
const roomQueue=new Map();

 youtube.setKey(Object.values(keys)[1]);

client.on('ready', async function(){
  let today=new Date();
  let now =today.getHours()+"시,"+today.getMinutes()+"분,"+today.getSeconds()+"초,"+today.getMilliseconds()+"밀리초\n";
  let user=client.user;
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity("$mk-help<도움말 띄어쓰기 x",'playing').then(console.log("set activity completed"))
    .catch(function(error){console.log(error)});
    connect();
   
  
  
});


client.on('message',async function(msg){
    let today=new Date();
    let now =today.getHours()+"시,"+today.getMinutes()+"분,"+today.getSeconds()+"초,"+today.getMilliseconds()+"밀리초\n";
    let user=String(msg.author);
    let guildid=String(msg.guild.id);
    let catWhowillbeCalled=0;
    
    const serverQueue = queue.get(msg.guild.id);

      if (msg.content.startsWith(`${prefix}play`)) {
        execute(msg, serverQueue);
        return;
      } else if (msg.content.startsWith(`${prefix}skip`)) {
        skip(msg, serverQueue);
        return;
      } else if (msg.content.startsWith(`${prefix}stop`)) {
        stop(msg, serverQueue);
        return;
      } 



    

    const thisroom= await Room.find({
      roomid:guildid
    });
    if(thisroom.length!=0){
      catWhowillbeCalled=thisroom[0].whoiscall;
    }else{
        await Room.create({
         roomid:guildid,
        });
    }
    
  for(let i=0;i<catWhowillbeCalled.length;i++){
    if(msg.content.includes(catWhowillbeCalled[i])){
          let findCat=await Cat.find().and([{
            owner:user},{
            name:catWhowillbeCalled[i],
          
          }]);
         if(findCat.length==0){
            return 0;
         }
          let path= await CatActivity(findCat[0],'call');
          let nowFriendly=findCat[0].stats;
          nowFriendly[1]+=5;
          await Cat.updateOne({
            owner:user},{  stats:nowFriendly,
          });
         let catCallImage=new MessageAttachment(String(path[0]));
         await msg.channel.send(msg.author,catCallImage);  
         await msg.reply(path[1]);
    }
  }

  if(msg.content.startsWith(command)){    
    new Promise(function(resolve,reject){
      fs.appendFileSync(logpath,now+user+":"+msg.content+"\n");
      const detailCommand=msg.content.split('-');
      resolve(detailCommand);
    }).then(function(detailCommand){
        
        switch(detailCommand[1]){
          case 'help':
            
            
            const embededMsg=new MessageEmbed()
            .setTitle("_MK_봇 사용설명서")
            .setColor("#1ABC9C")//aqua
            .setDescription(":wave:안녕하세요._MK_봇 사용자 여러분.:wave:\n_MK_봇은 :cat:고양이 키우기 :headphones: 음악듣기 등등의 기능을 제공합니다." 
            +"\n\n"+":globe_with_meridians: _MK_봇 사용설명서를 알려드리겠습니다.:globe_with_meridians:"
            +"\n\n"+":mushroom: 모든 명령어는 띄어쓰기를 안붙입니다.:mushroom: "
            +"\n\n\n"+"일반 명령어 목록입니다.일반 명령어는 '$mk-'로 시작합니다."  
            +"\n\n"+"   :one:  __________   $mk-help:도움말 보기"
            +"\n\n"+"   :two:  __________   $mk-joke:유머듣기"
            +"\n\n"+"   :three:  __________   $mk-hi:봇에게 인사하기"
            +"\n\n\n"+":cat:$mcat-'로 시작하는 것-고양이 키우기 관련 명령어입니다.:cat:"
            +"\n\n"+"   :one:  __________   $mcat-adopt:도트고양이 입양하기"
            +"\n\n"+"   :two:  __________   $mcat-feed:도트고양이 간식주기"
            +"\n\n"+"   :three:  __________   $mcat-iscall/true:도트고양이 이름부르면 대답하기 설정"
            +"\n\n"+"   :four:  __________   $mcat-iscall/false:도트고양이 이름부르면 대답하기 해제"
            +"\n\n"+"   :five:  __________   $mcat-status:도트고양이 상태보기"
            +"\n\n"+"   :six:  __________   $mcat-bye:도트고양이와 이별하기"
            +"\n\n"+"   :seven:  __________   $mcat-help:도트고양이 관련 도움말 보기"
            +"\n\n\n"+":headphones:$mkmusic-'로 시작하는 것-고양이 키우기 관련 명령어입니다.:headphones:"
            +"\n\n"+"   :one:  __________   $mkmusic-play-제목:노래이름을 가진 노래 재생"
            +"\n\n"+"   :two:  __________   $mkmusic-skip:노래 스킵하기 "
            +"\n\n"+"   :three:  __________   $mkmuisc-stop:음악대기열 완전히 비우기 "
            


            )


            return msg.channel.send(embededMsg);
          case 'joke':
            new Promise(function(resolve,reject){
              setTimeout(function(){
                msg.reply("ㅋㅋㅋㅋㅋㅋㅋ웃긴 드립 하나 간다 ㅋㅋㅋㅋㅋㅋ");
                resolve(resolve);
              },0)
            }).then(function(){
              
              setTimeout(function(resolve){
                const resultJoke=jokes[parseInt(getRandomArbitrary(0,jokes.length))];
              console.log(resultJoke);
              msg.reply(resultJoke+"\nㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ");
              
                return 
              },2000)
            });
            break;      
          case 'cyphers':
            return msg.reply('그런겜을 하세요...?');
          case 'hi':
            return msg.reply('어 하이');
          default:
            return msg.reply('없는 명령어에요."$mk-help"를 쳐보세요.');
        }
      }
       )
      .catch(function(error){
        fs.writeFileSync(logpath,now+user+":"+String(error));

      } );
  }
          if(msg.content.startsWith('$mcat-')){
        
            new Promise(function(resolve,reject){
              fs.appendFileSync(logpath,now+user+":"+msg.content);
              const detailCommand=msg.content.split('-');
              resolve(detailCommand);
            }).then(async function(detailCommand){
            
                switch(detailCommand[1]){
                  
                          case 'adopt':
                            
                              await msg.reply("입양하시려구요? 잠시만요.");
                              const dfindUser=await User.find({
                                name:user,                         
                                          });
                            if(dfindUser.length==0){
                                    await User.create({
                                          name:user });
                                
                               }
                               const findUser=await User.find({
                                name:user,                         
                                          });
                              if(findUser[0].isgaming==0||findUser[0].isgaming==1)
                              {
                                  await msg.reply("입양 자격이 되시네요.");
                                  await msg.reply("입양하고 싶으시면 도트 고양이의 이름을 '$catname:`정하신 고양이 이름`'으로 보내주세요."
                                  +"\n 한번 정하시면 바꿀 수 없답니다.");
                                  return   await User.updateOne({name:user,
                                                  },{
                                                    isgaming:1,
                                                  });
                              }else{
                              return await msg.reply("이미 한 분을 모시고 계셔서 안돼요.");}
                                                          
                       
                                
                    case 'iscall/true':
                       let calledCat=await Cat.find({
                          owner:user,
                        },(err)=>{
                          console.log(err);
                        });
                        
                        if(calledCat.length!=0){
                          const callArray= thisroom[0].whoiscall;
                          callArray.push(calledCat[0].name);
                         await Room.updateOne({roomid:guildid},{whoiscall:callArray})
                         return  msg.reply("부르기 설정이 되었어요. 이제 일상 디코채팅 중에 고양이이름이 포함되면 고양이가 반응합니다.");
                        }else{
                          return msg.reply(':sob:키우시는 고양이가 없어요.:sob: ')
                        }
                      
                    case 'iscall/false':
                      let notcalledCat=await Cat.find({
                        owner:user,
                      },(err)=>{
                        console.log(err);
                      });
                      
                      if(notcalledCat.length!=0){
                        const callArray= thisroom[0].whoiscall;
                        let catSindex=callArray.indexOf(notcalledCat[0].name);
                        if(catSindex!=-1){
                          callArray.splice(catSindex,1);
                        }else{
                          return msg.reply(':sob:키우시는 고양이가 없어요.:sob: ')
                        }
                        await Room.updateOne({roomid:guildid},{whoiscall:callArray})
                        return  msg.reply("부르기 설정이 해제되었어요. 이제 더이상 고양이가 반응하지 않습니다.");
                      }else{
                        return msg.reply(':sob:키우시는 고양이가 없어요.:sob: ')
                      }


                    case 'status':
                        const statusCat=await Cat.find({owner:user});
                      
                       const statusOfcat=await CatActivity(statusCat[0],'behavior');
                        await msg.reply( new MessageAttachment(String(statusOfcat[0])));
                        await msg.reply(statusOfcat[1]);    
                        await msg.reply("당신과 고양이의 친밀도는 "+statusCat[0].stats[1]+"입니다.");
                        await msg.reply("\nC(cleverness):고양이의 영리함 능력치는"+statusCat[0].stats[2]+"입니다."
                       +"\nA(attack):고양이의 공격력 능력치는"+statusCat[0].stats[3]+"입니다."
                        +"\nT(toughness):고양이의 단단함 능력치는"+statusCat[0].stats[4]+"입니다.");
                    return 0;
                    case'bye':
                       await Cat.updateOne({owner:user},{
                          isdelete:true,
                        });
                    return msg.reply("당신은 키우던 고양이를 지울만큼  정말 인간이하의 존재입니까?\n 맞다면 $mcat-byereal을 치고 아니면 $mcat-byeno를 치세요.");
                    case 'byereal':
                    
                    const deleteCat= await Cat.find({owner:user});
                    if(deleteCat[0].isdelete==true){

                      await Cat.deleteOne({owner:user});
                      await User.updateOne({name:user},{isgaming:0});
                      let delteddCat=await Cat.find({
                        owner:user,
                      },(err)=>{
                        console.log(err);
                      });
                      
                      if(delteddCat.length==0){
                        const callArray= thisroom[0].whoiscall;
                        let catSindex=callArray.indexOf(deleteCat[0].name);
                        if(catSindex!=-1){
                          callArray.splice(catSindex,1);
                        }else{
                          
                        }
                        await Room.updateOne({roomid:guildid},{whoiscall:callArray})
                        return msg.reply("고양이의 존재가 영원히 세상에서 사라졌습니다. 이제 아무곳에도 없습니다.");
                      }else{
                        return msg.reply("고양이의 존재가 영원히 세상에서 사라졌습니다. 이제 아무곳에도 없습니다.");
                      }
                    }else{
                      return 
                    }
                    case 'byeno':
                          
                    return await Cat.updateOne({owner:user},{isdelete:false});
                    case 'feed':
                      
                    const feedcat= await Cat.find({owner:user});
                    const feedtime=Date.now();
                    let timeremain=0;
                      if(feedcat[0].lastfeed!=null){
                     timeremain=feedtime-feedcat[0].lastfeed;
                      }
                    if(timeremain>=86400000||feedcat[0].lastfeed==null){
                      let nowfriend=feedcat[0].stats;
                      nowfriend[1]+=1;
                      await Cat.updateOne({owner:user},{stats:nowfriend,lastfeed:feedtime});
                      const feedA=await CatActivity(feedcat[0],'feed');
                      const msgF=new MessageAttachment(String(feedA[0]));
                      await msg.reply(msgF);
                      return await msg.reply(feedA[1]);
                    }
                    else{
                    return msg.reply(":cat:간식은 하루에 하나씩이에요.");
                    }
                    case'help':
                    const embededcMsg=new MessageEmbed()
                    .setTitle("_MK_봇 사용설명서")
                    .setColor("#1ABC9C")//aqua
                    .setDescription(":wave:안녕하세요._MK_봇 사용자 여러분.:wave:\n_MK_봇은 :cat:고양이 키우기 :headphones: 음악듣기 등등의 기능을 제공합니다." 
                    +"\n\n"+":mushroom: 모든 명령어는 띄어쓰기를 안붙입니다.:mushroom: "
                    +"\n\n\n"+":cat:$mcat-'로 시작하는 것-고양이 키우기 관련 명령어입니다.:cat:"
                    +"\n\n"+"   :one:  __________   $mcat-adopt:도트고양이 입양하기"
                    +"\n\n"+"   :two:  __________   $mcat-feed:도트고양이 간식주기"
                    +"\n\n"+"   :three:  __________   $mcat-iscall/true:도트고양이 이름부르면 대답하기 설정"
                    +"\n\n"+"   :four:  __________   $mcat-iscall/false:도트고양이 이름부르면 대답하기 해제"
                    +"\n\n"+"   :five:  __________   $mcat-status:도트고양이 상태보기"
                    +"\n\n"+"   :six:  __________   $mcat-bye:도트고양이와 이별하기"
                    +"\n\n"+"   :seven:  __________   $mcat-help:도트고양이 관련 도움말 보기"
                    +"\n\n"+"친밀도는 간식을 주거나(+20) 이름을 부를 때마다 증가합니다.(+5) "
                    +"\n\n"+"간식은 하루에 한 번 줄 수 있습니다. "
                
        
                    )
                    return msg.channel.send(embededcMsg);

                    default :
                        
                    
                    return msg.reply("$mcat-help를 치세요.");
                  }//switch
            });//then
          }//if mcat
          if(msg.content.startsWith('$catname:')){
           
              const catName=msg.content.split(':')[1];
           
                const isgaming=await User.find({
                  name:user,
                });
                
                 if(isgaming[0].isgaming==1){
                     if(catName==undefined||catName==null||catName.length==0){
                       return await msg.reply("이름이 잘못되었네요.\n"+"도트 고양이의 이름을 '$catname:`정하신 고양이 이름`'으로 보내주세요."
                       +"\n 한번 정하시면 바꿀 수 없답니다.");
                      }else{
                            const apparel=parseInt(getRandomArbitrary(0,120))%4;
                            const dotcat= await Cat.find({
                              owner:user
                            });
                           if(dotcat.length==0){
                           await Cat.create({
                              owner:user,
                              name:catName,
                              character:catCharacters[apparel],
                              stats:[apparel,0,5,5,5],
                              status:"깨어 있음",
                            });

                          }
                             await User.updateOne({
                                name:user,
                              },{
                                isgaming:2,
                              });
                             const makecat=await Cat.find({
                                owner:user,
                              })
                         const catimage=new MessageAttachment(`./cats/${apparel}.gif`)
                         console.log(makecat);
                         await  msg.channel.send(`${msg.author},`, catimage);
                         return await msg.reply(":smirk_cat: 도트고양이["+catName +"] 입양되었어요!"
                         +"\n\n"+":heart: 성격:"+catCharacters[apparel]    
                         +"\n\n"+":green_heart: 친밀도:"+0  
                         +"\n\n"+":orange_heart: 현재 상태: 깨어있음"
                          );
                     }
   
                }else{
                  return;
                }
   
          }
});

  
  
  client.login(token.token);
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
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
  
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "음악을 스킵하려면 보이스채널에 있어야해요."
      );
    if (!serverQueue)
      return message.channel.send("스킵할 음악이없어요.");
    serverQueue.connection.dispatcher.end();
  }
  
  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "음악을 멈추려면 보이스채널에 있어야해요."
      );
      
    if (!serverQueue)
      return message.channel.send("멈출 음악이 없어요.");
      
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    console.log(song);
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }
async function searchY(args){


}