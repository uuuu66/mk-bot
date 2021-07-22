const axios=require('axios');
const qs=require('querystring');

async function cyphers(name){
try{
    var result=await axios.get(`https://api.neople.co.kr/cy/players?nickname=${qs.escape(name)}&wordType=<wordType>&apikey=dagxFMoUoEfELDjmBOVVO2vkf6aoELx7`);
    var nick=result.data.rows[0].nickname;
    var level=result.data.rows[0].grade;
    //승률구하기
    var winrateResult= await axios.get(`https://api.neople.co.kr/cy/players/${result.data.rows[0].playerId}?apikey=dagxFMoUoEfELDjmBOVVO2vkf6aoELx7`)
    var officialWinrate="공식전 기록없음";
    var normalWinrate="일반전 기록없음";
    var officialWincount=0;
    var officialGame=0;
    var normalWincount=0;
    var normalGame=0;
    
    if(winrateResult.data.records[0].gameTypeId=='rating'){
            if((winrateResult.data.records[0].winCount+winrateResult.data.records[0].loseCount)==0){
                
            }
            else{
            officialWinrate=(winrateResult.data.records[0].winCount/(winrateResult.data.records[0].winCount+winrateResult.data.records[0].loseCount))*100+"%";
            officialWincount=winrateResult.data.records[0].winCount;
            officialGame=(winrateResult.data.records[0].winCount+winrateResult.data.records[0].loseCount);
            }
            if((winrateResult.data.records[1].winCount+winrateResult.data.records[1].loseCount)==0){
               
            }else{
            normalWinrate=(winrateResult.data.records[1].winCount/(winrateResult.data.records[1].winCount+winrateResult.data.records[1].loseCount))*100+"%";
            normalWincount=winrateResult.data.records[1].winCount;
            normalGame=(winrateResult.data.records[1].winCount+winrateResult.data.records[1].loseCount);
            }
        
    }else if(winrateResult.data.records[0].gameTypeId=='normal'){
        if((winrateResult.data.records[0].winCount+winrateResult.data.records[0].loseCount)==0){
            
        }
        else{
        normalWinrate=(winrateResult.data.records[0].winCount/(winrateResult.data.records[0].winCount+winrateResult.data.records[0].loseCount))*100+"%";
        normalWincount=winrateResult.data.records[0].winCount;
        normalGame=(winrateResult.data.records[0].winCount+winrateResult.data.records[0].loseCount);
    
        }
    }
    //매칭분석 
    var today=new Date();
    
    var toyear=today.getFullYear();
    var tomonth=today.getMonth()+1;
    var todate=today.getDate();
    var enddate=toyear+"-"+tomonth+"-"+todate;
    
    var fromyear=today.getFullYear();
    var frommonth=tomonth-1;
    if(tomonth==1){
        fromyear=toyear-1;
        frommonth=12;
    }
    var fromdate=todate;
    var startdate=fromyear+"-"+frommonth+"-"+fromdate;
   
    var partyResult=await axios.get(`https://api.neople.co.kr/cy/players/${result.data.rows[0].playerId}/matches?gameTypeId=normal&startDate=${startdate}&endDate=${enddate}&limit=500&apikey=dagxFMoUoEfELDjmBOVVO2vkf6aoELx7`)
    
    
    var partymembers=new Map();
    var partys=new Map();
    var partyswinrate=new Map();
    var partysloserate=new Map();
    var partyswin=new Map();
    var partyslose=new Map();
    var winPartiesposition=new Map();
    
    partyResult.data.matches.rows.map(function(match){
       for(var i=0;i<match.playInfo.partyInfo.length;i++){
            if(partymembers.has(match.playInfo.partyInfo[i].nickname)){
                var mebernumber= partymembers.get(match.playInfo.partyInfo[i].nickname) +1;
                partymembers.set(match.playInfo.partyInfo[i].nickname,mebernumber);
            }else{
                partymembers.set(match.playInfo.partyInfo[i].nickname,1);
            }
            
       }
       //파티 같이 게임한 수 
     var partynames="";
       for(var i=0;i<match.playInfo.partyInfo.length;i++){      
                   partynames+=match.playInfo.partyInfo[i].nickname+"/";      
         }
         if(partynames==''){
            partynames="혼자서 쓸쓸하게 솔플하기";
        }
         if(partys.has(partynames)){
                    partys.set(partynames,partys.get(partynames)+1)
            }else{
                    
                    partys.set(partynames,1)
            }
       //파티 이긴 수 
       var partynames="";
       if(match.playInfo.result=="win"){
           
           for(var i=0;i<match.playInfo.partyInfo.length;i++){
             partynames+=match.playInfo.partyInfo[i].nickname+"/";    
           }
           if(partynames==''){
                 partynames="혼자서 쓸쓸하게 솔플하기";
            }
            if(winPartiesposition.has(partynames)){
                var idarray=winPartiesposition.get(partynames);
                idarray.add(match.matchId);
                winPartiesposition.set(partynames,idarray);
                
            }else{
               var idarray=new Set();
               idarray.add(match.matchId);
                winPartiesposition.set(partynames,idarray);
            }


           if(partyswin.has(partynames)){
                partyswin.set(partynames,partyswin.get(partynames)+1);
           }else{

                partyswin.set(partynames,1);
           }
       }else{
            for(var i=0;i<match.playInfo.partyInfo.length;i++){
            partynames+=match.playInfo.partyInfo[i].nickname+"/";    
           }
           if(partynames==''){
            partynames="혼자서 쓸쓸하게 솔플하기";
            }
           if(partyslose.has(partynames)){
                partyslose.set(partynames,partyslose.get(partynames)+1);
            }else{
                partyslose.set(partynames,1);
                }
        }
    });
    
    for(lose of partys.keys() ){
            if(partys.has(lose)){
                var wins=partyswin.get(lose);
                var loses=partyslose.get(lose);
                partyswinrate.set(lose,(wins/partys.get(lose))*100);
                partysloserate.set(lose,(loses/partys.get(lose))*100);
            }
        }
    // }var GamePosition=0;

    // if(req.query.team!=null){
    //     GamePosition=new Map();
        
    // var teams=req.body.key;
    //     var urls=new Array();

    //     for (val of winPartiesposition.get(teams)){
    //         url=`https://api.neople.co.kr/cy/matches/${val}?&apikey=dagxFMoUoEfELDjmBOVVO2vkf6aoELx7`
    //     urls.push(url);
    //     console.log(urls);
    //     }
    //     //console.log(urls);
    //    GamePosition= await processArray(urls,GamePosition);

    //     GamePosition=Object.fromEntries(GamePosition);
       
    // }
    // function delay() {
    //     return new Promise(resolve => setTimeout(resolve, 300));
    //   }
      
    //   async function delayed(item,GamePosition) {
    //     // notice that we can await a function
    //     // that returns a promise
    //         await delay();
    //         console.log("item="+item);
    //        let result= await axios.get(item);
    //                // console.log()
    //                 let s=new Array();
                        
    //                 let user=result.data.players;
        


    //                 for(let i=0;i<user.length;i++){
    //               //  console.log(username+"-"+user[i].nickname);
    //               //  console.log(user);
                    
    //                 let parties=teams.split('/');
    //                 for(let j=0;j<parties.length;j++){   
    //                     if(user[i].nickname==parties[j]){
    //                     let p= parties[j]+"-"+user[i].position.name;
    //                     s.push(p);
    //                     }
    //                 }
    //                 if(user[i].nickname==username){
    //                     let f=username+"-"+user[i].position.name;
    //                     s.push(f);
    //                 }
                

    //             }
    //             s=String(s);
    //         if(GamePosition.has(s)){
    //                 GamePosition.set(s,GamePosition.get(s)+1);
    //             }
    //         else{
    //                 GamePosition.set(s,1);
    //             }
     
                    
    //   }
    //   async function processArray(array,GamePosition) {
    //       for (const item of array) {
    //           await delayed(item,GamePosition);
    //         }
           
    //     console.log('real Done!');
    //     return GamePosition;
    //   }
    //     console.log(GamePosition);
       
    

    partys=Object.fromEntries(partys); //파티횟수
    partysloserate=Object.fromEntries(partysloserate); //파티 패률
    partymembers=Object.fromEntries(partymembers);//파티 
    partyswinrate=Object.fromEntries(partyswinrate);
    partyswin=Object.fromEntries(partyswin);
    partyslose=Object.fromEntries(partyslose);
    winPartiesposition=Object.fromEntries(winPartiesposition);

    let answer= new Object({
        "급수":level,
        "같이하는 파티들":partys,
        "파티의 승률":partyswinrate,  
    })
      return answer;

    }catch(err){
        console.log(err);
        return "not good"
    }
}
module.exports=cyphers;