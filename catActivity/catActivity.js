const mongoose=require('mongoose');
const Cat=require('../schemas/cat');
const catProperties=require('../catProperties.json');
const catCharacters=catProperties.character[0];
const catFriendship=catProperties.catFriendship;
async function catActivity(cat,flag){
   const catname=cat.name;
   const catstats=cat.stats;
   const catcharacter=cat.character;
        
    switch(flag){
       case 'call':
            return callCat(catname,catstats,catcharacter);
       case 'behavior':
            return behaviorOfCat(catstats,catname,catcharacter);
        case'feed':
            return feedCat(catname,catstats);
       default:
           break;
   }
}


function callCat(catname,catstats,catcharacter){
 
    switch(catstats[0]){
        case 0:
            if(catstats[1]<catFriendship['base1']+catFriendship['up']*catCharacters[catcharacter]){
                let answer=[ `./cats/`+catstats[0]+'.gif',catname+`은(는) 분명 들었지만 모르는 척 합니다.`];
                return  answer ;
                
            }else if(catstats[1]<catFriendship['base2']+catFriendship['up']*catCharacters[catcharacter]){
               
                let answer=[ `./cats/w`+catstats[0]+'.gif',catname+`이(가) 듣고 쳐다봅니다.`];
                return answer
            }else {
                let answer=[ `./cats/a`+catstats[0]+'.gif',catname+`이(가) 듣고 대답합니다.`];
                return  answer
            }

       
        case 1:
        if(catstats[1]<catFriendship['base1']+catFriendship['up']*catCharacters[catcharacter]){
            let answer=[ `./cats/`+catstats[0]+'.gif',catname+`은(는) 분명 들었지만 모르는 척 합니다.`];
                return  answer ;
        }else if(catstats[1]<catFriendship['base2']+catFriendship['up']*catCharacters[catcharacter]){
            let answer=[ `./cats/w`+catstats[0]+'.gif',catname+`이(가) 듣고 쳐다봅니다.`];
            return answer
        }else {
            let answer=[ `./cats/a`+catstats[0]+'.gif',catname+`이(가) 듣고 대답합니다.`];
            return  answer
        } 
        case 2:
        if(catstats[1]<catFriendship['base1']+catFriendship['up']*catCharacters[catcharacter]){
            let answer=[ `./cats/`+catstats[0]+'.gif',catname+`은(는) 분명 들었지만 모르는 척 합니다.`];
            return  answer ;
        }else if(catstats[1]<catFriendship['base2']+catFriendship['up']*catCharacters[catcharacter]){
            let answer=[ `./cats/w`+catstats[0]+'.gif',catname+`이(가) 듣고 쳐다봅니다.`];
            return answer
        }else {
            let answer=[ `./cats/a`+catstats[0]+'.gif',catname+`이(가) 듣고 대답합니다.`];
            return  answer
        }   
        case 3:
           
        if(catstats[1]<catFriendship['base1']+catFriendship['up']*catCharacters[catcharacter]){
            let answer=[ `./cats/`+catstats[0]+'.gif',catname+`은(는) 분명 들었지만 모르는 척 합니다.`];
                return  answer ;
        }else if(catstats[1]<catFriendship['base2']+catFriendship['up']*catCharacters[catcharacter]){
            let answer=[ `./cats/w`+catstats[0]+'.gif',catname+`이(가) 듣고 쳐다봅니다.`];
            return answer
        }else {
            let answer=[ `./cats/a`+catstats[0]+'.gif',catname+`이(가) 듣고 대답합니다.`];
            return  answer
        }
    }       
}
function  feedCat(catname,catstats){
    let feed=[ `./cats/f`+catstats[0]+'.gif',catname+`에게 간식을 주었어요!`];        
            return  feed;
}
function danceCat(catname,catstats){
        let dance=[ `./cats/d`+catstats[0]+'.gif',catname+`이(가) 춤을 추고 있습니다.`];        
            return  dance;

}
function sleepCat(catname,catstats){
    let sleep=[`./cats/s`+catstats[0]+'.gif',catname+`이(가) 자고있습니다.\n:cat:고양이는 하루대부분을 잠으로 보낸답니다.`];
    return sleep;
}

function normal(catname,catstats){
    let normal=[`./cats/`+catstats[0]+'.gif',catname+`이(가) 가만히 앉아있습니다.`];
    return normal;
}

function behaviorOfCat(catstats,catname,catcharacter){
    const isSleep=getRandomArbitrary(0,100);
    if(isSleep<61){
      return  sleepCat(catname,catstats);
    }else{
        if(isSleep<75){
          return  danceCat(catname,catstats);
        }else{
         return   normal(catname,catstats);
        }
    }
}
function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }

module.exports=catActivity;