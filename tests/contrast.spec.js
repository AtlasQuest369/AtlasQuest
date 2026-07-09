'use strict';
// Garde anti-régression de lisibilité (Audit v2 · H-06).
// Parcourt les écrans clés d'Ines Kids et échoue si un texte visible passe
// sous le seuil de contraste WCAG 2.1 AA (SC 1.4.3) : 4,5:1 pour le texte
// normal, 3:1 pour le grand texte (≥24px, ou ≥18,66px gras).
// Mesure sur le rendu réel : composition alpha des fonds + opacité cumulée.
const path=require('path');
const {runSpec,assert,ROOT}=require('./helpers');

const INES_URL='file://'+path.join(ROOT,'ineskids','index.html');

// Injecté dans la page : renvoie la liste des textes sous le seuil AA du
// conteneur .view actif (ou d'un sélecteur donné).
function PROBE(rootSel){
  function parse(str){
    if(!str)return null;
    var m=str.match(/rgba?\(([^)]+)\)/);
    if(!m)return null;
    var p=m[1].split(',').map(function(s){return parseFloat(s);});
    return [p[0],p[1],p[2],p.length>3?p[3]:1];
  }
  // fg (avec alpha) composé sur bg (opaque) → couleur opaque résultante.
  function over(fg,bg){
    var a=fg[3];
    return [fg[0]*a+bg[0]*(1-a),fg[1]*a+bg[1]*(1-a),fg[2]*a+bg[2]*(1-a),1];
  }
  // Fond effectif d'un élément : empile les fonds des ancêtres et compose
  // du plus lointain (sur blanc) au plus proche.
  function effBg(el){
    var stack=[],e=el;
    while(e){
      var c=parse(getComputedStyle(e).backgroundColor);
      if(c&&c[3]>0)stack.push(c);
      e=e.parentElement;
    }
    var bg=[255,255,255,1];
    for(var i=stack.length-1;i>=0;i--)bg=over(stack[i],bg);
    return bg;
  }
  // Opacité cumulée (chaque ancêtre mélange l'élément avec l'arrière-plan).
  function cumOpacity(el){
    var o=1,e=el;
    while(e){var v=parseFloat(getComputedStyle(e).opacity);if(!isNaN(v))o*=v;e=e.parentElement;}
    return o;
  }
  function lum(c){
    var a=[c[0],c[1],c[2]].map(function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});
    return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];
  }
  function ratio(c1,c2){var l1=lum(c1),l2=lum(c2),hi=Math.max(l1,l2),lo=Math.min(l1,l2);return (hi+0.05)/(lo+0.05);}
  function visible(el){
    var s=getComputedStyle(el);
    if(s.display==='none'||s.visibility==='hidden')return false;
    var r=el.getBoundingClientRect();
    return r.width>0&&r.height>0;
  }
  // Un élément « porteur de texte » = a un enfant texte direct non vide.
  function hasOwnText(el){
    for(var i=0;i<el.childNodes.length;i++){
      var n=el.childNodes[i];
      if(n.nodeType===3&&n.textContent.trim().length>0)return true;
    }
    return false;
  }
  var root=rootSel?document.querySelector(rootSel):document.querySelector('.view.active');
  if(!root)return [];
  var fails=[];
  var all=root.querySelectorAll('*');
  for(var i=0;i<all.length;i++){
    var el=all[i];
    if(!hasOwnText(el)||!visible(el))continue;
    var s=getComputedStyle(el);
    var fg=parse(s.color);if(!fg)continue;
    var bg=effBg(el);
    var op=cumOpacity(el);
    var fgc=over([fg[0],fg[1],fg[2],fg[3]*op],bg);
    var r=ratio(fgc,bg);
    var size=parseFloat(s.fontSize)||16;
    var w=parseInt(s.fontWeight,10)||400;
    var large=size>=24||(size>=18.66&&w>=700);
    var min=large?3:4.5;
    if(r<min-0.05){ // marge de 0,05 pour le bruit d'arrondi
      fails.push({tag:el.tagName.toLowerCase(),id:el.id||'',
        txt:(el.textContent||'').trim().slice(0,32),
        ratio:Math.round(r*100)/100,min:min,size:size});
    }
  }
  return fails;
}

runSpec('contrast',async browser=>{
  const ctx=await browser.newContext();
  await ctx.route('**/*',r=>r.request().url().startsWith('file://')?r.continue():r.abort());
  const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(INES_URL);
  await page.waitForTimeout(400);
  await page.evaluate(()=>finishOnboard());

  const screens=[];
  // Laisse les transitions/animations CSS d'entrée se poser avant de mesurer
  // (sinon on lit une opacité de départ à 0 → faux 1:1).
  const settle=()=>page.waitForTimeout(450);

  // 1) Hub enfant (état par défaut)
  await settle();
  screens.push(['hub',await page.evaluate(PROBE,null)]);

  // 2) « Mon programme » déplié : matières + années + trimestres
  await page.evaluate(()=>{
    inesToggleProgram();
    var subs=document.querySelectorAll('#kids-subj-sel button');
    if(subs.length>1)subs[1].click(); else if(subs.length)subs[0].click();
  });
  await settle();
  screens.push(['programme',await page.evaluate(PROBE,'#ines-program')]);

  // 3) Quiz enfant (question + options)
  await page.evaluate(()=>startKids('sci_s1_t1'));
  await settle();
  screens.push(['quiz',await page.evaluate(PROBE,'#view-quiz')]);

  // 4) Bulletin (view-kidsreport) — écran historiquement fautif (blanc/crème).
  // On sème d'abord des étoiles pour que des pastilles/valeurs soient rendues.
  await page.evaluate(()=>{
    // Arabe : kidsSubjects() renvoie alors la liste MEN complète, donc nos
    // étoiles semées sur ar_/math_ rendent réellement les pastilles colorées.
    setLang('ar');
    try{var ks={};
      // années pleines (→ vert), année partielle (→ or), reste à 0 (→ gris),
      // et ≥15/45 étoiles sur une matière pour décrocher un badge (puce colorée).
      ks['ar_s1_t1']=3;ks['ar_s1_t2']=3;ks['ar_s1_t3']=3; // année 1 pleine → vert
      ks['ar_s2_t1']=3;ks['ar_s2_t2']=3;ks['ar_s2_t3']=3; // année 2 pleine → vert (18 → badge)
      ks['math_s1_t1']=2;                                  // partiel → or
      userData.kids_stars=JSON.stringify(ks);saveData(userData);}catch(e){}
    openKidsReport();
  });
  await settle();
  screens.push(['bulletin',await page.evaluate(PROBE,'#view-kidsreport')]);

  let total=0;
  screens.forEach(function(s){
    const name=s[0],fails=s[1]||[];
    total+=fails.length;
    if(fails.length){
      console.error('  ['+name+'] '+fails.length+' texte(s) sous le seuil AA :');
      fails.slice(0,8).forEach(function(f){
        console.error('    <'+f.tag+(f.id?' #'+f.id:'')+'> "'+f.txt+'" — '+f.ratio+':1 (min '+f.min+', '+f.size+'px)');
      });
    }
  });

  assert(total===0,total+' texte(s) sous le seuil de contraste WCAG AA (voir détail ci-dessus)');
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
