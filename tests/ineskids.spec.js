'use strict';
// Ines Kids : l'app enfant/famille boote proprement, thème clair, sans pub,
// sans chrome adulte — et le moteur pédagogique fonctionne.
const fs=require('fs');
const path=require('path');
const {runSpec,launch,assert,ROOT}=require('./helpers');

const INES_URL='file://'+path.join(ROOT,'ineskids','index.html');

runSpec('ineskids',async browser=>{
  const ctx=await browser.newContext();
  await ctx.route('**/*',r=>r.request().url().startsWith('file://')?r.continue():r.abort());
  const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(INES_URL);
  await page.waitForTimeout(400);

  // Config Ines : clé de stockage propre + flag + titre
  assert(fs.readFileSync(path.join(ROOT,'ineskids','index.html'),'utf8').indexOf("const SK='ineskids_v1'")>-1,
    'la clé de stockage doit être ineskids_v1 (isolée d’AtlasQuest)');

  const boot=await page.evaluate(()=>{
    finishOnboard();
    return {
      ines:document.body.classList.contains('ines-app'),
      kidsmode:document.body.classList.contains('kids-mode'),
      view:document.querySelector('.view.active')&&document.querySelector('.view.active').id,
      navHidden:getComputedStyle(document.querySelector('nav')).display==='none',
      badgesHidden:getComputedStyle(document.getElementById('header-badges')).display==='none',
      adHidden:document.getElementById('ad-banner').classList.contains('hidden'),
      title:document.getElementById('kids-title').textContent,
      light:getComputedStyle(document.body).backgroundColor
    };
  });
  assert(boot.ines,'body.ines-app doit être actif');
  assert(!boot.kidsmode,'le thème sombre kids-mode ne doit PAS être appliqué dans Ines Kids');
  assert(boot.view==='view-kids','Ines Kids doit démarrer dans le hub enfant');
  assert(boot.navHidden,'la bottom-nav adulte doit être masquée');
  assert(boot.badgesHidden,'les badges vies/gemmes adultes doivent être masqués');
  assert(boot.adHidden,'aucune pub ne doit s’afficher');
  assert(boot.title==='Ines Kids','le titre du hub doit être « Ines Kids »');

  // showAdBanner est neutralisé
  const noAd=await page.evaluate(()=>{showAdBanner();return document.getElementById('ad-banner').classList.contains('hidden');});
  assert(noAd,'showAdBanner doit rester sans effet dans Ines Kids');

  // Le moteur pédagogique fonctionne (quiz enfant complet → étoiles)
  const quiz=await page.evaluate(()=>{
    startKids('sci_s1_t1');
    if(!document.getElementById('view-quiz').classList.contains('active'))return {fail:'quiz non ouvert'};
    quizStartTime=Date.now()-totalQ*4000;let g=0;
    while(document.getElementById('view-quiz').classList.contains('active')&&g<60){
      selectAnswer(questions[current].answer,null);nextAfterFact();g++;
    }
    let ks={};try{ks=JSON.parse(userData.kids_stars||'{}');}catch(e){}
    return {stars:ks['sci_s1_t1']||0};
  });
  assert(!quiz.fail,quiz.fail||'');
  assert(quiz.stars===3,'le moteur enfant doit fonctionner (3 étoiles attendues), obtenu '+quiz.stars);

  // Espace parent : lien YouTube présent, pub récompensée OFF par défaut (sans ID AdMob)
  const parent=await page.evaluate(async()=>{
    switchView('view-dashboard');openParent();
    document.getElementById('pin-input').value='1234';
    await submitParentPin();
    const h=document.getElementById('parent-content').innerHTML;
    return {open:document.getElementById('view-parent').classList.contains('active'),
      yt:h.indexOf('inesOpenYouTube()')>-1,
      rewardedReady:inesRewardedReady(),
      rewardedBtn:h.indexOf('inesShowRewarded')>-1};
  });
  assert(parent.open,"l'espace parent doit s'ouvrir");
  assert(parent.yt,'le lien YouTube Ines Kids doit être présent dans l’espace parent');
  assert(parent.rewardedReady===false,'la pub récompensée doit être OFF tant qu’aucun ID AdMob n’est configuré');
  assert(parent.rewardedBtn===false,'aucun bouton de pub tant que le fournisseur n’est pas branché');
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
