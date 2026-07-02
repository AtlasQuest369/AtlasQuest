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
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
