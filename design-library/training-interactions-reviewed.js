(function () {
  'use strict';
  function initTabs(root) {
    var tabs=Array.from(root.querySelectorAll('[role="tab"]'));
    var panels=Array.from(root.querySelectorAll('[role="tabpanel"]'));
    function select(index,focus) {
      if(window.speechSynthesis)window.speechSynthesis.cancel();
      var play=root.querySelector('[data-narration]');if(play)play.innerHTML='<span aria-hidden="true">?</span> Play narration';
      tabs.forEach(function(tab,i){tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
      panels.forEach(function(panel,i){panel.hidden=i!==index;});
      if(focus)tabs[index].focus();
    }
    tabs.forEach(function(tab,i){
      tab.addEventListener('click',function(){select(i,false);});
      tab.addEventListener('keydown',function(event){
        var index=i;
        if(event.key==='ArrowRight')index=(i+1)%tabs.length;
        else if(event.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;
        else if(event.key==='Home')index=0;
        else if(event.key==='End')index=tabs.length-1;
        else return;
        event.preventDefault();select(index,true);
      });
    });
  }
  document.querySelectorAll('[data-live-tabs]').forEach(initTabs);
  var reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
  document.querySelectorAll('[data-depth-stage]').forEach(function(stage){
    var object=stage.querySelector('.depth-object'),frame=0,bounds;
    if(!object)return;
    stage.addEventListener('pointerenter',function(){bounds=stage.getBoundingClientRect();});
    stage.addEventListener('pointermove',function(event){
      if(reduced.matches||!fine.matches)return;
      if(frame)cancelAnimationFrame(frame);
      frame=requestAnimationFrame(function(){
        bounds=bounds||stage.getBoundingClientRect();
        var x=Math.max(-.5,Math.min(.5,(event.clientX-bounds.left)/bounds.width-.5));
        var y=Math.max(-.5,Math.min(.5,(event.clientY-bounds.top)/bounds.height-.5));
        object.style.transform='rotateX('+(3-y*8).toFixed(2)+'deg) rotateY('+(-7+x*12).toFixed(2)+'deg)';
      });
    });
    function reset(){if(frame)cancelAnimationFrame(frame);object.style.removeProperty('transform');}
    stage.addEventListener('pointerleave',reset);reduced.addEventListener('change',reset);
  });
  document.querySelectorAll('[data-flashcard]').forEach(function(card){card.addEventListener('click',function(){
    var flipped=card.getAttribute('aria-pressed')!=='true';card.setAttribute('aria-pressed',String(flipped));
    card.querySelector('.flash-front').setAttribute('aria-hidden',String(flipped));
    card.querySelector('.flash-back').setAttribute('aria-hidden',String(!flipped));
  });});
  var quizButtons=document.querySelectorAll('[data-quiz]');
  quizButtons.forEach(function(button){button.setAttribute('aria-pressed','false');button.addEventListener('click',function(){
    quizButtons.forEach(function(other){other.setAttribute('aria-pressed',String(other===button));});
    document.querySelector('[data-quiz-feedback]').textContent=button.dataset.quiz==='check'?'Correct. Check the procedure before deciding how to respond.':'An urgent request still needs to follow the policy. Check the procedure first.';
  });});
  var translations={en:['Reporting a concern','Follow the reporting procedure.','Check the policy and raise the request for review.'],fr:['Signaler un problème','Suivez la procédure de signalement.','Vérifiez la politique et soumettez la demande pour examen.'],ar:['الإبلاغ عن مخاوف','اتبع إجراءات الإبلاغ.','راجع السياسة وارفع الطلب للمراجعة.']};
  var languageButtons=document.querySelectorAll('[data-lesson-language]');
  languageButtons.forEach(function(button){button.addEventListener('click',function(){
    var key=button.dataset.lessonLanguage,copy=translations[key],box=document.querySelector('.translated-lesson');
    languageButtons.forEach(function(other){other.setAttribute('aria-pressed',String(other===button));});
    box.lang=key;box.dir=key==='ar'?'rtl':'ltr';
    box.querySelector('[data-lesson-caption]').textContent=copy[0];box.querySelector('[data-lesson-translation]').textContent=copy[1];box.querySelector('[data-lesson-detail]').textContent=copy[2];
  });});
  var narration=document.querySelector('[data-narration]');
  if(narration)narration.addEventListener('click',function(){
    if(!('speechSynthesis' in window)){document.querySelector('.narration-caption').textContent='Follow the procedure. Check the request. Record your decision.';return;}
    if(speechSynthesis.speaking){speechSynthesis.cancel();narration.innerHTML='<span aria-hidden="true">▶</span> Play narration';return;}
    var speech=new SpeechSynthesisUtterance('Follow the procedure. Check the request. Record your decision.');speech.lang='en-GB';speech.rate=.92;
    narration.innerHTML='<span aria-hidden="true">■</span> Stop narration';
    speech.onend=speech.onerror=function(){narration.innerHTML='<span aria-hidden="true">▶</span> Play narration';};speechSynthesis.speak(speech);
  });
})();
