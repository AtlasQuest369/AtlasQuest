'use strict';
// Isolation Mode Enfant : pas de publicité ni de lien externe en vue enfant
// (barrière de contenu — docs/ARCHITECTURE.md §4.3).
const {runSpec,newAppPage,onboard,assert}=require('./helpers');

runSpec('isolation',async browser=>{
  const {page,errors}=await newAppPage(browser);
  await onboard(page);
  const res=await page.evaluate(()=>{
    const ad=document.getElementById('ad-banner');
    const out={adDash:!ad.classList.contains('hidden'),adChild:[],extLinks:[]};
    ['view-kids','view-review','view-parent'].forEach(v=>{
      switchView(v);
      out.adChild.push({v:v,visible:!ad.classList.contains('hidden')});
    });
    ['view-kids','view-lesson','view-match','view-review','view-kidsreport'].forEach(v=>{
      const el=document.getElementById(v);if(!el)return;
      el.querySelectorAll('a[href^="http"]').forEach(a=>out.extLinks.push(v+' → '+a.href));
    });
    startKids('sci_s1_t1'); // quiz enfant : la pub doit rester masquée
    out.adKidsQuiz=!ad.classList.contains('hidden');
    return out;
  });
  assert(res.adDash===true,'la pub doit être visible sur le tableau de bord adulte (non premium)');
  res.adChild.forEach(r=>assert(r.visible===false,'pub visible dans la vue enfant '+r.v));
  assert(res.adKidsQuiz===false,'pub visible pendant un quiz enfant');
  assert(res.extLinks.length===0,'liens externes en vue enfant : '+res.extLinks.join(', '));

  // Séparation VISUELLE enfant/adulte : le thème kids-mode s'applique en
  // contexte enfant (hub + quiz enfant) et JAMAIS en contexte adulte.
  const theme=await page.evaluate(()=>{
    const has=()=>document.body.classList.contains('kids-mode');
    switchView('view-kids');const kHub=has();
    startKids('sci_s1_t1');const kQuiz=has();
    switchView('view-dashboard');const aDash=has();
    kidsMode=false;category='flags';switchView('view-quiz');const aQuiz=has();
    switchView('view-parent');const parent=has();
    return {kHub,kQuiz,aDash,aQuiz,parent};
  });
  assert(theme.kHub&&theme.kQuiz,'le thème enfant doit s’appliquer au hub et au quiz enfant');
  assert(!theme.aDash&&!theme.aQuiz,'le thème enfant ne doit JAMAIS s’appliquer au mode adulte');
  assert(!theme.parent,'l’espace parent reste neutre (pas de thème enfant)');
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
