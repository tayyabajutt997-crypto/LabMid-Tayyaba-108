// Tayyaba Habib - Roll 108 - BSSE 5th - FA21-BSE-108 - CSC336 Lab Mid
// ES6+ JavaScript - All Requirements from Page 1 & Page 2

let currentMode=null; let gameState={};

// Common Functions - Home, Stop Timers, Start, Restart, Reset
function goHome(){
  stopAllTimers();
  document.getElementById('homeScreen').classList.remove('d-none');
  document.getElementById('gameAScreen').classList.add('d-none');
  document.getElementById('gameBScreen').classList.add('d-none');
  document.getElementById('resultScreen').classList.add('d-none');
  currentMode=null;
}
function stopAllTimers(){
  clearInterval(gameState.timerA);
  clearInterval(gameState.moveTimerA);
  clearInterval(gameState.spawnTimerA);
  clearInterval(gameState.timerB);
}
function startGame(mode){
  currentMode=mode;
  document.getElementById('homeScreen').classList.add('d-none');
  document.getElementById('resultScreen').classList.add('d-none');
  if(mode==='A'){
    document.getElementById('gameAScreen').classList.remove('d-none');
    document.getElementById('gameBScreen').classList.add('d-none');
    initGameA();
  }else{
    document.getElementById('gameBScreen').classList.remove('d-none');
    document.getElementById('gameAScreen').classList.add('d-none');
    initGameB();
  }
}
function restartGame(mode){ startGame(mode); }
function resetGame(mode){
  stopAllTimers();
  if(mode==='A') initGameA(); else initGameB();
}

// MODE A: Bubbles - Letter Recognition
function initGameA(){
  const diff=document.getElementById('diffA').value;
  document.getElementById('levelA').innerText=diff.toUpperCase();
  const container=document.getElementById('bubbleContainer');
  container.innerHTML='';
  let config={easy:{count:5,speed:1.2,spawnRate:1200,time:70},medium:{count:6,speed:2.0,spawnRate:1000,time:60},hard:{count:8,speed:3.2,spawnRate:700,time:50}}[diff];
  gameState.A={score:0,correct:0,wrong:0,miss:0,missLimit:6,time:config.time,speed:config.speed,count:config.count,paused:false,bubbles:[]};
  document.getElementById('scoreA').innerText=0;
  document.getElementById('correctA').innerText=0;
  document.getElementById('wrongA').innerText=0;
  document.getElementById('missA').innerText='0 / 6';
  document.getElementById('speedA').innerText=config.speed.toFixed(1)+'x';
  document.getElementById('timeA').innerText=config.time+'s';
  document.getElementById('feedbackA').innerText='Press matching key! - Tayyaba';
  for(let i=0;i<config.count;i++) setTimeout(()=>spawnBubbleA(),i*300);
  gameState.spawnTimerA=setInterval(()=>{if(!gameState.A.paused && gameState.A.bubbles.length < config.count+2) spawnBubbleA();},config.spawnRate);
  gameState.moveTimerA=setInterval(moveBubblesA,30);
  gameState.timerA=setInterval(()=>{
    if(gameState.A.paused) return;
    gameState.A.time--;
    document.getElementById('timeA').innerText=gameState.A.time+'s';
    if(gameState.A.time<=0) endGame('A','Time Completed');
    if(gameState.A.time%10===0){
      gameState.A.speed+=0.2;
      document.getElementById('speedA').innerText=gameState.A.speed.toFixed(1)+'x';
    }
  },1000);
  document.onkeydown=(e)=>handleKeyA(e.key);
}
function spawnBubbleA(){
  const container=document.getElementById('bubbleContainer');
  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter=letters[Math.floor(Math.random()*letters.length)];
  const el=document.createElement('div');
  el.className='bubble';
  el.dataset.letter=letter;
  el.innerText=letter;
  el.style.left=Math.random()*(container.clientWidth-70)+'px';
  el.style.top=(container.clientHeight-10)+'px';
  el.style.background=`radial-gradient(circle at 30% 30%, hsl(${Math.random()*60+200},90%,70%), hsl(${Math.random()*60+200},80%,50%))`;
  container.appendChild(el);
  gameState.A.bubbles.push({el,letter,y:container.clientHeight-10});
}
function moveBubblesA(){
  if(!gameState.A||gameState.A.paused) return;
  gameState.A.bubbles.forEach((b,idx)=>{
    b.y-=gameState.A.speed;
    b.el.style.top=b.y+'px';
    if(b.y<-80){
      b.el.remove();
      gameState.A.bubbles.splice(idx,1);
      gameState.A.miss++;
      document.getElementById('missA').innerText=`${gameState.A.miss} / ${gameState.A.missLimit}`;
      showFeedbackA(`Missed ${b.letter}`,false);
      if(gameState.A.miss>=gameState.A.missLimit) endGame('A','Miss Limit Reached (6 misses)');
    }
  });
}
function handleKeyA(key){
  if(!gameState.A||currentMode!=='A') return;
  const upper=key.toUpperCase();
  const matchIdx=gameState.A.bubbles.findIndex(b=>b.letter===upper);
  if(matchIdx>-1){
    const b=gameState.A.bubbles[matchIdx];
    b.el.classList.add('pop');
    setTimeout(()=>b.el.remove(),300);
    gameState.A.bubbles.splice(matchIdx,1);
    gameState.A.score+=10;
    gameState.A.correct++;
    document.getElementById('scoreA').innerText=gameState.A.score;
    document.getElementById('correctA').innerText=gameState.A.correct;
    showFeedbackA(`Correct +10 ${upper}`,true);
    setTimeout(()=>spawnBubbleA(),200);
  }else{
    if(/^[a-zA-Z]$/.test(key)){
      gameState.A.wrong++;
      gameState.A.score=Math.max(0,gameState.A.score-3);
      document.getElementById('wrongA').innerText=gameState.A.wrong;
      document.getElementById('scoreA').innerText=gameState.A.score;
      showFeedbackA(`Wrong Key: ${upper} (-3)`,false);
    }
  }
}
function showFeedbackA(msg,correct){
  const f=document.getElementById('feedbackA');
  f.innerText=msg;
  f.className='feedback '+(correct?'correct':'wrong');
  setTimeout(()=>{f.innerText=''; f.className='feedback';},1200);
}
function pauseGameA(){
  if(gameState.A) gameState.A.paused=!gameState.A.paused;
  document.getElementById('feedbackA').innerText=gameState.A.paused?'⏸ Paused':'';
}

