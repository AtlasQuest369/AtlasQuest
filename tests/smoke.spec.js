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
  assert(errors.length===0,'erreurs de page au boot : '+errors.join(' | '));
});
