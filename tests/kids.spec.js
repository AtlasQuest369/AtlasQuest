'use strict';
// Parcours Enfant : onboarding → quiz complet sans faute → 3 étoiles.
const {runSpec,newAppPage,onboard,assert}=require('./helpers');

runSpec('kids',async browser=>{
  const {page,errors}=await newAppPage(browser);
  await onboard(page);
  const res=await page.evaluate(()=>{
    startKids('sci_s1_t1');
    if(!document.getElementById('view-quiz').classList.contains('active'))return {fail:'le quiz ne s\'affiche pas'};
    const n=totalQ;
    quizStartTime=Date.now()-n*4000; // neutralise l'anti-triche de vitesse
    let guard=0;
    while(document.getElementById('view-quiz').classList.contains('active')&&guard<60){
      selectAnswer(questions[current].answer,null);
      nextAfterFact();
      guard++;
    }
    let ks={};try{ks=JSON.parse(userData.kids_stars||'{}');}catch(e){}
    return {
      n:n,
      results:document.getElementById('view-results').classList.contains('active'),
      stars:ks['sci_s1_t1']||0,
      review:!!(userData.kids_review&&userData.kids_review.indexOf('sci_s1_t1')>-1)
    };
  });
  assert(!res.fail,res.fail||'');
  assert(res.n>=5,'quiz trop court : '+res.n+' questions');
  assert(res.results,"l'écran de résultats doit s'afficher en fin de quiz");
  assert(res.stars===3,'3 étoiles attendues pour un sans-faute, obtenu : '+res.stars);
  assert(res.review,'la répétition espacée doit planifier une révision');

  // Boucle multilingue : les interfaces AR (RTL) et EN bootent le hub et
  // jouent un quiz complet (QA-RELEASE.md §2, P1).
  for(const L of ['ar','en']){
    const r=await page.evaluate(l=>{
      setLang(l);
      openKids();
      const dir=document.body.dir;
      const cat=l==='ar'?'ar_s1_t1':'en_s1_t1';
      startKids(cat);
      quizStartTime=Date.now()-totalQ*4000;
      let guard=0;
      while(document.getElementById('view-quiz').classList.contains('active')&&guard<60){
        selectAnswer(questions[current].answer,null);
        nextAfterFact();
        guard++;
      }
      let ks={};try{ks=JSON.parse(userData.kids_stars||'{}');}catch(e){}
      return {dir:dir,stars:ks[cat]||0};
    },L);
    assert(L==='ar'?r.dir==='rtl':r.dir==='ltr','direction '+(L==='ar'?'rtl':'ltr')+' attendue pour '+L);
    assert(r.stars===3,'3 étoiles attendues en interface '+L+', obtenu : '+r.stars);
  }
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
