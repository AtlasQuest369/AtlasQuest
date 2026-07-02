'use strict';
// Runner : exécute chaque *.spec.js dans un process isolé. `npm test`.
const fs=require('fs');
const path=require('path');
const {spawnSync}=require('child_process');

const dir=__dirname;
const specs=fs.readdirSync(dir).filter(f=>f.endsWith('.spec.js')).sort();

// Résolution de playwright : node_modules local, sinon installation globale.
let nodePath=process.env.NODE_PATH||'';
try{require.resolve('playwright');}
catch(e){
  const cand='/opt/node22/lib/node_modules';
  if(fs.existsSync(path.join(cand,'playwright')))
    nodePath=nodePath?nodePath+path.delimiter+cand:cand;
}

let failed=0;
for(const f of specs){
  const r=spawnSync(process.execPath,[path.join(dir,f)],{
    stdio:'inherit',
    env:Object.assign({},process.env,{NODE_PATH:nodePath})
  });
  if(r.status!==0)failed++;
}
console.log(failed===0
  ?'\n✅ Tous les tests passent ('+specs.length+' specs)'
  :'\n❌ '+failed+'/'+specs.length+' spec(s) en échec');
process.exit(failed?1:0);
