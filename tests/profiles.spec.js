'use strict';
// Profils multi-enfants : migration, ajout (reload), isolation des données,
// bascule aller-retour, suppression d'un profil inactif.
const {runSpec,newAppPage,onboard,assert}=require('./helpers');

runSpec('profiles',async browser=>{
  const {page,errors}=await newAppPage(browser);
  await onboard(page);

  // 1) Premier rendu du tableau de bord : migration → 1 profil actif
  const r1=await page.evaluate(()=>{
    userData.total_xp=123;saveData(userData);
    renderParentDashboard();
    const reg=JSON.parse(localStorage.getItem('aq_profiles'));
    return {n:reg.list.length,active:!!reg.active,
      addBtn:document.getElementById('parent-content').innerHTML.indexOf('profAdd()')>-1};
  });
  assert(r1.n===1&&r1.active,'migration : 1 profil actif attendu');
  assert(r1.addBtn,'bouton « + Ajouter un enfant » absent');

  // 2) Ajout d'un profil → reload → onboarding pour le nouveau
  await page.evaluate(()=>{window.prompt=()=>'Yanis';profAdd();}).catch(()=>{}); // reload détruit le contexte
  await page.waitForTimeout(800);
  const r2=await page.evaluate(()=>{
    const reg=JSON.parse(localStorage.getItem('aq_profiles'));
    return {n:reg.list.length,name:reg.list[1].name,
      onboarding:document.getElementById('view-onboarding').classList.contains('active')};
  });
  assert(r2.n===2,'2 profils attendus après ajout, obtenu '+r2.n);
  assert(r2.name==='Yanis','nom du nouveau profil attendu « Yanis », obtenu '+r2.name);
  assert(r2.onboarding,"le nouveau profil doit démarrer sur l'onboarding");

  // 3) Le nouveau termine son onboarding, joue, puis retour au profil 1
  const firstId=await page.evaluate(()=>{
    finishOnboard();
    userData.total_xp=7;saveData(userData);
    return JSON.parse(localStorage.getItem('aq_profiles')).list[0].id;
  });
  await page.evaluate(id=>profSwitch(id),firstId).catch(()=>{}); // reload
  await page.waitForTimeout(800);
  const r4=await page.evaluate(()=>({
    xp:userData&&userData.total_xp,
    active:JSON.parse(localStorage.getItem('aq_profiles')).active
  }));
  assert(r4.xp===123,'retour au profil 1 : total_xp attendu 123, obtenu '+r4.xp);
  assert(r4.active===firstId,'le registre doit pointer sur le profil 1');

  // 4) Le profil 2 conserve ses données dans son emplacement
  const slotOk=await page.evaluate(()=>{
    const reg=JSON.parse(localStorage.getItem('aq_profiles'));
    const other=reg.list.find(p=>p.id!==reg.active);
    const raw=localStorage.getItem('aq_p_'+other.id);
    const d=dec(raw);
    return d&&d.total_xp===7;
  });
  assert(slotOk,'les données du profil 2 doivent être conservées dans son emplacement');

  // 5) Suppression du profil inactif (jamais l'actif)
  const r5=await page.evaluate(()=>{
    window.confirm=()=>true;
    const reg=JSON.parse(localStorage.getItem('aq_profiles'));
    const activeId=reg.active;
    profRemove(activeId); // doit être refusé
    const other=JSON.parse(localStorage.getItem('aq_profiles')).list.find(p=>p.id!==activeId);
    profRemove(other.id);
    const reg2=JSON.parse(localStorage.getItem('aq_profiles'));
    return {n:reg2.list.length,slot:localStorage.getItem('aq_p_'+other.id),stillActive:reg2.active===activeId};
  });
  assert(r5.stillActive,'le profil actif ne doit jamais être supprimable');
  assert(r5.n===1,'1 profil attendu après suppression, obtenu '+r5.n);
  assert(r5.slot===null,"l'emplacement du profil supprimé doit être purgé");
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
