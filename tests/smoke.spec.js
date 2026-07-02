'use strict';
// Smoke : le script principal parse, l'app démarre hors-ligne sans erreur.
const fs=require('fs');
const {runSpec,newAppPage,assert,INDEX_PATH}=require('./helpers');

runSpec('smoke',async browser=>{
  // 1) Parse-check du plus gros bloc <script>
  const html=fs.readFileSync(INDEX_PATH,'utf8');
  const blocks=(html.match(/<script>([\s\S]*?)<\/script>/g)||[])
    .map(s=>s.replace(/^<script>/,'').replace(/<\/script>$/,''));
  const main=blocks.sort((a,b)=>b.length-a.length)[0];
  assert(main&&main.length>100000,'bloc script principal introuvable');
  new Function(main); // lève une SyntaxError si le script est cassé

  // 2) Boot à froid : onboarding affiché, zéro erreur de page
  const {page,errors}=await newAppPage(browser);
  const onboardingVisible=await page.evaluate(
    ()=>document.getElementById('view-onboarding').classList.contains('active'));
  assert(onboardingVisible,"l'onboarding doit s'afficher au premier lancement");

  // 3) Conformité architecture : chaque vue du DOM est déclarée dans ROUTES,
  //    et le registre de contenu Enfant classe correctement les catégories.
  const arch=await page.evaluate(()=>{
    const ids=[...document.querySelectorAll('[id^="view-"]')].map(e=>e.id)
      .filter(id=>/^view-[a-z]+$/.test(id));
    const newCats=['dict_ar','dict_fr','dict_en','ord_ar','ord_fr','ord_en',
      'sort_ar','sort_fr','sort_en','mult_t2','mult_t5','mult_t9'];
    return {
      missing:ids.filter(id=>!(id in ROUTES)).join(','),
      kidsOk:isKidsCat('sci_s1_t1')&&isKidsCat('math_s5_t3')&&!isKidsCat('capitals')&&!isKidsCat('sci_s6_t1'),
      lessons:newCats.filter(c=>!(LESSONS[c]&&LESSONS[c].p&&LESSONS[c].p.length&&LESSONS[c].e&&LESSONS[c].e.length)).join(',')
    };
  });
  assert(arch.missing==='','vues absentes de ROUTES : '+arch.missing);
  assert(arch.kidsOk,'isKidsCat ne classe pas correctement les catégories');
  assert(arch.lessons==='','exercices sans leçon de remédiation : '+arch.lessons);

  // 4) Version de schéma : posée à l'onboarding, restaurée par migration au boot
  const mig=await page.evaluate(()=>{
    finishOnboard();
    const v1=userData.v===1;
    delete userData.v;saveData(userData); // simule une donnée d'avant la v1
    return v1;
  });
  assert(mig,"userData.v doit être posé à l'onboarding");
  await page.reload();
  await page.waitForTimeout(400);
  const mig2=await page.evaluate(()=>!!(userData&&userData.v===1));
  assert(mig2,'migrateUserData doit restaurer userData.v au boot');
  assert(errors.length===0,'erreurs de page au boot : '+errors.join(' | '));
});