// MODE B: KeyMagnet - Keyboard Precision
const keySets={
  easy:[{key:'A',desc:'Home Row - Left Pinky'},{key:'S',desc:'Home Row - Left Ring'},{key:'D',desc:'Home Row - Left Middle'},{key:'F',desc:'Home Row - Left Index'},{key:'J',desc:'Home Row - Right Index'},{key:'K',desc:'Home Row - Right Middle'},{key:'L',desc:'Home Row - Right Ring'},{key:';',desc:'Home Row - Right Pinky'}],
  medium:[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(k=>({key:k,desc:`Alphabet Key ${k}`})),
  hard:[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$'].map(k=>({key:k,desc:`Hard Key ${k}`}))
};

function initGameB(){
  const diff=document.getElementById('diffB').value;
  document.getElementById('levelB').innerText=diff.toUpperCase();
  let config={easy:{time:90},medium:{time:60},hard:{time:45}}[diff];
  gameState.B={score:0,correct:0,wrong:0,time:config.time,diff,keys:keySets[diff],current:null,startTime:0,times:[],paused:false};
  document.getElementById('scoreB').innerText=0;
  document.getElementById('correctB').innerText=0;
  document.getElementById('wrongB').innerText=0;
  document.getElementById('accB').innerText='100%';
  document.getElementById('avgTimeB').innerText='0ms';
  document.getElementById('timeB').innerText=config.time+'s';
  buildKeyboard();
  nextTargetB();
  gameState.timerB=setInterval(()=>{
    if(gameState.B.paused) return;
    gameState.B.time--;
    document.getElementById('timeB').innerText=gameState.B.time+'s';
    if(gameState.B.time<=0) endGame('B','Time Completed');
  },1000);
  document.onkeydown=(e)=>handleKeyB(e.key);
}
function buildKeyboard(){
  const kb=document.getElementById('virtualKeyboard');
  kb.innerHTML='';
  const rows=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L',';'],['Z','X','C','V','B','N','M']];
  rows.forEach(r=>{
    const rowEl=document.createElement('div');
    rowEl.className='kb-row';
    r.forEach(k=>{
      const keyEl=document.createElement('div');
      keyEl.className='key';
      keyEl.dataset.key=k;
      keyEl.innerText=k;
      keyEl.onclick=()=>handleKeyB(k);
      rowEl.appendChild(keyEl);
    });
    kb.appendChild(rowEl);
  });
}
function nextTargetB(){
  const pool=gameState.B.keys;
  const item=pool[Math.floor(Math.random()*pool.length)];
  gameState.B.current=item.key;
  gameState.B.startTime=Date.now();
  document.getElementById('targetKey').innerText=item.key;
  document.getElementById('keyDescription').innerText=item.desc;
  document.querySelectorAll('.key').forEach(k=>k.classList.remove('active'));
  const active=document.querySelector(`.key[data-key="${item.key}"]`);
  if(active) active.classList.add('active');
}
function handleKeyB(key){
  if(!gameState.B||currentMode!=='B') return;
  const upper=key.toUpperCase();
  const target=gameState.B.current;
  const elapsed=Date.now()-gameState.B.startTime;
  const keyEl=document.querySelector(`.key[data-key="${target}"]`);
  if(upper===target){
    gameState.B.correct++;
    gameState.B.score+=10;
    gameState.B.times.push(elapsed);
    document.getElementById('scoreB').innerText=gameState.B.score;
    document.getElementById('correctB').innerText=gameState.B.correct;
    showFeedbackB(`Correct! ${elapsed}ms`,true);
    if(keyEl){keyEl.classList.add('correct'); setTimeout(()=>keyEl.classList.remove('correct'),400);}
    updateAccuracyB();
    nextTargetB();
  }else{
    if(key.length===1){
      gameState.B.wrong++;
      gameState.B.score=Math.max(0,gameState.B.score-2);
      document.getElementById('wrongB').innerText=gameState.B.wrong;
      document.getElementById('scoreB').innerText=gameState.B.score;
      showFeedbackB(`Wrong! Expected ${target}, Pressed ${upper}`,false);
      document.querySelectorAll('.key').forEach(k=>{
        if(k.dataset.key===upper){
          k.classList.add('wrong');
          setTimeout(()=>k.classList.remove('wrong'),400);
        }
      });
      updateAccuracyB();
    }
  }
}
function updateAccuracyB(){
  const total=gameState.B.correct+gameState.B.wrong;
  const acc=total?Math.round(gameState.B.correct/total*100):100;
  const avg=gameState.B.times.length?Math.round(gameState.B.times.reduce((a,b)=>a+b,0)/gameState.B.times.length):0;
  document.getElementById('accB').innerText=acc+'%';
  document.getElementById('avgTimeB').innerText=avg+'ms';
}
function showFeedbackB(msg,correct){
  const f=document.getElementById('feedbackB');
  f.innerText=msg;
  f.className='feedback '+(correct?'correct':'wrong');
  setTimeout(()=>{f.innerText=''; f.className='feedback';},1200);
}
function pauseGameB(){
  if(gameState.B) gameState.B.paused=!gameState.B.paused;
  document.getElementById('feedbackB').innerText=gameState.B.paused?'⏸ Paused':'';
}

// END GAME - Result Screen - Requirement #6 & #7
function endGame(mode,reason){
  stopAllTimers();
  document.onkeydown=null;
  let score,correct,wrong,diff,acc;
  if(mode==='A'){
    score=gameState.A.score;
    correct=gameState.A.correct;
    wrong=gameState.A.wrong;
    diff=document.getElementById('diffA').value;
    acc=(correct+wrong)?Math.round(correct/(correct+wrong)*100):0;
  }else{
    score=gameState.B.score;
    correct=gameState.B.correct;
    wrong=gameState.B.wrong;
    diff=document.getElementById('diffB').value;
    acc=(correct+wrong)?Math.round(correct/(correct+wrong)*100):0;
  }
  document.getElementById('gameAScreen').classList.add('d-none');
  document.getElementById('gameBScreen').classList.add('d-none');
  document.getElementById('resultScreen').classList.remove('d-none');
  document.getElementById('resultTitle').innerText=mode==='A'?'🫧 Bubbles - Game Over':'🧲 KeyMagnet - Completed';
  document.getElementById('resultReason').innerText=reason;
  document.getElementById('resScore').innerText=score;
  document.getElementById('resCorrect').innerText=correct;
  document.getElementById('resWrong').innerText=wrong;
  document.getElementById('resAcc').innerText=acc+'%';
  document.getElementById('resDiff').innerText=diff;
  document.getElementById('resMode').innerText=mode==='A'?'Bubbles':'KeyMagnet';
}