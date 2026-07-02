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
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
