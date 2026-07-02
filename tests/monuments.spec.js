'use strict';
// Intégrité des monuments : chaque monument a une illustration, chaque
// fichier référencé existe, et le quiz génère bien des questions image.
const fs=require('fs');
const path=require('path');
const {runSpec,newAppPage,onboard,assert,ROOT,INDEX_PATH}=require('./helpers');

runSpec('monuments',async browser=>{
  // --- Vérifs structurelles (Node) : data ↔ fichiers ---
  const html=fs.readFileSync(INDEX_PATH,'utf8');
  const block=html.slice(html.indexOf('const MONUMENTS=['));
  const arr=block.slice(0,block.indexOf('];')+2);
  const entries=arr.split('\n').filter(l=>l.trim().startsWith('{'));
  assert(entries.length>=20,'trop peu de monuments : '+entries.length);
  // Chaque monument doit avoir une illustration (plus de fallback texte).
  const noImg=entries.filter(l=>!/img:'/.test(l));
  assert(noImg.length===0,'monuments sans illustration : '+noImg.length);
  // Chaque fichier référencé existe sur le disque.
  const dir=path.join(ROOT,'img','monuments');
  const referenced=[...arr.matchAll(/img:'([^']+)'/g)].map(m=>m[1]);
  const missing=referenced.filter(f=>!fs.existsSync(path.join(dir,f)));
  assert(missing.length===0,'fichiers monuments manquants : '+missing.join(', '));
  // Chaque SVG est un XML valide non trivial (> 400 octets = vrai dessin).
  referenced.forEach(f=>{
    const p=path.join(dir,f);
    const svg=fs.readFileSync(p,'utf8');
    assert(svg.indexOf('<svg')===0&&svg.trim().endsWith('</svg>'),'SVG malformé : '+f);
    assert(svg.length>400,'SVG trop pauvre (<400o), probablement un scribble : '+f);
  });

  // --- Vérif runtime : le quiz monuments génère des questions image ---
  const {page,errors}=await newAppPage(browser);
  await onboard(page);
  const res=await page.evaluate(()=>{
    kidsMode=false;category='monuments';difficulty='normal';
    const qs=generateForCat('monuments');
    return {
      n:qs.length,
      allImg:qs.every(q=>q.type==='image'&&/^img\/monuments\/.+\.svg$/.test(q.display)),
      allAns:qs.every(q=>q.options.length===4&&q.options.indexOf(q.answer)>-1)
    };
  });
  assert(res.n>=5,'quiz monuments trop court : '+res.n);
  assert(res.allImg,'toutes les questions monuments doivent être de type image (SVG)');
  assert(res.allAns,'chaque question doit avoir 4 options dont la bonne réponse');
  assert(errors.length===0,'erreurs de page : '+errors.join(' | '));
});
