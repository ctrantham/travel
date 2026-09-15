(function(){
  var KEY = "orlando-todos-v1";
  var list = document.getElementById("todo-list");
  if(!list) return;
  var items = Array.prototype.slice.call(list.querySelectorAll(".todo-item[data-todo]"));

  function load(){
    try{
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }
  function save(state){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){}
  }

  // Apply any saved state on top of the default markup.
  var saved = load();
  if(saved){
    items.forEach(function(el){
      var k = el.getAttribute("data-todo");
      if(saved.hasOwnProperty(k)){
        var done = !!saved[k];
        el.classList.toggle("done", done);
        el.setAttribute("aria-pressed", done ? "true" : "false");
      }
    });
  }

  function currentState(){
    var s = {};
    items.forEach(function(el){ s[el.getAttribute("data-todo")] = el.classList.contains("done"); });
    return s;
  }

  function toggle(el){
    var done = el.classList.toggle("done");
    el.setAttribute("aria-pressed", done ? "true" : "false");
    save(currentState());
  }

  items.forEach(function(el){
    el.addEventListener("click", function(){ toggle(el); });
    el.addEventListener("keydown", function(ev){
      if(ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar"){
        ev.preventDefault();
        toggle(el);
      }
    });
  });
})();
(function(){
  /* floating jump menu */
  var fab=document.getElementById('jumpFab'), menu=document.getElementById('jumpMenu');
  if(fab&&menu){
    fab.addEventListener('click',function(e){e.stopPropagation();menu.classList.toggle('open');});
    menu.addEventListener('click',function(e){ if(e.target.closest('a')) menu.classList.remove('open'); });
    document.addEventListener('click',function(e){ if(!menu.contains(e.target)&&e.target!==fab) menu.classList.remove('open'); });
  }
  /* food check-off */
  var FKEY='orlando-food-eaten-v1';
  var items=Array.prototype.slice.call(document.querySelectorAll('.fw-item[data-food]'));
  function loadF(){ try{return JSON.parse(localStorage.getItem(FKEY)||'{}');}catch(e){return {};} }
  function saveF(s){ try{localStorage.setItem(FKEY,JSON.stringify(s));}catch(e){} }
  var st=loadF();
  items.forEach(function(el){
    var k=el.getAttribute('data-food');
    if(st[k]){ el.classList.add('eaten'); el.setAttribute('aria-pressed','true'); } else { el.setAttribute('aria-pressed','false'); }
    function toggle(){ var on=el.classList.toggle('eaten'); el.setAttribute('aria-pressed',on?'true':'false'); var s=loadF(); if(on)s[k]=true; else delete s[k]; saveF(s); }
    el.addEventListener('click',function(e){ if(e.target.closest('a')) return; toggle(); });
    el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); if(e.target.closest('a'))return; toggle(); } });
  });
})();
(function(){
  /* live-updates buttons inside quick-look anchors */
  document.querySelectorAll('.gd-live').forEach(function(b){
    b.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); var u=b.getAttribute('data-href'); if(u) window.open(u,'_blank','noopener'); });
  });
  /* collapsible hour-by-hour days */
  var days=Array.prototype.slice.call(document.querySelectorAll('#hour-by-hour .day[id]'));
  var map={'hbh-sun':'2026-09-13','hbh-mon':'2026-09-14','hbh-tue':'2026-09-15','hbh-wed':'2026-09-16','hbh-thu':'2026-09-17','hbh-fri':'2026-09-18','hbh-sat':'2026-09-19'};
  function pad(n){return (n<10?'0':'')+n;}
  var t=new Date(); var iso=t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());
  days.forEach(function(d){
    d.classList.add('collapsed');
    var card=d.querySelector('.day-card'); if(!card) return;
    ['.day-top','.day-title'].forEach(function(sel){
      var el=card.querySelector(sel); if(!el) return;
      el.addEventListener('click',function(e){ if(e.target.closest('a')) return; d.classList.toggle('collapsed'); });
    });
  });
  function expand(id){ var el=document.getElementById(id); if(el) el.classList.remove('collapsed'); }
  /* open today */
  Object.keys(map).forEach(function(id){ if(map[id]===iso) expand(id); });
  /* open target when a jump link or quick-look card points at a day */
  document.querySelectorAll('a[href^="#hbh-"]').forEach(function(a){
    a.addEventListener('click',function(){ expand(a.getAttribute('href').slice(1)); });
  });
  if(location.hash && location.hash.indexOf('#hbh-')===0) expand(location.hash.slice(1));
})();
(function(){
  var sec=document.getElementById('plan');
  if(!sec||!sec.classList.contains('collapsible-sec'))return;
  var head=sec.querySelector('.sec-toggle');
  if(head) head.addEventListener('click',function(e){ if(e.target.closest('a'))return; sec.classList.toggle('collapsed'); });
  document.querySelectorAll('a[href="#plan"]').forEach(function(a){ a.addEventListener('click',function(){ sec.classList.remove('collapsed'); }); });
  if(location.hash==='#plan') sec.classList.remove('collapsed');
})();