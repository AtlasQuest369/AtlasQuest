'use strict';
// Espace Parent : PIN (création, refus, accès), tableau de bord, cloud simulé.
const {runSpec,newAppPage,onboard,assert}=require('./helpers');

runSpec('parent',async browser=>{
  const {page,errors,counters}=await newAppPage(browser,{
    mockCloud:true,
    cloudData:{total_xp:999,quizzes_completed:7,kids_stars:'{}',kids_badges:'{}',kids_review:'{}'}
  });
  await onboard(page);

  // Création du PIN
  const created=await page.evaluate(()=>{
    openParent();
    const modal=!document.getElementById('modal-parent-pin').classList.contains('hidden');
    document.getElementById('pin-input').value='1234';
    submitParentPin();
    return {modal:modal,view:document.getElementById('view-parent').classList.contains('active'),pin:!!userData.parent_pin};
  });
  assert(created.modal,"la modale PIN doit s'afficher");
  assert(created.view,"l'Espace Parent doit s'ouvrir après création du PIN");
  assert(created.pin,'le PIN doit être enregistré (hashé)');

  // Mauvais PIN refusé
  const locked=await page.evaluate(()=>{
    switchView('view-dashboard');
    openParent();
    document.getElementById('pin-input').value='9999';
    submitParentPin();
    return document.getElementById('view-parent').classList.contains('active');
  });
  assert(locked===false,"un mauvais PIN ne doit pas ouvrir l'Espace Parent");

  // Bon PIN + contenu du tableau de bord
  const dash=await page.evaluate(()=>{
    document.getElementById('pin-input').value='1234';
    submitParentPin();
    const h=document.getElementById('parent-content').innerHTML;
    return {
      open:document.getElementById('view-parent').classList.contains('active'),
      share:h.indexOf('shareParentReport')>-1,
      cloud:h.indexOf('cloudSave()')>-1
    };
  });
  assert(dash.open,"le bon PIN doit ouvrir l'Espace Parent");
  assert(dash.share,'bouton de partage du bulletin absent');
  assert(dash.cloud,'section ☁️ cloud absente du tableau de bord');

  // Sauvegarde cloud (backend simulé)
  await page.evaluate(()=>cloudSave());
  await page.waitForTimeout(400);
  assert(counters.put===1,'put_backup attendu 1×, reçu '+counters.put);
  assert(counters.lastPut&&counters.lastPut.p_code&&counters.lastPut.p_data,'payload put_backup incomplet');
  assert(await page.evaluate(()=>!!userData.cloud_last),'cloud_last non renseigné après sauvegarde');

  // Restauration (backend simulé)
  await page.evaluate(()=>{window.prompt=()=>'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';cloudRestore();});
  await page.waitForTimeout(400);
  const xp=await page.evaluate(()=>userData.total_xp);
  assert(xp===999,'restauration : total_xp attendu 999, obtenu '+xp);
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
