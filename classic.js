/* Classic Portfolio — dependency-free accessible behavior. */
(() => {
  'use strict';
  const root=document.documentElement,body=document.body;
  const site=document.getElementById('site');
  const intro=document.getElementById('opening');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer=null,skipTimer=null,playing=false;
  function markSeen(){try{sessionStorage.setItem('rc-classic-seen','1')}catch(e){}}
  function finishIntro(){
    playing=false;
    window.clearTimeout(timer);window.clearTimeout(skipTimer);
    root.classList.remove('intro-on');
    intro?.classList.remove('is-skipping');
    body.classList.remove('is-locked');
    if(site)site.inert=false;
    markSeen();
  }
  function startIntro(){
    if(!intro||reduced.matches)return;
    window.clearTimeout(timer);window.clearTimeout(skipTimer);
    intro.classList.remove('is-skipping');
    root.classList.remove('intro-on');void intro.offsetWidth;
    root.classList.add('intro-on');playing=true;
    body.classList.add('is-locked');
    if(site)site.inert=true;
    timer=window.setTimeout(finishIntro,5000);
    intro.querySelector('.opening-skip')?.focus({preventScroll:true});
  }
  function skipIntro(){
    if(!playing)return;
    intro.classList.add('is-skipping');
    window.clearTimeout(timer);
    skipTimer=window.setTimeout(()=>{
      finishIntro();
      const main=document.getElementById('main');
      if(main){main.setAttribute('tabindex','-1');main.focus({preventScroll:true})}
    },450);
  }
  if(intro&&root.classList.contains('intro-on')&&!reduced.matches)startIntro();
  else{root.classList.remove('intro-on');if(site)site.inert=false}
  intro?.querySelector('.opening-skip')?.addEventListener('click',skipIntro);
  document.querySelector('.replay-intro')?.addEventListener('click',startIntro);
  reduced.addEventListener?.('change',e=>{if(e.matches)finishIntro()});
  window.addEventListener('pagehide',()=>{if(playing)finishIntro()},{once:true});
  const menu=document.querySelector('.menu-button');
  const nav=document.getElementById('site-nav');
  function closeMenu(){
    nav?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded','false');
    menu?.setAttribute('aria-label','Open menu');
  }
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&playing){e.preventDefault();skipIntro()}
    else if(e.key==='Escape')closeMenu();
  });
  menu?.addEventListener('click',()=>{
    if(!nav)return;
    const opening=!nav.classList.contains('is-open');
    nav.classList.toggle('is-open',opening);
    menu.setAttribute('aria-expanded',String(opening));
    menu.setAttribute('aria-label',opening?'Close menu':'Open menu');
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  window.addEventListener('resize',()=>{if(innerWidth>920)closeMenu()},{passive:true});
  document.querySelectorAll('.year').forEach(el=>el.textContent=String(new Date().getFullYear()));
  document.querySelector('.copy-email')?.addEventListener('click',async()=>{
    const feedback=document.querySelector('.copy-feedback');
    try{await navigator.clipboard.writeText('rohanchhaya108@gmail.com');if(feedback)feedback.textContent='ADDRESS COPIED'}
    catch{if(feedback)feedback.textContent='COPY UNAVAILABLE — USE THE EMAIL LINK'}
  });
})();