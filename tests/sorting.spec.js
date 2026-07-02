'use strict';
// Tri & classement (glisser-déposer) : boîtes de dépôt, sélection/dépôt,
// retrait, manche fausse détectée, intégration au pipeline Enfant.
const {runSpec,newAppPage,onboard,assert}=require('./helpers');

runSpec('sorting',async browser=>{
  const {page,errors}=await newAppPage(browser);
  await onboard(page);

  // 1) Registre + banques valides (≥10 manches, 2 catégories × 3 éléments uniques)
  const setup=await page.evaluate(()=>{
    const reg=isKidsCat('sort_fr')&&isKidsCat('sort_ar')&&isKidsCat('sort_en')&&!isKidsCat('sort_de');
    const banksOk=['ar','fr','en'].every(l=>SORT_BANKS[l].length>=10&&
      SORT_BANKS[l].every(r=>{
        const all=r.c[0].i.concat(r.c[1].i);
        return r.c.length===2&&r.c.every(c=>c.i.length===3)&&new Set(all).size===all.length;
      }));
    startSorting(); // interface FR → sort_fr
    return {reg:reg,banksOk:banksOk,
      quiz:document.getElementById('view-quiz').classList.contains('active'),
      type:questions[0].type,
      boxes:document.querySelectorAll('.sort-box').length,
      chips:document.getElementById('options').querySelectorAll('button[data-item]').length};
  });
  assert(setup.reg,'isKidsCat doit classer sort_{ar,fr,en} côté Enfant');
  assert(setup.banksOk,'banques de tri invalides (2 catégories × 3 éléments uniques)');
  assert(setup.quiz&&setup.type==='sort','question de type sort attendue');
  assert(setup.boxes===2&&setup.chips===6,'2 boîtes et 6 étiquettes attendues');

  // 2) Retrait : poser un mot, le retirer, le reposer ailleurs
  const undo=await page.evaluate(()=>{
    quizStartTime=Date.now()-totalQ*4000;
    const q=questions[0];
    const chip=[...document.getElementById('options').querySelectorAll('button[data-item]')][0];
    const w=chip.getAttribute('data-item');
    chip.click();sortBoxTap(0); // dépôt boîte 0
    const placed1=sortState.placed[0].length===1;
    document.getElementById('sort-box-0').querySelector('button').click(); // retrait
    const back=sortState.placed[0].length===0&&chip.style.display!=='none'&&!chip.disabled;
    return {placed1:placed1,back:back,w:w};
  });
  assert(undo.placed1,'le dépôt tap-puis-tap doit fonctionner');
  assert(undo.back,'le retrait doit rendre l’étiquette au pool');

  // 3) Manche 1 : tout placer correctement → réponse juste
  await page.evaluate(()=>{
    const q=questions[0];
    q.cats.forEach((c,ci)=>{c.i.forEach(w=>{
      const chip=[...document.getElementById('options').querySelectorAll('button[data-item]')]
        .find(b=>!b.disabled&&b.style.display!=='none'&&b.getAttribute('data-item')===w);
      chip.click();sortBoxTap(ci);
    });});
  });
  await page.waitForTimeout(600);
  const r1=await page.evaluate(()=>({correct:correctCount,fact:!document.getElementById('fact-card').classList.contains('hidden')}));
  assert(r1.correct===1,'manche triée correctement : réponse juste attendue');
  assert(r1.fact,'la carte de validation doit s’afficher');

  // 4) Manche 2 : tout dans la mauvaise boîte → réponse fausse
  await page.evaluate(()=>{
    nextAfterFact();
    const q=questions[current];
    q.cats.forEach((c,ci)=>{c.i.forEach(w=>{
      const chip=[...document.getElementById('options').querySelectorAll('button[data-item]')]
        .find(b=>!b.disabled&&b.style.display!=='none'&&b.getAttribute('data-item')===w);
      chip.click();sortBoxTap(1-ci); // boîte inversée
    });});
  });
  await page.waitForTimeout(600);
  const r2=await page.evaluate(()=>correctCount);
  assert(r2===1,'manche mal triée : la réponse doit compter fausse (correctCount inchangé)');

  // 5) Fin du quiz → étoiles enregistrées + révision planifiée
  const end=await page.evaluate(()=>{
    nextAfterFact();
    let guard=0;
    while(document.getElementById('view-quiz').classList.contains('active')&&guard<80){
      selectAnswer(questions[current].answer,null);
      nextAfterFact();
      guard++;
    }
    let ks={};try{ks=JSON.parse(userData.kids_stars||'{}');}catch(e){}
    return {stars:ks['sort_fr']||0,
      review:!!(userData.kids_review&&userData.kids_review.indexOf('sort_fr')>-1)};
  });
  assert(end.stars>=2,'≥2 étoiles attendues (1 seule erreur), obtenu : '+end.stars);
  assert(end.review,'l’exercice doit alimenter la répétition espacée');
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
