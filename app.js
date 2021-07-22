const {Client,MessageEmbed,MessageAttachment,Guild,Emoji}=require('discord.js');
const ytdl=require('ytdl-core');
const token=require('./token.json');
const fs=require('fs');
const axios=require('axios');
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
const catCharacters=Object.keys(catProperties.character[0]);
const prefix="$mkmusic-";

const queue = new Map();
const youtubenode=require('youtube-node');
const keys=require('./key.json');
const youtube=new youtubenode();

const cyphers=require('./cyphers/cyphers');
axios.defaults.headers.origin="http://39.115.162.208:30000/cyphers";
 youtube.setKey(Object.values(keys)[1]);

client.on('ready', async function(){
 
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity("$mk-help<도움말 띄어쓰기 x",'playing').then(console.log("set activity completed"))
    .catch(function(error){console.log(error)});
    connect();
    await Room.updateMany({},{   mstiamember:new Array(),mstiaflag:0,mstianames:new Array()})
});


client.on('message',async function(msg){
    let today=new Date();
    let now =today.getHours()+"시,"+today.getMinutes()+"분,"+today.getSeconds()+"초,"+today.getMilliseconds()+"밀리초\n";
    let user=String(msg.author);
    let guildid=String(msg.guild.id);
    let catWhowillbeCalled=0;
    const msgOwner=msg.author;

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
      } else if(msg.content.startsWith(`${prefix}show`)){
        show(msg,serverQueue);
        return;
      }else if(msg.content.startsWith(`${prefix}search`)){
        search(msg);
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
         let findCat=await Cat.find({
            owner:user}).and({name:catWhowillbeCalled[i]});
         if(findCat.length==0){
            return 0;
         }
         const measureAnswer=measureTime(findCat[0].lastcall,Date.now(),1,"minute");
    
         if(measureAnswer==true){
          let path= await CatActivity(findCat[0],'call');
          let nowFriendly=findCat[0].stats;
          if(nowFriendly[1]<=500)
          nowFriendly[1]+=5;
         
          await Cat.updateOne({
            owner:user},{  stats:nowFriendly,lastcall:Date.now(),
          });
         let catCallImage=new MessageAttachment(String(path[0]));
         await msg.channel.send(msgOwner,catCallImage);  
         await msg.reply(path[1]);
         if(nowFriendly[1]>=500)
           await msg.reply("친밀도가 500이 넘어서 더 이상 늘릴 수 가 없어요.(컨텐츠제작중)");
          
        }else{
          await msg.reply(measureAnswer[1]);
        }
         break;
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
                      +"\n\n"+"   :three:  __________   $mkmusic-stop:음악대기열 완전히 비우기 "
                      +"\n\n"+"   :four:  __________   $mkmusic-show:음악대기열 보기"
                      +"\n\n"+"   :five:  __________   $mkmusic-search-검색단어-검색수:검색 수 만큼 검색함/검색 수 입력안하면 5개"
                      +"\n\n\n"+":apple:$cyphers-닉네임' 한달간 사이퍼즈 분석.:apple:"

                      


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
                                                  await msg.reply("고양이의 성격은 "+statusCat[0].character+"입니다.");
                                                  await msg.reply("\n:regional_indicator_c: C(cleverness):regional_indicator_c: :고양이의 영리함 능력치는"+statusCat[0].stats[2]+"입니다."
                                                  +"\n:regional_indicator_a: A(attack)        :regional_indicator_a: :고양이의 공격력 능력치는"+statusCat[0].stats[3]+"입니다."
                                                  +"\n:regional_indicator_t: T(toughness) :regional_indicator_t: :고양이의 단단함 능력치는"+statusCat[0].stats[4]+"입니다."
                                                  +"\n:muscle: 레벨:muscle: :고양이의 레벨은"+statusCat[0].level+"입니다."
                                                  +"\n:closed_book: 경험치:closed_book: :고양이의 경험치는"+statusCat[0].experience+"이고 레벨업까지"+(100*statusCat[0].level-statusCat[0].experience)+"남았습니다.");
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
                                           
                                            const measureResult=measureTime(feedcat[0].lastfeed,feedtime,1,'hour');
                                           
                                            if(measureResult==true){
                                                  let nowfriend=feedcat[0].stats;
                                                  if(nowfriend[1]<=500)
                                                  nowfriend[1]+=20;
                                                  await Cat.updateOne({owner:user},{stats:nowfriend,lastfeed:feedtime});
                                                  const feedA=await CatActivity(feedcat[0],'feed');
                                                  const msgF=new MessageAttachment(String(feedA[0]));
                                                  await msg.reply(msgF);
                                               
                                                   await msg.reply(feedA[1]);
                                                   if(nowfriend[1]>=500)
                                                   return await msg.reply("친밀도가 500이 넘어서 더 이상 늘릴 수 가 없어요.(컨텐츠제작중)");
                                                 break;
                                            }
                                            else{
                                                return msg.reply(measureResult[1]);
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
                                          +"\n\n"+"간식은 1시간마다 한 번씩 줄 수 있습니다. "
                                      
                              
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
                            const characteristics=parseInt(getRandomArbitrary(0,10*catCharacters.length))%catCharacters.length;
                          
                            const dotcat= await Cat.find({
                              owner:user
                            });
                           if(dotcat.length==0){
                           await Cat.create({
                              owner:user,
                              name:catName,
                              character:catCharacters[characteristics],
                              stats:[apparel,0,5,5,5],
                              status:"깨어 있음",
                              level:1,
                              lastfeed:0,
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
                       
                         await  msg.channel.send(`${msgOwner},`, catimage);
                         return await msg.reply(":smirk_cat: 도트고양이["+catName +"] 입양되었어요!"
                         +"\n\n"+":heart: 성격:"+catCharacters[characteristics]    
                         +"\n\n"+":green_heart: 친밀도:"+0  
                         +"\n\n"+":orange_heart: 현재 상태: 깨어있음"
                          );
                     }
   
                }else{
                  return;
                }
   
          }
          if(msg.content.startsWith('$cyphers-')){
            const cypherName=msg.content.split('-')[1];
           let res=  await cyphers(cypherName);
           console.log(res);
           let list='';
           let titles=Object.keys(res);
           console.log(titles);
           let detailDescription=":one:같이하는 파티들:파티들과 함께한 게임 수입니다.\n:two:파티의 승률:파티의 승률입니다.NaN은 0%입니다.\n\n\n";
           for(let i=0;i<titles.length;i++){
             if(i!=0){
             const resultKeys=Object.keys(res[titles[i]]);
             let detailResult=""
             resultKeys.forEach(function(val){
              if(i==2){
               if(res[titles[i]][val]<20)
               detailResult+=":scream:  "+val+":" +res[titles[i]][val]+"\n\n";
               else if(res[titles[i]][val]<=40)
               detailResult+=":tired_face:  "+val+":" +res[titles[i]][val]+"\n\n";
               else if(res[titles[i]][val]<=60)
               detailResult+=":yum:  "+val+":" +res[titles[i]][val]+"\n\n";
               else if(res[titles[i]][val]<=80)
               detailResult+=":thumbsup:  "+val+":" +res[titles[i]][val]+"\n\n";
               else if(res[titles[i]][val]<=100)
               detailResult+=":100:  "+val+":" +res[titles[i]][val]+"\n\n";
               else 
               detailResult+=":sob:  "+val+":" +res[titles[i]][val]+"\n\n";
              }else{
                detailResult+=":watermelon:  "+val+":" +res[titles[i]][val]+"\n\n";
              }
              });
             list+="\n\n\n:apple:  "+titles[i]+":\n\n\n"+detailResult;}
             else{
              list+="\n\n\n:apple:  "+titles[i]+":"+res[titles[i]]+"\n";
             }
           }
           detailDescription+=list;
           const cypherResult=new MessageEmbed()
           .setTitle(`${cypherName}의 사이퍼즈 `)
          // [level,partys,partysloserate,partymembers,partyswinrate,partyswin,partyslose,winPartiesposition]
          .setDescription(detailDescription)
          .setColor('#FFFF00');
           msg.reply(cypherResult);
          }
});

  
  
  client.login(token.token);
  
  
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
 
 async function search(message){
  const args = await message.content.split("-");
  youtube.addParam('type', 'video'); 
    youtube.addParam('topicId','/m/04rlf');
    if(args[3]==undefined)
      args[3]=5;
      let content="";
  await youtube.search(args[2],args[3],(err,res)=>{
    if(err)
    return message.channel.send("검색에 오류가 발생했어요.");

    res.items.map((item)=>{
      content+= ":watermelon:  "+ item.snippet.title+'\n';
    })
    const msgEmbeded=new MessageEmbed()
    .setTitle("음악 검색 목록")
    .setDescription(content);
    message.reply(msgEmbeded);
   });
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
  
  function measureTime(startTime,endTime,settingTime,flag){
  
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
console.log(remainHours,measureTime,(measureTime%3600000)/60000);
    let remainMinutes=parseInt((measureTime%3600000)/60000);
    console.log(remainMinutes);
    let remainSeconds=parseInt(parseInt(parseInt(measureTime%3600000)%60000)/1000); 
   
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
 
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "음악을 스킵하려면 보이스채널에 있어야해요."
      );
    if (!serverQueue)
      return message.channel.send("스킵할 음악이없어요.");
    serverQueue.connection.dispatcher.end();
  }
  function show(message,serverQueue){
    if (!message.member.voice.channel)
    return message.channel.send(
      "음악대기열을  보려면 보이스채널에 있어야해요."
    );
    if (!serverQueue)
      return message.channel.send("음악대기열이 비었어요.");
      
      let list="";
      const musicList=new MessageEmbed()  
      .setTitle("음악 대기열")
      .setColor("#1ABC9C");//aqua;
      for(let i=0;i<serverQueue.songs.length;i++){
       list+=`:headphones: ${i+1}:${serverQueue.songs[i].title}\n`;
       
      }

      musicList.setDescription(list);
     
     
    return message.channel.send(musicList);
 
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
  


