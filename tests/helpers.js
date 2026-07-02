'use strict';
// Harnais e2e AtlasQuest — hors-ligne strict (voir docs/ARCHITECTURE.md §8).
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

const ROOT=path.resolve(__dirname,'..');
const INDEX_PATH=path.join(ROOT,'index.html');
const INDEX_URL='file://'+INDEX_PATH;

// URL du backend lue dans le code source (unique source de vérité).
function cloudUrl(){
  const m=fs.readFileSync(INDEX_PATH,'utf8').match(/CLOUD=\{url:'([^']+)'/);
  return m?m[1]:null;
}

async function launch(){
  const exe='/opt/pw-browsers/chromium';
  return chromium.launch(fs.existsSync(exe)?{executablePath:exe}:{});
}

// Contexte hors-ligne : seul file:// passe ; tout le reste est bloqué.
// opts.mockCloud simule le backend Supabase (compteurs put/get exposés).
async function newAppPage(browser,opts){
  opts=opts||{};
  const ctx=await browser.newContext();
  await ctx.route('**/*',r=>r.request().url().startsWith('file://')?r.continue():r.abort());
  const counters={put:0,get:0,lastPut:null};
  const cu=cloudUrl();
  if(opts.mockCloud&&cu){
    await ctx.route(cu+'/**',async r=>{
      const u=r.request().url();
      if(u.includes('/rpc/put_backup')){counters.put++;counters.lastPut=JSON.parse(r.request().postData());return r.fulfill({status:204,body:''});}
      if(u.includes('/rpc/get_backup')){counters.get++;return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(opts.cloudData||null)});}
      return r.fulfill({status:404,body:''});
    });
  }
  const page=await ctx.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(INDEX_URL);
  await page.waitForTimeout(400);
  return {ctx,page,errors,counters};
}

// Crée un utilisateur comme le ferait la fin de l'onboarding réel.
async function onboard(page){
  await page.evaluate(()=>finishOnboard());
}

function assert(cond,msg){if(!cond)throw new Error('ÉCHEC : '+msg);}

// Exécute un spec : PASS/FAIL sur stdout, code de sortie du process.
async function runSpec(name,fn){
  const browser=await launch();
  let err=null;
  try{await fn(browser);}catch(e){err=e;}
  await browser.close().catch(()=>{});
  if(err){console.error('FAIL '+name+' — '+(err&&err.message||err));process.exitCode=1;}
  else{console.log('PASS '+name);}
}

module.exports={ROOT,INDEX_PATH,INDEX_URL,cloudUrl,launch,newAppPage,onboard,assert,runSpec};
