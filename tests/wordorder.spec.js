'use strict';
// Construction de phrases (ordre des mots) : étiquettes tap-to-build,
// validation auto, intégration au pipeline Enfant (étoiles, révision).
const {runSpec,newAppPage,onboard,assert}=require('./helpers');

runSpec('wordorder',async browser=>{
  const {page,errors}=await newAppPage(browser);
  await onboard(page);

  // 1) Registre + banques valides (≥10 phrases de ≥3 mots)
  const setup=await page.evaluate(()=>{
    const reg=isKidsCat('ord_fr')&&isKidsCat('ord_ar')&&isKidsCat('ord_en')&&!isKidsCat('ord_de');
    const banksOk=['ar','fr','en'].every(l=>ORDER_BANKS[l].length>=10&&
      ORDER_BANKS[l].every(s=>s.split(' ').length>=3));
    startWordOrder(); // interface FR → ord_fr
    const q=questions[0];
    return {reg:reg,banksOk:banksOk,
      quiz:document.getElementById('view-quiz').classList.contains('active'),
      type:q.type,nWords:q.words.length,
      chips:document.getElementById('options').querySelectorAll('button').length,
      builtEmpty:document.getElementById('ord-built').textContent==='…'};
  });
  assert(setup.reg,'isKidsCat doit classer ord_{ar,fr,en} côté Enfant');
  assert(setup.banksOk,'banques de phrases invalides (≥10 phrases, ≥3 mots)');
  assert(setup.quiz&&setup.type==='order','question de type order attendue');
  assert(setup.chips===setup.nWords+1,'une étiquette par mot + bouton ↺ attendus');
  assert(setup.builtEmpty,'la zone de construction doit démarrer vide');

  // 2) Construction par tap dans le BON ordre → réponse correcte
  const built=await page.evaluate(()=>{
    quizStartTime=Date.now()-totalQ*4000;
    const q=questions[0];
    q.answer.split(' ').forEach(w=>{
      const chip=[...document.getElementById('options').querySelectorAll('button')]
        .find(b=>!b.disabled&&b.textContent===w);
      chip.click();
    });
    return document.getElementById('ord-built').textContent;
  });
  await page.waitForTimeout(500); // laisse la validation auto (250 ms) se faire
  const afterFirst=await page.evaluate(()=>({correct:correctCount,fact:!document.getElementById('fact-card').classList.contains('hidden')}));
  assert(afterFirst.correct===1,'la phrase construite dans le bon ordre doit compter juste');
  assert(afterFirst.fact,'la carte de correction/validation doit s’afficher');
  assert(built.split(' ').length>=3,'la zone de construction doit contenir la phrase');

  // 3) Fin du quiz sans faute → étoiles + révision
  const end=await page.evaluate(()=>{
    nextAfterFact();
    let guard=0;
    while(document.getElementById('view-quiz').classList.contains('active')&&guard<60){
      selectAnswer(questions[current].answer,null);
      nextAfterFact();
      guard++;
    }
    let ks={};try{ks=JSON.parse(userData.kids_stars||'{}');}catch(e){}
    return {stars:ks['ord_fr']||0,
      review:!!(userData.kids_review&&userData.kids_review.indexOf('ord_fr')>-1)};
  });
  assert(end.stars===3,'3 étoiles attendues sur ord_fr, obtenu : '+end.stars);
  assert(end.review,'l’exercice doit alimenter la répétition espacée');
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
