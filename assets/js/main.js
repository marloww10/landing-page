(function(){
  var head=document.getElementById('top');
  var mb=document.getElementById('menu-btn'),mm=document.getElementById('m-menu');
  function setMenu(open){mm.hidden=!open;mb.setAttribute('aria-expanded',open?'true':'false');mb.querySelector('.sr').textContent=open?'Fechar menu':'Abrir menu'}
  mb.addEventListener('click',function(){setMenu(mm.hidden)});
  mm.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!mm.hidden){setMenu(false);mb.focus()}});
  function onScroll(){head.classList.toggle('scrolled',window.scrollY>8)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var el=document.getElementById(b.getAttribute('data-copy'));var txt=el.textContent.trim();
      function done(){b.textContent='Copiado';setTimeout(function(){b.textContent='Copiar'},1600)}
      function fallback(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selecionado'}
      try{navigator.clipboard.writeText(txt).then(done,fallback)}catch(e){fallback()}
    });
  });

  var rc=document.documentElement.classList;
  if(rc.contains('js')||rc.contains('sd')){
    document.querySelectorAll('.ttl .sel').forEach(function(el){
      var n=(el.getAttribute('data-t')||'').length||8;
      el.style.setProperty('--n',n);el.style.setProperty('--d',Math.max(.45,n*.075)+'s');
    });
    document.querySelectorAll('.services .rise').forEach(function(el,i){el.style.setProperty('--i',i%2)});
    document.querySelectorAll('.projects .rise').forEach(function(el,i){el.style.setProperty('--i',i%3)});
    document.querySelectorAll('.reveal-list li').forEach(function(el,i){el.style.setProperty('--i',i)});
    if(rc.contains('js')){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}});
    },{rootMargin:'0px 0px -25% 0px',threshold:0});
    document.querySelectorAll('.ttl,.rise,.step,.reveal-list').forEach(function(el){io.observe(el)});
    }
  }

  // ---------- Hero: select-all collapse, then rewrite the selected word ----------
  (function(){
    var root=document.documentElement,sa=document.getElementById('sa'),hs=document.getElementById('hs');
    if(!hs)return;var txt=hs.querySelector('.txt');
    var words=['funcionam','vendem','convertem','crescem'],idx=0,timer;
    function later(fn,ms){timer=setTimeout(fn,ms)}
    function setWord(w){txt.textContent=w;hs.setAttribute('data-t',w)}
    function select(w){
      var n=w.length;hs.style.setProperty('--n',n);hs.style.setProperty('--d',(n*55)+'ms');
      hs.classList.remove('idle');hs.classList.add('selecting');
      later(function(){hs.classList.remove('selecting');hs.classList.add('is-sel','idle');later(next,2600)},n*55+30);
    }
    function next(){
      if(document.hidden){later(next,1000);return}
      idx=(idx+1)%words.length;var w=words[idx],i=0;
      hs.classList.remove('is-sel','idle','selecting');setWord('');
      (function type(){i++;setWord(w.slice(0,i));if(i<w.length)later(type,80);else{hs.classList.add('idle');later(function(){select(w)},520)}})();
    }
    function startCycle(){later(next,2400)}
    if(!root.classList.contains('intro-on')){ if(root.classList.contains('sd')||root.classList.contains('js'))startCycle();return }
    function finish(){root.classList.remove('intro-on');if(sa&&sa.parentNode)sa.parentNode.removeChild(sa);startCycle()}
    if(window.scrollY>innerHeight*.4||!sa){finish();return}
    function collapse(){
      var r=hs.getBoundingClientRect(),fs=parseFloat(getComputedStyle(hs).fontSize);
      if(r.bottom<0||r.top>innerHeight){finish();return}
      var L=Math.max(0,r.left-.08*fs),R=Math.max(0,innerWidth-(r.right+.1*fs)),T=Math.max(0,r.top),B=Math.max(0,innerHeight-r.bottom);
      sa.style.animation='none';sa.style.clipPath='inset(0 0 0 0)';
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        sa.style.transition='clip-path .95s cubic-bezier(.76,0,.18,1)';
        sa.style.clipPath='inset('+T+'px '+R+'px '+B+'px '+L+'px)';
        setTimeout(function(){root.classList.remove('intro-on')},620);
        setTimeout(finish,1000);
      })});
    }
    var started=false;function go(){if(started)return;started=true;setTimeout(collapse,180)}
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(go)}
    setTimeout(go,1400);
  })();

  function shotH(){document.querySelectorAll('.shot').forEach(function(el){el.style.setProperty('--sh',el.clientHeight+'px')})}
  shotH();window.addEventListener('resize',shotH);

  // hide the floating WhatsApp button while the contact section (which has its own big button) is on screen
  var wf=document.getElementById('wa-float'),ct=document.getElementById('contato');
  if(wf&&ct&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){es.forEach(function(e){wf.classList.toggle('hide',e.isIntersecting)})},{threshold:.25}).observe(ct);
  }
})();
