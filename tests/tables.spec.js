'use strict';
// Tables de multiplication : génération programmatique correcte,
// distracteurs valides, maîtrise par table, grille du hub.
const {runSpec,newAppPage,onboard,assert}=require('./helpers');

runSpec('tables',async browser=>{
  const {page,errors}=await newAppPage(browser);
  await onboard(page);

  const res=await page.evaluate(()=>{
    const reg=isKidsCat('mult_t2')&&isKidsCat('mult_t9')&&!isKidsCat('mult_t1')&&!isKidsCat('mult_t10');
    // Grille du hub : 8 tables
    openKids();
    toggleTablesGrid();
    const grid=document.getElementById('kids-tables-grid');
    const gridOk=grid.style.display!=='none'&&grid.querySelectorAll('button').length===8;
    // Génération : chaque question est arithmétiquement exacte
    startKids('mult_t7');
    const structOk=questions.every(q=>{
      const m=q.display.match(/(\d+) × (\d+)/);
      if(!m)return false;
      const good=String((+m[1])*(+m[2]))===q.answer;
      const uniq=new Set(q.options).size===q.options.length;
      const hasAns=q.options.indexOf(q.answer)>-1;
      const positive=q.options.every(o=>+o>0);
      return good&&uniq&&hasAns&&positive&&q.options.length===4;
    });
    // Quiz complet sans faute
    quizStartTime=Date.now()-totalQ*4000;
    let guard=0;
    while(document.getElementById('view-quiz').classList.contains('active')&&guard<60){
      selectAnswer(questions[current].answer,null);
      nextAfterFact();
      guard++;
    }
    let ks={};try{ks=JSON.parse(userData.kids_stars||'{}');}catch(e){}
    // Retour au hub : étoiles visibles sur la grille et le libellé
    openKids();renderTablesGrid();
    const starsInGrid=document.getElementById('kids-tables-grid').innerHTML.indexOf('★★★')>-1;
    return {reg:reg,gridOk:gridOk,structOk:structOk,
      stars:ks['mult_t7']||0,
      review:!!(userData.kids_review&&userData.kids_review.indexOf('mult_t7')>-1),
      starsInGrid:starsInGrid};
  });

  assert(res.reg,'isKidsCat doit classer mult_t2..t9 (et rejeter t1/t10)');
  assert(res.gridOk,'la grille des 8 tables doit s’afficher');
  assert(res.structOk,'questions générées invalides (exactitude, 4 options uniques, positives)');
  assert(res.stars===3,'3 étoiles attendues sur mult_t7, obtenu : '+res.stars);
  assert(res.review,'les tables doivent alimenter la répétition espacée');
  assert(res.starsInGrid,'les étoiles de la table 7 doivent apparaître dans la grille');
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
