'use strict';
// Dictée audio : type de question « audio » (mot masqué, haut-parleur),
// intégration complète au pipeline Enfant (étoiles, révision, objectif).
const {runSpec,newAppPage,onboard,assert}=require('./helpers');

runSpec('dictation',async browser=>{
  const {page,errors}=await newAppPage(browser);
  await onboard(page);

  const res=await page.evaluate(()=>{
    // Le registre de contenu doit classer les dictées côté Enfant
    const reg=isKidsCat('dict_fr')&&isKidsCat('dict_ar')&&isKidsCat('dict_en')&&!isKidsCat('dict_de');
    // Chaque banque : ≥ 10 mots, 3 graphies fautives distinctes du mot
    const banksOk=['ar','fr','en'].every(l=>{
      const bank=DICT_BANKS[l];
      const words=bank.map(e=>e[0]);
      const noDupWord=new Set(words).size===words.length;
      const entriesOk=bank.every(e=>{
        const opts=[e[0]].concat(e[1]);
        return e[1].length===3&&new Set(opts).size===4; // mot + 3 fautes, tous distincts
      });
      return bank.length>=10&&noDupWord&&entriesOk;
    });
    startDictation(); // interface FR par défaut → dict_fr
    const quiz=document.getElementById('view-quiz').classList.contains('active');
    const q=questions[0];
    const audioType=q.type==='audio'&&q.word===q.answer&&q.options.indexOf(q.answer)>-1;
    const wordHidden=document.getElementById('text-question').classList.contains('hidden')
      &&document.getElementById('flag-display').innerHTML.indexOf('🔊')>-1
      &&document.getElementById('flag-display').innerHTML.indexOf(q.word)===-1;
    // Le quiz se termine et alimente étoiles + répétition espacée
    quizStartTime=Date.now()-totalQ*4000;
    let guard=0;
    while(document.getElementById('view-quiz').classList.contains('active')&&guard<60){
      selectAnswer(questions[current].answer,null);
      nextAfterFact();
      guard++;
    }
    let ks={};try{ks=JSON.parse(userData.kids_stars||'{}');}catch(e){}
    return {reg:reg,banksOk:banksOk,quiz:quiz,audioType:audioType,wordHidden:wordHidden,
      stars:ks['dict_fr']||0,
      review:!!(userData.kids_review&&userData.kids_review.indexOf('dict_fr')>-1)};
  });

  assert(res.reg,'isKidsCat doit classer dict_{ar,fr,en} côté Enfant (et rejeter le reste)');
  assert(res.banksOk,'banques de dictée invalides (≥10 mots, 3 graphies fautives ≠ mot)');
  assert(res.quiz,'startDictation doit ouvrir le quiz');
  assert(res.audioType,'question de type audio attendue (word=answer, présent dans options)');
  assert(res.wordHidden,'le mot dicté ne doit JAMAIS être affiché — haut-parleur seul');
  assert(res.stars===3,'3 étoiles attendues sur dict_fr, obtenu : '+res.stars);
  assert(res.review,'la dictée doit alimenter la répétition espacée');
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
