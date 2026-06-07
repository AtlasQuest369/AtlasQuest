import { useState, useEffect, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@400;500;600;700&family=Cairo:wght@400;600;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{background:#060B18;font-family:'Poppins',sans-serif;color:#fff;overflow:hidden;height:100vh}
::-webkit-scrollbar{display:none}

@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes float{0%,100%{transform:translateY(0);opacity:.6}50%{transform:translateY(-10px);opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes confetti{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes adPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,150,0,.5)}70%{box-shadow:0 0 0 10px rgba(255,150,0,0)}}
@keyframes saveFlash{0%{opacity:1}50%{opacity:0}100%{opacity:1}}

.app{width:100vw;height:100vh;background:linear-gradient(160deg,#060B18 0%,#0D1228 50%,#060B18 100%);display:flex;flex-direction:column;overflow:hidden;position:relative}
.bg-dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,215,0,.025) 1px,transparent 1px);background-size:30px 30px;pointer-events:none;z-index:0}
.bg-orb1{position:absolute;width:350px;height:350px;background:radial-gradient(circle,rgba(255,215,0,.05) 0%,transparent 70%);top:-100px;right:-100px;pointer-events:none}
.bg-orb2{position:absolute;width:250px;height:250px;background:radial-gradient(circle,rgba(0,229,255,.04) 0%,transparent 70%);bottom:100px;left:-80px;pointer-events:none}

.lang-screen{position:fixed;inset:0;background:rgba(6,11,24,.98);z-index:500;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;animation:fadeUp .4s ease}
.lang-title{font-family:'Playfair Display',serif;font-size:22px;color:#FFD700;text-align:center;margin-bottom:12px;text-shadow:0 0 30px rgba(255,215,0,.5);line-height:1.6}
.lang-btn{width:300px;background:linear-gradient(135deg,#0D1B3E,#162040);border:2px solid rgba(255,215,0,.25);border-radius:22px;padding:20px 24px;display:flex;align-items:center;gap:18px;cursor:pointer;transition:all .2s;animation:fadeUp .4s ease both}
.lang-btn:active{transform:scale(.96);border-color:#FFD700;box-shadow:0 0 30px rgba(255,215,0,.3)}
.lang-flag{font-size:42px}.lang-info{text-align:left}
.lang-name{font-family:'Playfair Display',serif;font-size:20px;color:#fff}
.lang-sub{font-size:12px;color:#718096;margin-top:2px}

.header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:rgba(6,11,24,.9);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,215,0,.15);position:relative;z-index:10;flex-shrink:0}
.h-left{display:flex;align-items:center;gap:10px}
.flag-btn{width:38px;height:38px;border-radius:10px;border:2px solid rgba(255,215,0,.4);display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;transition:all .2s;background:rgba(13,27,62,.8)}
.flag-btn:active{transform:scale(.9);border-color:#FFD700}
.leo-wrap{position:relative;cursor:pointer}
.leo{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#7B3F00,#C8860A);display:flex;align-items:center;justify-content:center;font-size:26px;animation:breathe 3s ease-in-out infinite;box-shadow:0 0 20px rgba(255,215,0,.5),0 0 40px rgba(255,215,0,.15);border:2.5px solid #FFD700}
.leo-crown{position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-size:15px;animation:float 2s ease-in-out infinite}
.stats-row{display:flex;gap:8px;align-items:center}
.stat-pill{display:flex;align-items:center;gap:5px;padding:7px 13px;border-radius:20px;font-weight:700;font-size:14px;cursor:pointer;transition:transform .15s;backdrop-filter:blur(6px)}
.stat-pill:active{transform:scale(.92)}
.s-fire{background:rgba(26,10,0,.85);border:1.5px solid #FFD700;color:#FFD700;box-shadow:0 0 14px rgba(255,215,0,.3)}
.s-gem{background:rgba(0,20,40,.85);border:1.5px solid #00E5FF;color:#00E5FF;box-shadow:0 0 14px rgba(0,229,255,.25)}
.s-life{background:rgba(26,0,5,.85);border:1.5px solid #FF1744;color:#FF1744;box-shadow:0 0 14px rgba(255,23,68,.25)}
.save-indicator{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:10px;color:#00C853;letter-spacing:1px;animation:saveFlash .6s ease;pointer-events:none}

.ad-strip{background:linear-gradient(90deg,#0a0a1a,#0f0f22,#0a0a1a);border-top:1px solid rgba(255,150,0,.2);border-bottom:1px solid rgba(255,150,0,.1);padding:9px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0;position:relative;z-index:5;cursor:pointer;min-height:54px}
.ad-strip:active{opacity:.85}
.ad-tag{position:absolute;top:3px;right:8px;font-size:9px;color:#4A5568;letter-spacing:1px}
.ad-img{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#1a237e,#283593);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;border:1px solid rgba(255,215,0,.2)}
.ad-body{flex:1;min-width:0}
.ad-title{font-size:12px;font-weight:700;color:#FF9600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ad-desc{font-size:10px;color:#718096;margin-top:1px}
.ad-cta{background:linear-gradient(135deg,#FF9600,#FF6B00);color:#fff;font-size:11px;font-weight:700;padding:7px 14px;border-radius:12px;border:none;cursor:pointer;white-space:nowrap;flex-shrink:0;font-family:'Poppins',sans-serif;animation:adPulse 2s infinite}
.ad-x{font-size:16px;color:#4A5568;cursor:pointer;padding:4px 6px;flex-shrink:0}

.rewarded-bar{background:rgba(13,27,62,.9);border-top:1px solid rgba(255,150,0,.25);padding:9px 16px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;flex-shrink:0;z-index:5;transition:background .2s}
.rewarded-bar:active{background:rgba(255,150,0,.1)}
.rb-icon{font-size:16px}.rb-text{font-size:12px;color:#FF9600;font-weight:600}
.rb-badge{background:rgba(255,150,0,.15);border:1px solid rgba(255,150,0,.3);border-radius:10px;padding:3px 10px;font-size:11px;color:#FF9600;font-weight:700}

.content{flex:1;overflow-y:auto;position:relative;z-index:1;scrollbar-width:none}

.streak-card{background:linear-gradient(135deg,#0D1B3E,#162040);border-radius:22px;padding:20px;margin:16px 16px 20px;position:relative;overflow:hidden;border:1.5px solid rgba(255,215,0,.4);box-shadow:0 8px 32px rgba(0,0,0,.4),0 0 0 1px rgba(255,215,0,.1);animation:fadeUp .5s ease}
.sc-inner{display:flex;align-items:center;gap:16px;position:relative;z-index:1}
.sc-leo{width:68px;height:68px;border-radius:50%;background:linear-gradient(135deg,#6B3200,#C8860A);display:flex;align-items:center;justify-content:center;font-size:38px;box-shadow:0 0 24px rgba(255,215,0,.5);border:2.5px solid #FFD700;animation:breathe 3s ease-in-out infinite;flex-shrink:0;position:relative}
.sc-content{flex:1}
.sc-label{font-size:10px;font-weight:600;letter-spacing:3px;color:#718096;text-transform:uppercase;margin-bottom:3px}
.sc-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:#FFD700;line-height:1.1;text-shadow:0 0 20px rgba(255,215,0,.3)}
.sc-sub{font-size:13px;color:#00E5FF;margin-top:5px;font-weight:500}
.sc-particle{position:absolute;width:5px;height:5px;border-radius:50%;background:#FFD700;opacity:0;animation:float 3s ease-in-out infinite}

.sec-title{font-size:11px;font-weight:700;color:#FFD700;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:10px;padding:0 16px}
.sec-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(255,215,0,.3),transparent)}
.rtl .sec-title::after{background:linear-gradient(270deg,rgba(255,215,0,.3),transparent)}

.mod-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px}
.mod-card{border-radius:22px;padding:20px 14px;text-align:center;cursor:pointer;transition:transform .15s,box-shadow .15s;animation:fadeUp .5s ease both;position:relative;overflow:hidden;border:1.5px solid rgba(255,215,0,.2)}
.mod-card:active{transform:scale(.95)}
.mod-card.locked{opacity:.6;cursor:not-allowed}
.mod-card.free{box-shadow:0 6px 24px var(--shadow,rgba(0,0,0,.3))}
.mod-emoji{font-size:42px;display:block;margin-bottom:10px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.3))}
.mod-name{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;margin-bottom:6px;line-height:1.2}
.mod-tag{display:inline-flex;align-items:center;gap:4px;border-radius:12px;padding:3px 10px;font-size:11px;font-weight:700}
.tag-free{background:rgba(255,255,255,.18);color:#fff}
.tag-lock{background:rgba(0,0,0,.3);color:#ce82ff}
.mod-progress{margin-top:10px}
.mod-bar{background:rgba(0,0,0,.25);border-radius:6px;height:6px;overflow:hidden;margin-top:4px}
.mod-fill{height:100%;background:rgba(255,255,255,.6);border-radius:6px;transition:width .6s ease}
.mod-lock-icon{position:absolute;top:10px;right:10px;font-size:16px}

.nav{display:flex;background:#0D1B3E;border-top:1px solid rgba(255,215,0,.2);padding:8px 0 6px;position:relative;z-index:10;flex-shrink:0;backdrop-filter:blur(10px)}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 4px;cursor:pointer;transition:all .2s;position:relative}
.nav-icon{font-size:24px;transition:transform .2s}
.nav-item.active .nav-icon{filter:drop-shadow(0 0 8px #FFD700);transform:scale(1.1)}
.nav-label{font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase}
.nav-item.active .nav-label{color:#FFD700}
.nav-item:not(.active) .nav-label{color:#4A5568}
.nav-item:not(.active) .nav-icon{opacity:.5}
.nav-dot{position:absolute;bottom:-6px;width:28px;height:3px;background:linear-gradient(90deg,#FFD700,#FFA500);border-radius:2px;box-shadow:0 0 10px rgba(255,215,0,.7)}

.quiz-screen{display:flex;flex-direction:column;height:100%;padding:16px;animation:fadeUp .4s ease;gap:14px;overflow:hidden}
.quiz-header{display:flex;align-items:center;gap:12px;flex-shrink:0}
.back-btn{width:42px;height:42px;border-radius:14px;background:#0D1B3E;border:1.5px solid rgba(255,215,0,.3);display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;flex-shrink:0;transition:all .2s;color:#FFD700}
.back-btn:active{background:rgba(255,215,0,.15);transform:scale(.92)}
.q-progress-wrap{flex:1;background:rgba(255,255,255,.08);border-radius:10px;height:12px;overflow:hidden}
.q-progress-fill{height:100%;background:linear-gradient(90deg,#FFD700,#00E5FF);border-radius:10px;transition:width .5s ease;box-shadow:0 0 12px rgba(255,215,0,.4)}
.hearts{display:flex;gap:5px}
.heart{font-size:20px;transition:all .4s}
.heart.lost{filter:grayscale(1);opacity:.25;transform:scale(.85)}
.feedback-bar{border-radius:16px;padding:14px;text-align:center;font-weight:800;font-size:17px;animation:popIn .3s ease;flex-shrink:0}
.fb-ok{background:linear-gradient(135deg,rgba(0,200,83,.25),rgba(0,200,83,.1));border:2px solid #00C853;color:#00C853}
.fb-ko{background:linear-gradient(135deg,rgba(255,23,68,.25),rgba(255,23,68,.1));border:2px solid #FF1744;color:#FF1744;animation:shake .4s ease}
.q-card{background:linear-gradient(135deg,#0D1B3E,#162040);border-radius:22px;padding:24px 20px;text-align:center;border:1.5px solid rgba(255,215,0,.25);box-shadow:0 8px 30px rgba(0,0,0,.4);flex-shrink:0}
.q-flag{font-size:64px;margin-bottom:12px;filter:drop-shadow(0 4px 12px rgba(0,0,0,.4))}
.q-text{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:#fff;line-height:1.4}
.q-meta{font-size:12px;color:#718096;margin-top:6px}
.answers{display:grid;grid-template-columns:1fr 1fr;gap:11px;flex:1}
.ans-btn{background:linear-gradient(135deg,#0D1B3E,#111a33);border:1.5px solid rgba(255,215,0,.2);border-radius:16px;padding:16px 12px;color:#fff;font-weight:600;font-size:13px;cursor:pointer;transition:all .18s;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Poppins',sans-serif;line-height:1.3}
.ans-btn:active{transform:scale(.95)}
.ans-btn.correct{background:linear-gradient(135deg,rgba(0,200,83,.3),rgba(0,200,83,.1));border-color:#00C853;color:#00C853;box-shadow:0 0 24px rgba(0,200,83,.4)}
.ans-btn.wrong{background:linear-gradient(135deg,rgba(255,23,68,.3),rgba(255,23,68,.1));border-color:#FF1744;color:#FF1744}

.result-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;gap:16px;animation:fadeUp .4s ease}
.res-circle{width:140px;height:140px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:70px;animation:popIn .5s ease;margin-bottom:8px;position:relative}
.res-glow{position:absolute;inset:-8px;border-radius:50%;z-index:-1;animation:pulse 2s infinite}
.res-title{font-family:'Playfair Display',serif;font-size:30px;font-weight:900;color:#FFD700;text-shadow:0 0 20px rgba(255,215,0,.4)}
.xp-pill{background:linear-gradient(135deg,#0D1B3E,#162040);border:2px solid #FFD700;border-radius:20px;padding:16px 32px;box-shadow:0 0 24px rgba(255,215,0,.25)}
.xp-lbl{font-size:10px;color:#718096;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px}
.xp-val{font-family:'Playfair Display',serif;font-size:38px;color:#FFD700;font-weight:900}
.res-actions{display:flex;gap:12px;width:100%}
.btn-primary{background:linear-gradient(135deg,#FFD700,#FFA500);color:#060B18;font-weight:800;font-size:15px;padding:16px;border-radius:16px;border:none;cursor:pointer;flex:1;font-family:'Poppins',sans-serif;box-shadow:0 6px 24px rgba(255,215,0,.4);letter-spacing:.5px}
.btn-primary:active{transform:scale(.97)}
.btn-secondary{background:rgba(13,27,62,.9);border:1.5px solid rgba(255,215,0,.3);color:#FFD700;font-weight:700;font-size:14px;padding:16px;border-radius:16px;cursor:pointer;flex:1;font-family:'Poppins',sans-serif}

.lb-screen{padding:16px;overflow-y:auto;height:100%}
.lb-top{text-align:center;padding:16px 0 20px}
.lb-trophy{font-size:60px;animation:breathe 3s ease-in-out infinite;filter:drop-shadow(0 0 20px rgba(255,215,0,.5));margin-bottom:10px}
.lb-league-name{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;background:linear-gradient(135deg,#FFD700,#00E5FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.lb-sub{font-size:13px;color:#718096;margin-top:4px}
.player-row{background:linear-gradient(135deg,#0D1B3E,#111a33);border-radius:16px;padding:14px 16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;border:1px solid rgba(255,215,0,.1);animation:slideIn .4s ease both;cursor:pointer;transition:all .2s}
.player-row:active{transform:scale(.98)}
.player-row.me{border-color:#FFD700;box-shadow:0 0 20px rgba(255,215,0,.2),0 0 0 1px rgba(255,215,0,.3);background:linear-gradient(135deg,#1a1a00,#1a1400)}
.rank-num{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;width:30px;text-align:center;flex-shrink:0}
.rank-g{color:#FFD700;text-shadow:0 0 12px rgba(255,215,0,.6)}
.rank-s{color:#C0C0C0}.rank-b{color:#CD7F32}.rank-n{color:#4A5568}
.p-avatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid rgba(255,215,0,.25);flex-shrink:0}
.p-info{flex:1}.p-name{font-weight:700;font-size:15px}.p-name.me{color:#FFD700}
.p-league{font-size:11px;color:#718096;margin-top:2px}
.p-xp{font-weight:800;font-size:15px;color:#00E5FF}

.quest-screen{padding:16px;overflow-y:auto;height:100%}
.quest-header{text-align:center;padding:20px 0;margin-bottom:8px}
.quest-icon{font-size:56px;animation:breathe 3s ease-in-out infinite;filter:drop-shadow(0 0 16px rgba(255,215,0,.4))}
.quest-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#FFD700;margin-top:10px}
.quest-card{background:linear-gradient(135deg,#0D1B3E,#111a33);border-radius:18px;padding:16px 18px;margin-bottom:12px;display:flex;align-items:center;gap:14px;border:1.5px solid rgba(255,215,0,.15);transition:all .2s;animation:fadeUp .4s ease both;cursor:pointer}
.quest-card.done{border-color:#00C853;background:linear-gradient(135deg,#0a2010,#0d2815)}
.quest-card:active{transform:scale(.98)}
.quest-qicon{font-size:28px;width:44px;text-align:center;flex-shrink:0}
.quest-body{flex:1}.quest-name{font-weight:700;font-size:15px}
.quest-reward{color:#FFD700;font-size:12px;margin-top:3px}
.quest-check{font-size:24px;flex-shrink:0}

.shop-screen{padding:16px;overflow-y:auto;height:100%}
.prem-card{background:linear-gradient(135deg,#160A30,#2D1B69);border-radius:22px;padding:22px 20px;text-align:center;border:2px solid rgba(206,130,255,.4);box-shadow:0 0 40px rgba(206,130,255,.15);margin-bottom:20px;animation:fadeUp .5s ease}
.prem-icon{font-size:50px;animation:breathe 3s ease-in-out infinite;filter:drop-shadow(0 0 16px rgba(206,130,255,.5));margin-bottom:10px}
.prem-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;background:linear-gradient(135deg,#CE82FF,#FFD700);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:6px}
.prem-desc{font-size:13px;color:#A0AEC0;margin-bottom:6px}
.prem-price{font-size:12px;color:#718096;margin-bottom:16px}
.prem-active{background:linear-gradient(135deg,#0a2010,#0d3020);border-radius:22px;padding:20px;text-align:center;border:2px solid #00C853;box-shadow:0 0 24px rgba(0,200,83,.2);margin-bottom:20px}
.shop-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.shop-card{background:linear-gradient(135deg,#0D1B3E,#111a33);border-radius:18px;padding:18px 12px;text-align:center;border:1.5px solid rgba(255,215,0,.15);cursor:pointer;transition:all .2s;animation:fadeUp .4s ease both}
.shop-card:active{transform:scale(.95);border-color:#FFD700}
.sc-icon{font-size:38px;display:block;margin-bottom:8px}
.sc-name{font-weight:700;font-size:13px;margin-bottom:4px}
.sc-desc{font-size:11px;color:#718096;margin-bottom:10px}
.sc-price{display:inline-flex;align-items:center;gap:5px;background:rgba(255,215,0,.15);border:1px solid rgba(255,215,0,.3);color:#FFD700;font-weight:700;font-size:12px;padding:5px 12px;border-radius:20px}
.gem-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
.gem-card{background:linear-gradient(135deg,#0D1B3E,#111a33);border-radius:16px;padding:16px 8px;text-align:center;border:1.5px solid rgba(0,229,255,.25);cursor:pointer;transition:all .2s}
.gem-card:active{transform:scale(.95);border-color:#00E5FF}
.gem-amt{font-weight:800;font-size:15px;color:#00E5FF}
.gem-price{font-size:11px;color:#718096;margin-top:4px}

.modal-overlay{position:fixed;inset:0;background:rgba(6,11,24,.92);z-index:400;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeUp .3s ease}
.modal-box{background:linear-gradient(135deg,#0D1B3E,#162040);border-radius:26px;padding:30px 24px;text-align:center;max-width:340px;width:100%;animation:popIn .4s cubic-bezier(.175,.885,.32,1.275)}
.modal-icon{font-size:64px;margin-bottom:14px;display:block}
.modal-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;margin-bottom:8px}
.modal-desc{font-size:14px;color:#A0AEC0;margin-bottom:20px;line-height:1.6}
.ad-progress{background:rgba(255,150,0,.15);border-radius:10px;height:10px;margin-bottom:20px;overflow:hidden}
.ad-fill{height:100%;background:linear-gradient(90deg,#FF9600,#FFD700);border-radius:10px;transition:width .08s linear}
.btn-gold{background:linear-gradient(135deg,#FFD700,#FFA500);color:#060B18;font-weight:800;font-size:16px;padding:16px;border-radius:16px;border:none;cursor:pointer;width:100%;font-family:'Poppins',sans-serif;box-shadow:0 6px 24px rgba(255,215,0,.4);margin-bottom:10px;letter-spacing:.5px;animation:adPulse 2s infinite}
.btn-gold:active{transform:scale(.97)}
.btn-ghost{background:transparent;border:1.5px solid rgba(255,255,255,.12);color:#718096;font-size:13px;padding:12px;border-radius:14px;cursor:pointer;width:100%;font-family:'Poppins',sans-serif}
.btn-ghost:active{opacity:.7}
.btn-purple{background:linear-gradient(135deg,#8549ba,#ce82ff);color:#fff;font-weight:800;font-size:15px;padding:16px;border-radius:16px;border:none;cursor:pointer;width:100%;font-family:'Poppins',sans-serif;box-shadow:0 6px 24px rgba(206,130,255,.35);letter-spacing:.5px}
.btn-purple:active{transform:scale(.97)}

.toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#0D1B3E,#162040);border:2px solid #FFD700;color:#FFD700;padding:13px 28px;border-radius:30px;font-weight:700;font-size:14px;z-index:500;box-shadow:0 0 30px rgba(255,215,0,.4);animation:popIn .3s ease;white-space:nowrap;letter-spacing:.5px}
.confetti-piece{position:fixed;pointer-events:none;z-index:600;border-radius:50%;animation:confetti 2.5s ease-in forwards}

.rtl{direction:rtl}
.rtl .stats-row,.rtl .h-left,.rtl .sc-inner,.rtl .player-row,.rtl .quest-card{flex-direction:row-reverse}
.ar{font-family:'Cairo',sans-serif!important}

/* GUIDE */
.guide-screen{padding:16px;overflow-y:auto;height:100%}
.guide-hero{background:linear-gradient(135deg,#0a0a1a,#0f1225);border-radius:22px;padding:24px 20px;margin-bottom:16px;border:1.5px solid rgba(255,150,0,.3);text-align:center}
.guide-icon{font-size:52px;margin-bottom:10px}
.guide-hero-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:#FF9600;margin-bottom:6px}
.guide-hero-sub{font-size:12px;color:#718096;line-height:1.6}
.guide-tabs{display:flex;gap:8px;margin-bottom:16px}
.guide-tab{flex:1;padding:10px;border-radius:14px;border:1.5px solid rgba(255,215,0,.15);background:#0D1B3E;color:#718096;font-size:12px;font-weight:700;cursor:pointer;text-align:center;transition:all .2s;font-family:'Poppins',sans-serif}
.guide-tab.active{border-color:#FFD700;color:#FFD700;background:rgba(255,215,0,.08)}
.guide-step{background:linear-gradient(135deg,#0D1B3E,#111a33);border-radius:18px;padding:18px;margin-bottom:12px;border:1.5px solid rgba(255,215,0,.1);animation:fadeUp .4s ease both}
.guide-step-num{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#FFD700,#FFA500);color:#060B18;font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;flex-shrink:0}
.guide-step-title{font-weight:700;font-size:14px;color:#FFD700;margin-bottom:6px}
.guide-step-body{font-size:12px;color:#A0AEC0;line-height:1.7}
.guide-code{background:rgba(0,0,0,.4);border-radius:10px;padding:10px 12px;font-size:11px;color:#00E5FF;font-family:monospace;margin-top:8px;overflow-x:auto;border:1px solid rgba(0,229,255,.15);line-height:1.6;white-space:pre-wrap;word-break:break-all}
.guide-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,150,0,.1);border:1px solid rgba(255,150,0,.3);border-radius:20px;padding:4px 12px;font-size:11px;color:#FF9600;font-weight:700;margin:4px 4px 4px 0}
.guide-warn{background:rgba(255,23,68,.08);border:1px solid rgba(255,23,68,.2);border-radius:12px;padding:12px;font-size:11px;color:#FF6B6B;margin-top:8px;line-height:1.6}
.guide-tip{background:rgba(0,200,83,.08);border:1px solid rgba(0,200,83,.2);border-radius:12px;padding:12px;font-size:11px;color:#69F0AE;margin-top:8px;line-height:1.6}
`;

// ============================================================
// STORAGE HELPERS
// ============================================================
const SV = "aq_v1";
const LIVES_MAX = 5;
const LIVES_REFILL_MS = 30 * 60 * 1000;

function load<T>(key: string, fb: T): T {
  try { const r = localStorage.getItem(`${SV}_${key}`); return r === null ? fb : JSON.parse(r) as T; }
  catch { return fb; }
}
function save(key: string, val: unknown) {
  try { localStorage.setItem(`${SV}_${key}`, JSON.stringify(val)); } catch {}
}

type ModProgress = Record<string, { lessons: number; progress: number }>;

function todayStr() { return new Date().toISOString().split("T")[0]; }

// ============================================================
// DATA
// ============================================================
const T: Record<string, any> = {
  fr:{dir:"ltr",flag:"🇫🇷",fontClass:"",greeting:"Bonjour, Explorateur 🦁",streak:"jours de série 🔥",league:"Ligue Argent",tabs:{home:"Apprendre",league:"Ligues",quests:"Quêtes",shop:"Boutique",guide:"Guide"},noLives:"Plus de vies ! Regarde une pub ou attends.",watchAd:"📺 Regarder une pub (+1 ❤️)",adWatched:"❤️ +1 vie offerte !",streakLostTitle:"Série perdue 💔",streakLostDesc:"Tu n'as pas joué hier. Ta série repart de zéro.",streakLostBtn:"Recommencer 🔥",leagueTitle:"Ligue Argent",leagueSub:"Top 3 → Montez en Ligue Or 🏆",ranking:"Classement",quests:"Défis du Jour",questItems:[{icon:"🗺️",name:"Terminer 3 leçons",reward:"50 💎",done:true},{icon:"🔥",name:"Maintenir ton streak",reward:"30 💎",done:true},{icon:"⚔️",name:"Gagner 1 bataille vs IA",reward:"80 💎",done:false},{icon:"🏆",name:"Finir top 5 du classement",reward:"150 💎",done:false}],premiumTitle:"AtlasQuest Premium",premiumDesc:"Sans pub · Vies illimitées · Contenu exclusif",premiumPrice:"1,99€ le 1er trimestre · puis 4,99€/3 mois",premiumBtn:"Activer Premium →",premiumActive:"Premium Actif ✅",premiumActiveSub:"Sans pub · Vies illimitées",shopItems:[{icon:"❤️",name:"Vie supplémentaire",desc:"Rejoue sans attendre",price:"100 💎"},{icon:"⚡",name:"Boost XP ×2",desc:"Double XP pendant 1h",price:"150 💎"},{icon:"🛡️",name:"Bouclier erreur",desc:"Protège 1 mauvaise réponse",price:"80 💎"},{icon:"👑",name:"Tenue Royale",desc:"Leo porte une armure dorée",price:"500 💎"}],gemPkgs:[{amt:"100 💎",price:"0,99€"},{amt:"500 💎",price:"3,99€"},{amt:"1 200 💎",price:"7,99€"}],shopTitle:"Articles",gemsTitle:"Pack Gemmes 💎",correct:"Brillant ! +20 XP 🎉",wrong:"Mauvaise réponse !",question:"Question",of:"sur",correctAns:"bonnes réponses",xpGained:"XP GAGNÉS",playAgain:"Rejouer 🔄",home:"Accueil",lessons:"leçons",modules:[{id:"eu",name:"Europe",emoji:"🏰",bg:"linear-gradient(135deg,#1A1A6E,#4B0082)",shadow:"rgba(75,0,130,.5)",free:true,total:12,tag:"GRATUIT"},{id:"af",name:"Afrique",emoji:"🦁",bg:"linear-gradient(135deg,#8B1A00,#FF6B00)",shadow:"rgba(255,107,0,.4)",free:true,total:12,tag:"GRATUIT"},{id:"as",name:"Asie",emoji:"🏯",bg:"linear-gradient(135deg,#004D40,#00796B)",shadow:"rgba(0,121,107,.35)",free:false,total:12,tag:"PREMIUM"},{id:"am",name:"Amériques",emoji:"🗽",bg:"linear-gradient(135deg,#1A237E,#283593)",shadow:"rgba(40,53,147,.4)",free:false,total:12,tag:"PREMIUM"},{id:"oc",name:"Océanie",emoji:"🦘",bg:"linear-gradient(135deg,#006064,#0097A7)",shadow:"rgba(0,151,167,.4)",free:false,total:12,tag:"PREMIUM"},{id:"po",name:"Pôles",emoji:"🧊",bg:"linear-gradient(135deg,#263238,#546E7A)",shadow:"rgba(84,110,122,.4)",free:false,total:12,tag:"PREMIUM"}],questions:[{flag:"🇫🇷",q:"Capitale de la France ?",a:["Paris","Lyon","Marseille","Bordeaux"],c:0},{flag:"🇩🇪",q:"Capitale de l'Allemagne ?",a:["Munich","Berlin","Hambourg","Cologne"],c:1},{flag:"🇮🇹",q:"Capitale de l'Italie ?",a:["Milan","Naples","Rome","Turin"],c:2},{flag:"🇪🇸",q:"Capitale de l'Espagne ?",a:["Barcelone","Séville","Valence","Madrid"],c:3},{flag:"🇧🇪",q:"Capitale de la Belgique ?",a:["Bruxelles","Anvers","Gand","Liège"],c:0}]},
  en:{dir:"ltr",flag:"🇬🇧",fontClass:"",greeting:"Hello, Explorer 🦁",streak:"Day Streak 🔥",league:"Silver League",tabs:{home:"Learn",league:"Leagues",quests:"Quests",shop:"Shop",guide:"Guide"},noLives:"No lives left! Watch an ad or wait.",watchAd:"📺 Watch an ad (+1 ❤️)",adWatched:"❤️ +1 life rewarded!",streakLostTitle:"Streak Lost 💔",streakLostDesc:"You didn't play yesterday. Your streak resets to zero.",streakLostBtn:"Start Again 🔥",leagueTitle:"Silver League",leagueSub:"Top 3 → Promote to Gold League 🏆",ranking:"Ranking",quests:"Daily Challenges",questItems:[{icon:"🗺️",name:"Complete 3 lessons",reward:"50 💎",done:true},{icon:"🔥",name:"Keep your streak",reward:"30 💎",done:true},{icon:"⚔️",name:"Win 1 battle vs AI",reward:"80 💎",done:false},{icon:"🏆",name:"Finish top 5 in ranking",reward:"150 💎",done:false}],premiumTitle:"AtlasQuest Premium",premiumDesc:"Ad-free · Unlimited lives · Exclusive content",premiumPrice:"€1.99 first quarter · then €4.99/3 months",premiumBtn:"Activate Premium →",premiumActive:"Premium Active ✅",premiumActiveSub:"Ad-free · Unlimited lives",shopItems:[{icon:"❤️",name:"Extra Life",desc:"Play again immediately",price:"100 💎"},{icon:"⚡",name:"XP Boost ×2",desc:"Double XP for 1 hour",price:"150 💎"},{icon:"🛡️",name:"Error Shield",desc:"Protect 1 wrong answer",price:"80 💎"},{icon:"👑",name:"Royal Outfit",desc:"Leo wears golden armor",price:"500 💎"}],gemPkgs:[{amt:"100 💎",price:"€0.99"},{amt:"500 💎",price:"€3.99"},{amt:"1,200 💎",price:"€7.99"}],shopTitle:"Items",gemsTitle:"Gem Packs 💎",correct:"Brilliant! +20 XP 🎉",wrong:"Wrong answer!",question:"Question",of:"of",correctAns:"correct answers",xpGained:"XP EARNED",playAgain:"Play Again 🔄",home:"Home",lessons:"lessons",modules:[{id:"eu",name:"Europe",emoji:"🏰",bg:"linear-gradient(135deg,#1A1A6E,#4B0082)",shadow:"rgba(75,0,130,.5)",free:true,total:12,tag:"FREE"},{id:"af",name:"Africa",emoji:"🦁",bg:"linear-gradient(135deg,#8B1A00,#FF6B00)",shadow:"rgba(255,107,0,.4)",free:true,total:12,tag:"FREE"},{id:"as",name:"Asia",emoji:"🏯",bg:"linear-gradient(135deg,#004D40,#00796B)",shadow:"rgba(0,121,107,.35)",free:false,total:12,tag:"PREMIUM"},{id:"am",name:"Americas",emoji:"🗽",bg:"linear-gradient(135deg,#1A237E,#283593)",shadow:"rgba(40,53,147,.4)",free:false,total:12,tag:"PREMIUM"},{id:"oc",name:"Oceania",emoji:"🦘",bg:"linear-gradient(135deg,#006064,#0097A7)",shadow:"rgba(0,151,167,.4)",free:false,total:12,tag:"PREMIUM"},{id:"po",name:"Poles",emoji:"🧊",bg:"linear-gradient(135deg,#263238,#546E7A)",shadow:"rgba(84,110,122,.4)",free:false,total:12,tag:"PREMIUM"}],questions:[{flag:"🇫🇷",q:"Capital of France?",a:["Paris","Lyon","Marseille","Bordeaux"],c:0},{flag:"🇩🇪",q:"Capital of Germany?",a:["Munich","Berlin","Hamburg","Cologne"],c:1},{flag:"🇮🇹",q:"Capital of Italy?",a:["Milan","Naples","Rome","Turin"],c:2},{flag:"🇪🇸",q:"Capital of Spain?",a:["Barcelona","Seville","Valencia","Madrid"],c:3},{flag:"🇧🇪",q:"Capital of Belgium?",a:["Brussels","Antwerp","Ghent","Liège"],c:0}]},
  ar:{dir:"rtl",flag:"🇸🇦",fontClass:"ar",greeting:"مرحباً أيها المستكشف 🦁",streak:"أيام متتالية 🔥",league:"دوري الفضة",tabs:{home:"تعلّم",league:"الدوريات",quests:"المهام",shop:"المتجر",guide:"دليل"},noLives:"لا حياة متبقية! شاهد إعلاناً أو انتظر.",watchAd:"📺 شاهد إعلاناً (+1 ❤️)",adWatched:"❤️ تمت إضافة حياة!",streakLostTitle:"انقطعت السلسلة 💔",streakLostDesc:"لم تلعب أمس. ستبدأ سلسلتك من الصفر.",streakLostBtn:"ابدأ من جديد 🔥",leagueTitle:"دوري الفضة",leagueSub:"أفضل 3 ← الترقية لدوري الذهب 🏆",ranking:"الترتيب",quests:"تحديات اليوم",questItems:[{icon:"🗺️",name:"أكمل 3 دروس",reward:"50 💎",done:true},{icon:"🔥",name:"حافظ على سلسلتك",reward:"30 💎",done:true},{icon:"⚔️",name:"اربح معركة ضد الذكاء الاصطناعي",reward:"80 💎",done:false},{icon:"🏆",name:"احتل أفضل 5 في الترتيب",reward:"150 💎",done:false}],premiumTitle:"أطلس كويست بريميوم",premiumDesc:"بدون إعلانات · حياة غير محدودة · محتوى حصري",premiumPrice:"€1.99 الربع الأول · ثم €4.99 / 3 أشهر",premiumBtn:"تفعيل المميز ←",premiumActive:"المميز مفعّل ✅",premiumActiveSub:"بدون إعلانات · حياة غير محدودة",shopItems:[{icon:"❤️",name:"حياة إضافية",desc:"العب مجدداً فوراً",price:"100 💎"},{icon:"⚡",name:"مضاعف النقاط ×2",desc:"نقاط مضاعفة لمدة ساعة",price:"150 💎"},{icon:"🛡️",name:"درع الخطأ",desc:"يحمي من إجابة خاطئة",price:"80 💎"},{icon:"👑",name:"الزي الملكي",desc:"ليو يرتدي درعاً ذهبياً",price:"500 💎"}],gemPkgs:[{amt:"100 💎",price:"€0.99"},{amt:"500 💎",price:"€3.99"},{amt:"1,200 💎",price:"€7.99"}],shopTitle:"المقالات",gemsTitle:"حزم الجواهر 💎",correct:"رائع! +20 XP 🎉",wrong:"إجابة خاطئة!",question:"سؤال",of:"من",correctAns:"إجابات صحيحة",xpGained:"نقاط مكتسبة",playAgain:"🔄 العب مجدداً",home:"الرئيسية",lessons:"دروس",modules:[{id:"eu",name:"أوروبا",emoji:"🏰",bg:"linear-gradient(135deg,#1A1A6E,#4B0082)",shadow:"rgba(75,0,130,.5)",free:true,total:12,tag:"مجاني"},{id:"af",name:"إفريقيا",emoji:"🦁",bg:"linear-gradient(135deg,#8B1A00,#FF6B00)",shadow:"rgba(255,107,0,.4)",free:true,total:12,tag:"مجاني"},{id:"as",name:"آسيا",emoji:"🏯",bg:"linear-gradient(135deg,#004D40,#00796B)",shadow:"rgba(0,121,107,.35)",free:false,total:12,tag:"مميز"},{id:"am",name:"أمريكا",emoji:"🗽",bg:"linear-gradient(135deg,#1A237E,#283593)",shadow:"rgba(40,53,147,.4)",free:false,total:12,tag:"مميز"},{id:"oc",name:"أوقيانوسيا",emoji:"🦘",bg:"linear-gradient(135deg,#006064,#0097A7)",shadow:"rgba(0,151,167,.4)",free:false,total:12,tag:"مميز"},{id:"po",name:"القطبان",emoji:"🧊",bg:"linear-gradient(135deg,#263238,#546E7A)",shadow:"rgba(84,110,122,.4)",free:false,total:12,tag:"مميز"}],questions:[{flag:"🇸🇦",q:"عاصمة السعودية؟",a:["الرياض","جدة","مكة","المدينة"],c:0},{flag:"🇲🇦",q:"عاصمة المغرب؟",a:["الدار البيضاء","الرباط","مراكش","فاس"],c:1},{flag:"🇪🇬",q:"عاصمة مصر؟",a:["القاهرة","الإسكندرية","الجيزة","أسوان"],c:0},{flag:"🇹🇳",q:"عاصمة تونس؟",a:["صفاقس","تونس","سوسة","بنزرت"],c:1},{flag:"🇩🇿",q:"عاصمة الجزائر؟",a:["وهران","قسنطينة","الجزائر","عنابة"],c:2}]},
};

const LEADERS = [
  {rank:1,name:"Sophie M.",flag:"🇫🇷",xp:15420,bg:"#1A1A6E",league:"Champion"},
  {rank:2,name:"James K.",flag:"🇬🇧",xp:14890,bg:"#4B0082",league:"Diamant"},
  {rank:3,name:"Ahmed R.",flag:"🇸🇦",xp:13750,bg:"#8B1A00",league:"Diamant"},
  {rank:4,name:"Klaus B.",flag:"🇩🇪",xp:12300,bg:"#1A237E",league:"Or"},
  {rank:5,name:"Ana P.",flag:"🇧🇷",xp:11800,bg:"#004D40",league:"Or"},
  {rank:6,name:"Yuki T.",flag:"🇯🇵",xp:10950,bg:"#1A1A00",league:"Or"},
  {rank:7,name:"Fatima Z.",flag:"🇲🇦",xp:9870,bg:"#0D2B1A",league:"Argent"},
  {rank:8,name:"Mike D.",flag:"🇺🇸",xp:8900,bg:"#1A0A00",league:"Argent"},
  {rank:9,name:"Carlos M.",flag:"🇪🇸",xp:7650,bg:"#0A001A",league:"Bronze"},
  {rank:10,name:"Giulia R.",flag:"🇮🇹",xp:6540,bg:"#001A0A",league:"Bronze"},
  {rank:47,name:"Toi 🦁",flag:"👤",xp:240,bg:"#0a0a1a",league:"Bronze",isMe:true},
];

// ============================================================
// GUIDE SCREEN
// ============================================================
const ADMOB_STEPS = [
  {num:1,title:"Create a Google AdMob Account",body:"Go to admob.google.com → sign in → create a new app. You'll get an App ID.",code:"App ID example:\nca-app-pub-3940256099942544~1458002511",badges:["admob.google.com"],tip:"💡 Use test IDs during development to avoid policy violations."},
  {num:2,title:"Wrap with Capacitor",body:"AdMob requires a native wrapper. Use Capacitor to package your React web app as Android / iOS.",code:"npm install @capacitor/core @capacitor/cli\nnpx cap init AtlasQuest com.atlasquest.app\nnpm install @capacitor/android @capacitor/ios\nnpx cap add android\nnpx cap add ios",badges:["capacitorjs.com"]},
  {num:3,title:"Install the AdMob plugin",body:"The community plugin bridges the native AdMob SDK into JavaScript.",code:"npm install @capacitor-community/admob\nnpx cap sync",badges:["@capacitor-community/admob"]},
  {num:4,title:"Configure native projects",body:"Add your App ID to Android and iOS config files.",code:"// AndroidManifest.xml\n<meta-data\n  android:name=\"com.google.android.gms.ads.APPLICATION_ID\"\n  android:value=\"ca-app-pub-XXXXXXXX~XXXXXXXX\"/>\n\n// ios/App/App/Info.plist\n<key>GADApplicationIdentifier</key>\n<string>ca-app-pub-XXXXXXXX~XXXXXXXX</string>",warn:"⚠️ Never commit your real App ID to a public repo."},
  {num:5,title:"Initialize & show Rewarded Ad",body:"Initialize once on startup. Only grant lives inside the rewardReceived callback.",code:"import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';\n\nawait AdMob.initialize({ initializeForTesting: true });\n\nawait AdMob.prepareRewardVideoAd({\n  adId: 'ca-app-pub-3940256099942544/5224354917',\n  isTesting: true,\n});\nAdMob.addListener(RewardAdPluginEvents.Rewarded, () => {\n  grantLife(); // ← only here\n});\nawait AdMob.showRewardVideoAd();",tip:"💡 Preload the ad before the user clicks 'watch' for instant playback."},
  {num:6,title:"Show Banner Ad",body:"Renders natively below your webview. Hide it for Premium users.",code:"await AdMob.showBanner({\n  adId: 'ca-app-pub-3940256099942544/6300978111',\n  adSize: AdSize.BANNER,\n  position: AdPosition.BOTTOM_CENTER,\n  isTesting: true,\n});\n// For Premium users:\nawait AdMob.hideBanner();"},
  {num:7,title:"Go-live checklist",body:"Before submitting to Google Play:",code:"✅ Replace all test Ad Unit IDs with production IDs\n✅ Set isTesting: false in AdMob.initialize()\n✅ Add your app in the AdMob dashboard\n✅ Complete the AdMob payment profile\n✅ Implement GDPR consent (UMP SDK) for Europe\n✅ Test on a real device before submission",warn:"⚠️ Never click your own ads — Google bans accounts for invalid traffic."},
];

const APK_STEPS = [
  {num:1,title:"Install prerequisites",body:"Install Node.js 18+, Java 17 (JDK), Android Studio, and Android SDK (API 34).",code:"# Verify installations:\nnode -v        # should be 18+\njava -version  # should be 17+\nnpx cap --version",badges:["nodejs.org","developer.android.com/studio"],tip:"💡 Set JAVA_HOME and ANDROID_HOME in your system environment variables."},
  {num:2,title:"Build your React app",body:"Create the production web bundle first. Capacitor copies it into the Android project.",code:"npm run build\n# Creates dist/ folder with your app"},
  {num:3,title:"Sync with Capacitor",body:"Copy the web build into the native Android project and update plugins.",code:"npx cap sync android"},
  {num:4,title:"Open in Android Studio",body:"Launch Android Studio with the Android project to build and sign your APK.",code:"npx cap open android\n# Opens Android Studio automatically"},
  {num:5,title:"Generate a Keystore (once)",body:"You must sign your APK with a keystore. Store it safely — you need the same key for every future update.",code:"keytool -genkey -v \\\n  -keystore atlasquest.keystore \\\n  -alias atlasquest \\\n  -keyalg RSA -keysize 2048 \\\n  -validity 10000\n\n# Prompted for password + your name/org",warn:"⚠️ Never lose this keystore file. Google requires the same key for all updates."},
  {num:6,title:"Build a signed APK / AAB",body:"In Android Studio: Build → Generate Signed Bundle / APK → Android App Bundle (preferred by Play Store).",code:"# Or from CLI:\ncd android\n./gradlew bundleRelease\n# Output: app/build/outputs/bundle/release/app-release.aab\n\n# To sign:\njarsigner -verbose -sigalg SHA256withRSA \\\n  -keystore atlasquest.keystore \\\n  app-release.aab atlasquest",tip:"💡 AAB (.aab) is preferred over APK for Play Store — smaller downloads, better optimization."},
  {num:7,title:"Create a Play Console account",body:"Go to play.google.com/console → pay the one-time $25 fee → create a new app.",badges:["play.google.com/console"],code:"Required before uploading:\n✅ App title and description\n✅ Screenshots (phone + 7\" tablet)\n✅ Feature graphic (1024×500px)\n✅ App icon (512×512px)\n✅ Privacy Policy URL\n✅ Content rating questionnaire"},
  {num:8,title:"Upload and publish",body:"In Play Console: Production → Create new release → Upload your .aab → Review → Rollout.",code:"Release tracks:\n→ Internal testing  (up to 100 testers, instant)\n→ Closed testing    (invite only)\n→ Open testing      (anyone can join)\n→ Production        (full public release)\n\nReview time: typically 1–3 days for new apps",tip:"💡 Start with Internal Testing to catch issues before going to Production."},
  {num:9,title:"GitHub — save your project",body:"Push your source code to GitHub for version control, collaboration, and CI/CD.",code:"# 1. Create a repo at github.com (click + → New repository)\n# 2. In your project folder:\ngit init\ngit add .\ngit commit -m \"Initial commit: AtlasQuest\"\ngit remote add origin https://github.com/YOUR_USER/atlasquest.git\ngit push -u origin main\n\n# Add a .gitignore:\necho 'node_modules/\\ndist/\\nandroid/\\nios/\\n*.keystore' > .gitignore",badges:["github.com"],warn:"⚠️ Add *.keystore to .gitignore — never push your signing keystore to GitHub."},
];

function GuideScreen() {
  const [guideTab, setGuideTab] = useState<"admob"|"apk">("apk");
  const steps = guideTab === "admob" ? ADMOB_STEPS : APK_STEPS;
  return (
    <div className="content">
      <div className="guide-screen">
        <div className="guide-hero">
          <div className="guide-icon">{guideTab==="admob"?"📺":"🤖"}</div>
          <div className="guide-hero-title">{guideTab==="admob"?"Google AdMob Integration":"APK → Play Store + GitHub"}</div>
          <div className="guide-hero-sub">{guideTab==="admob"?"Replace simulated ads with real AdMob rewarded & banner ads using Capacitor.":"Complete guide: build a signed APK, publish to Google Play, and save your code on GitHub."}</div>
        </div>
        <div className="guide-tabs">
          <button className={`guide-tab ${guideTab==="apk"?"active":""}`} onClick={()=>setGuideTab("apk")}>🤖 APK + Play Store</button>
          <button className={`guide-tab ${guideTab==="admob"?"active":""}`} onClick={()=>setGuideTab("admob")}>📺 AdMob Ads</button>
        </div>
        {steps.map((s,i)=>(
          <div key={i} className="guide-step" style={{animationDelay:`${i*.05}s`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div className="guide-step-num">{s.num}</div>
              <div className="guide-step-title">{s.title}</div>
            </div>
            <div className="guide-step-body">{s.body}</div>
            {(s as any).badges && <div style={{marginTop:8}}>{(s as any).badges.map((b:string,j:number)=><span key={j} className="guide-badge">🔗 {b}</span>)}</div>}
            {s.code && <pre className="guide-code">{s.code}</pre>}
            {(s as any).warn && <div className="guide-warn">{(s as any).warn}</div>}
            {(s as any).tip && <div className="guide-tip">{(s as any).tip}</div>}
          </div>
        ))}
        <div style={{height:24}}/>
      </div>
    </div>
  );
}

// ============================================================
// CONFETTI
// ============================================================
function Confetti() {
  const colors = ["#FFD700","#FF9600","#00E5FF","#ce82ff","#FF1744","#00C853"];
  return <>{Array.from({length:28}).map((_,i)=>(
    <div key={i} className="confetti-piece" style={{left:`${Math.random()*100}%`,top:"-20px",width:`${5+Math.random()*7}px`,height:`${5+Math.random()*7}px`,background:colors[Math.floor(Math.random()*colors.length)],borderRadius:Math.random()>.5?"50%":"3px",animationDuration:`${1.5+Math.random()*2}s`,animationDelay:`${Math.random()*.5}s`}}/>
  ))}</>;
}

// ============================================================
// MODALS
// ============================================================
function RewardedModal({t,onReward,onClose}:{t:any,onReward:()=>void,onClose:()=>void}) {
  const [prog,setProg]=useState(0);const [watching,setWatching]=useState(false);
  const isAr=t.dir==="rtl";
  const start=()=>{setWatching(true);let p=0;const iv=setInterval(()=>{p+=3.5;setProg(Math.min(p,100));if(p>=100){clearInterval(iv);setTimeout(onReward,300);}},100);};
  return (
    <div className="modal-overlay">
      <div className={`modal-box ${isAr?"rtl":""}`} style={{border:"2px solid #FF9600",boxShadow:"0 0 50px rgba(255,150,0,.3)"}}>
        <span className="modal-icon">📺</span>
        <div className={`modal-title ${isAr?t.fontClass:""}`} style={{color:"#FF9600"}}>{watching?"Ad playing...":t.watchAd}</div>
        <div className={`modal-desc ${isAr?t.fontClass:""}`}>Watch this short ad for a free life!</div>
        {watching&&<div className="ad-progress"><div className="ad-fill" style={{width:`${prog}%`}}/></div>}
        {!watching&&<><button className="btn-gold" onClick={start}>▶ Watch (+1 ❤️)</button><button className="btn-ghost" onClick={onClose}>No thanks</button></>}
        <div style={{fontSize:10,color:"#4A5568",marginTop:10}}>Powered by Google AdMob</div>
      </div>
    </div>
  );
}

function NoLivesModal({t,onWatch,onClose,nextLifeIn}:{t:any,onWatch:()=>void,onClose:()=>void,nextLifeIn:string}) {
  const isAr=t.dir==="rtl";
  return (
    <div className="modal-overlay">
      <div className={`modal-box ${isAr?"rtl":""}`} style={{border:"2px solid #FF1744",boxShadow:"0 0 50px rgba(255,23,68,.3)"}}>
        <span className="modal-icon">💔</span>
        <div className={`modal-title ${isAr?t.fontClass:""}`} style={{color:"#FF1744"}}>No lives left!</div>
        <div className={`modal-desc ${isAr?t.fontClass:""}`}>{t.noLives}</div>
        {nextLifeIn&&<div style={{fontSize:12,color:"#718096",marginBottom:16}}>⏱ Next life in {nextLifeIn}</div>}
        <button className="btn-gold" onClick={onWatch}>{t.watchAd}</button>
        <button className="btn-ghost" onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

function StreakLostModal({t,onClose}:{t:any,onClose:()=>void}) {
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{border:"2px solid #FF9600",boxShadow:"0 0 50px rgba(255,150,0,.3)"}}>
        <span className="modal-icon">😢</span>
        <div className="modal-title" style={{color:"#FF9600"}}>{t.streakLostTitle}</div>
        <div className="modal-desc">{t.streakLostDesc}</div>
        <button className="btn-gold" onClick={onClose}>{t.streakLostBtn}</button>
      </div>
    </div>
  );
}

// ============================================================
// QUIZ
// ============================================================
function QuizScreen({t,mod,lives,setLives,setShowNoLives,onBack,onDone}:{t:any,mod:any,lives:number,setLives:(fn:(l:number)=>number)=>void,setShowNoLives:(v:boolean)=>void,onBack:()=>void,onDone:(score:number,total:number)=>void}) {
  const [cur,setCur]=useState(0);const [sel,setSel]=useState<number|null>(null);const [score,setScore]=useState(0);const [fb,setFb]=useState<string|null>(null);const [done,setDone]=useState(false);const [confetti,setConfetti]=useState(false);
  const isAr=t.dir==="rtl";const q=t.questions[cur];
  const handle=(i:number)=>{
    if(sel!==null)return;if(lives<=0){setShowNoLives(true);return;}
    setSel(i);const ok=i===q.c;setFb(ok?"ok":"ko");
    if(ok)setScore(s=>s+1);else setLives((l:number)=>Math.max(0,l-1));
    setTimeout(()=>{
      setFb(null);setSel(null);
      if(cur<t.questions.length-1){setCur(c=>c+1);}
      else{const fs=score+(ok?1:0);if(fs>=4){setConfetti(true);setTimeout(()=>setConfetti(false),3000);}setDone(true);onDone(fs,t.questions.length);}
    },850);
  };
  if(done){
    const pct=Math.round((score/t.questions.length)*100);
    return(
      <div className="content"><div className="result-screen">
        {confetti&&<Confetti/>}
        <div className="res-circle" style={{background:pct>=80?"linear-gradient(135deg,#00C853,#00a844)":pct>=50?"linear-gradient(135deg,#FFD700,#FFA500)":"linear-gradient(135deg,#FF9600,#FF6B00)"}}>
          <div className="res-glow" style={{background:pct>=80?"radial-gradient(circle,rgba(0,200,83,.3),transparent)":pct>=50?"radial-gradient(circle,rgba(255,215,0,.3),transparent)":"radial-gradient(circle,rgba(255,150,0,.3),transparent)"}}/>
          {pct>=80?"🏆":pct>=50?"⭐":"😅"}
        </div>
        <div className={`res-title ${isAr?t.fontClass:""}`}>{pct>=80?"Excellent! 🎉":pct>=50?"Good job! ⭐":"Keep trying! 💪"}</div>
        <div style={{color:"#718096",fontSize:14}}>{score}/{t.questions.length} {t.correctAns}</div>
        <div className="xp-pill"><div className="xp-lbl">{t.xpGained}</div><div className="xp-val">+{score*10} ✨</div></div>
        <div className="res-actions">
          <button className="btn-primary" onClick={()=>{setCur(0);setScore(0);setSel(null);setDone(false);}}>{t.playAgain}</button>
          <button className="btn-secondary" onClick={()=>onDone(score,t.questions.length)}>{t.home}</button>
        </div>
      </div></div>
    );
  }
  return(
    <div className="content"><div className={`quiz-screen ${isAr?"rtl":""}`}>
      <div className="quiz-header">
        <div className="back-btn" onClick={onBack}>←</div>
        <div className="q-progress-wrap"><div className="q-progress-fill" style={{width:`${(cur/t.questions.length)*100}%`}}/></div>
        <div className="hearts">{Array.from({length:5}).map((_,i)=><span key={i} className={`heart${i>=lives?" lost":""}`}>❤️</span>)}</div>
      </div>
      {fb&&<div className={`feedback-bar ${fb==="ok"?"fb-ok":"fb-ko"}`}>{fb==="ok"?t.correct:t.wrong}</div>}
      <div className="q-card">
        <div className="q-flag">{q.flag}</div>
        <div className={`q-text ${isAr?t.fontClass:""}`}>{q.q}</div>
        <div className="q-meta">{t.question} {cur+1} {t.of} {t.questions.length}</div>
      </div>
      <div className="answers">
        {q.a.map((ans:string,i:number)=>(
          <button key={i} className={`ans-btn ${isAr?t.fontClass:""}${sel!==null?(i===q.c?" correct":sel===i?" wrong":""):""}`} onClick={()=>handle(i)}>{ans}</button>
        ))}
      </div>
    </div></div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function AtlasQuestFinal() {
  const [lang,setLang]=useState<string|null>(()=>load<string|null>("lang",null));
  const [tab,setTab]=useState("home");
  const [quiz,setQuiz]=useState<any>(null);
  const [gems,setGems]=useState<number>(()=>load("gems",320));
  const [streak,setStreak]=useState<number>(()=>load("streak",7));
  const [isPrem,setIsPrem]=useState<boolean>(()=>load("isPrem",false));
  const [modProgress,setModProgress]=useState<ModProgress>(()=>load<ModProgress>("modProgress",{eu:{lessons:7,progress:58},af:{lessons:3,progress:25}}));
  const [showBanner,setShowBanner]=useState(true);
  const [showRewarded,setShowRewarded]=useState(false);
  const [showNoLives,setShowNoLives]=useState(false);
  const [showStreakLost,setShowStreakLost]=useState(false);
  const [toast,setToast]=useState<string|null>(null);
  const [saved,setSaved]=useState(false);

  // Lives with timed refill
  const [lives,setLivesRaw]=useState<number>(()=>{
    const s=load<number>("lives",LIVES_MAX);const ts=load<number>("livesTs",Date.now());
    return Math.min(LIVES_MAX,s+Math.floor((Date.now()-ts)/LIVES_REFILL_MS));
  });
  const [livesTs,setLivesTs]=useState<number>(()=>load("livesTs",Date.now()));

  // ── Streak reset check on mount ──────────────────────────
  useEffect(()=>{
    const lastPlayed=load<string>("lastPlayedDate","");
    const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
    const yStr=yesterday.toISOString().split("T")[0];
    if(lastPlayed&&lastPlayed<yStr){
      setStreak(0);save("streak",0);
      setShowStreakLost(true);
    }
  },[]);

  // ── Persist on change ─────────────────────────────────────
  useEffect(()=>{save("lang",lang);},[lang]);
  useEffect(()=>{save("gems",gems);setSaved(true);setTimeout(()=>setSaved(false),700);},[gems]);
  useEffect(()=>{save("streak",streak);},[streak]);
  useEffect(()=>{save("isPrem",isPrem);},[isPrem]);
  useEffect(()=>{save("modProgress",modProgress);},[modProgress]);
  useEffect(()=>{save("lives",lives);save("livesTs",livesTs);},[lives,livesTs]);

  // ── Life refill timer ─────────────────────────────────────
  useEffect(()=>{
    if(lives>=LIVES_MAX||isPrem)return;
    const iv=setInterval(()=>{setLivesRaw(l=>{if(l<LIVES_MAX){setLivesTs(Date.now());return l+1;}return l;});},LIVES_REFILL_MS);
    return()=>clearInterval(iv);
  },[lives,isPrem]);

  const setLives=useCallback((fn:(l:number)=>number)=>{
    setLivesRaw(prev=>{const next=fn(prev);if(next<prev)setLivesTs(Date.now());return next;});
  },[]);

  const nextLifeIn=(()=>{
    if(lives>=LIVES_MAX)return"";
    const rem=Math.max(0,LIVES_REFILL_MS-(Date.now()-livesTs));
    return`${Math.floor(rem/60000)}:${Math.floor((rem%60000)/1000).toString().padStart(2,"0")}`;
  })();

  const t=lang?T[lang]:null;const isAr=t?.dir==="rtl";const fc=t?.fontClass||"";

  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(null),2500);};
  const onAdReward=()=>{setShowRewarded(false);setShowNoLives(false);setLives((l:number)=>Math.min(l+1,LIVES_MAX));showToast(t.adWatched);};

  const onQuizDone=(modId:string,score:number,total:number)=>{
    save("lastPlayedDate",todayStr());
    if(score>=Math.ceil(total*.5)){
      setModProgress(prev=>{const cur=prev[modId]||{lessons:0,progress:0};const mod=t.modules.find((m:any)=>m.id===modId);const nl=Math.min(cur.lessons+1,mod?.total??12);return{...prev,[modId]:{lessons:nl,progress:Math.round((nl/(mod?.total??12))*100)}};});
      setGems((g:number)=>g+50);setStreak((s:number)=>s+1);showToast("🎉 +50 💎 · Streak +1 🔥");
    }else{showToast("💪 Keep trying!");}
    setQuiz(null);
  };

  if(!document.getElementById("aq-styles")){const s=document.createElement("style");s.id="aq-styles";s.textContent=CSS;document.head.appendChild(s);}

  if(!lang)return(
    <div className="app">
      <div className="bg-dots"/><div className="bg-orb1"/><div className="bg-orb2"/>
      <div className="lang-screen">
        <div className="lang-title">🌍 AtlasQuest<br/><span style={{fontSize:16,color:"#A0AEC0"}}>Choisir · Choose · اختر</span></div>
        {[{code:"fr",flag:"🇫🇷",name:"Français",sub:"Français"},{code:"en",flag:"🇬🇧",name:"English",sub:"English"},{code:"ar",flag:"🇸🇦",name:"العربية",sub:"Arabic"}].map((l,i)=>(
          <div key={l.code} className="lang-btn" style={{animationDelay:`${i*.1}s`}} onClick={()=>setLang(l.code)}>
            <span className="lang-flag">{l.flag}</span>
            <div className="lang-info"><div className="lang-name">{l.name}</div><div className="lang-sub">{l.sub}</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  const TABS=[{id:"home",icon:"🏠",label:t.tabs.home},{id:"league",icon:"🏆",label:t.tabs.league},{id:"quests",icon:"🎁",label:t.tabs.quests},{id:"shop",icon:"🛍️",label:t.tabs.shop},{id:"guide",icon:"📖",label:t.tabs.guide}];

  return(
    <div className={`app ${isAr?"rtl":""}`}>
      <div className="bg-dots"/><div className="bg-orb1"/><div className="bg-orb2"/>

      {showRewarded&&<RewardedModal t={t} onReward={onAdReward} onClose={()=>setShowRewarded(false)}/>}
      {showNoLives&&!showRewarded&&<NoLivesModal t={t} nextLifeIn={nextLifeIn} onWatch={()=>{setShowNoLives(false);setShowRewarded(true);}} onClose={()=>setShowNoLives(false)}/>}
      {showStreakLost&&<StreakLostModal t={t} onClose={()=>setShowStreakLost(false)}/>}

      {!quiz&&(
        <div className="header">
          {saved&&<div className="save-indicator">💾 saved</div>}
          <div className="h-left">
            <div className="flag-btn" onClick={()=>setLang(null)}>{t.flag}</div>
            <div className="leo-wrap"><div className="leo">🦁</div><span className="leo-crown">👑</span></div>
          </div>
          <div className="stats-row">
            <div className="stat-pill s-fire">🔥 {streak}</div>
            <div className="stat-pill s-gem">💎 {gems}</div>
            <div className="stat-pill s-life" onClick={()=>lives===0&&setShowNoLives(true)}>❤️ {isPrem?"∞":lives}</div>
          </div>
        </div>
      )}

      {!isPrem&&showBanner&&!quiz&&(
        <div className="ad-strip" onClick={()=>showToast("🌍 Atlas Maps Pro")}>
          <div className="ad-tag">Ad</div><div className="ad-img">🌍</div>
          <div className="ad-body"><div className="ad-title">Atlas Maps Pro — GPS Navigation</div><div className="ad-desc">Offline maps · 195 countries</div></div>
          <button className="ad-cta">Open</button>
          <span className="ad-x" onClick={(e)=>{e.stopPropagation();setShowBanner(false);}}>✕</span>
        </div>
      )}

      {quiz?(
        <QuizScreen t={t} mod={quiz} lives={isPrem?Infinity:lives} setLives={setLives} setShowNoLives={setShowNoLives} onBack={()=>setQuiz(null)} onDone={(sc,tot)=>onQuizDone(quiz.id,sc,tot)}/>
      ):tab==="guide"?(
        <GuideScreen/>
      ):tab==="home"?(
        <div className="content">
          <div className="streak-card">
            {[[10,8],[90,15],[25,55],[80,40],[60,72],[40,85]].map(([t1,l1],i)=>(
              <div key={i} className="sc-particle" style={{top:`${t1}%`,left:`${l1}%`,animationDelay:`${i*.4}s`,animationDuration:`${2+i*.3}s`}}/>
            ))}
            <div className="sc-inner">
              <div className="sc-leo">🦁<span style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",fontSize:16}}>👑</span></div>
              <div className="sc-content">
                <div className={`sc-label ${fc}`}>{t.greeting}</div>
                <div className={`sc-title ${fc}`}>{streak} {t.streak}</div>
                <div className={`sc-sub ${fc}`}>{t.league}</div>
              </div>
            </div>
          </div>
          <div className={`sec-title ${fc}`} style={{letterSpacing:isAr?"1px":"3px"}}>{isAr?"وحداتك":"Modules"}</div>
          <div className="mod-grid">
            {t.modules.map((mod:any,i:number)=>{
              const prog=modProgress[mod.id]||{lessons:0,progress:0};
              return(
                <div key={mod.id} className={`mod-card ${mod.free||isPrem?"free":"locked"}`}
                  style={{"--shadow":mod.shadow,background:mod.bg,animationDelay:`${i*.07}s`} as React.CSSProperties}
                  onClick={()=>{if(!mod.free&&!isPrem){setTab("shop");return;}if(lives<=0&&!isPrem){setShowNoLives(true);return;}setQuiz(mod);}}>
                  {!mod.free&&!isPrem&&<span className="mod-lock-icon">🔒</span>}
                  <span className="mod-emoji">{mod.emoji}</span>
                  <div className={`mod-name ${fc}`}>{mod.name}</div>
                  <span className={`mod-tag ${mod.free||isPrem?"tag-free":"tag-lock"}`}>{mod.free||isPrem?`✅ ${mod.tag}`:`👑 ${mod.tag}`}</span>
                  {(mod.free||isPrem)&&<div className="mod-progress">
                    <div style={{fontSize:10,color:"rgba(255,255,255,.7)",marginBottom:3}}>{prog.lessons}/{mod.total} {t.lessons} · {prog.progress}%</div>
                    <div className="mod-bar"><div className="mod-fill" style={{width:`${prog.progress}%`}}/></div>
                  </div>}
                </div>
              );
            })}
          </div>
          <div style={{height:20}}/>
        </div>
      ):tab==="league"?(
        <div className="content"><div className="lb-screen">
          <div className="lb-top"><div className="lb-trophy">🥈</div><div className={`lb-league-name ${fc}`}>{t.leagueTitle}</div><div className={`lb-sub ${fc}`}>{t.leagueSub}</div></div>
          <div className={`sec-title ${fc}`} style={{letterSpacing:isAr?"1px":"3px"}}>{t.ranking}</div>
          {LEADERS.map((p,i)=>(
            <div key={p.rank} className={`player-row ${(p as any).isMe?"me":""}`} style={{background:p.bg,animationDelay:`${i*.06}s`}}>
              <div className={`rank-num ${p.rank===1?"rank-g":p.rank===2?"rank-s":p.rank===3?"rank-b":"rank-n"}`}>{p.rank<=3?["🥇","🥈","🥉"][p.rank-1]:p.rank}</div>
              <div className="p-avatar" style={{background:p.bg}}>{p.flag}</div>
              <div className="p-info"><div className={`p-name ${(p as any).isMe?"me":""} ${fc}`}>{p.name}</div><div className="p-league">{p.league}</div></div>
              <div className="p-xp">{p.xp.toLocaleString()} XP</div>
            </div>
          ))}
          <div style={{height:20}}/>
        </div></div>
      ):tab==="quests"?(
        <div className="content"><div className="quest-screen">
          <div className="quest-header"><div className="quest-icon">🎯</div><div className={`quest-title ${fc}`}>{t.quests}</div></div>
          {t.questItems.map((q:any,i:number)=>(
            <div key={i} className={`quest-card ${q.done?"done":""}`} style={{animationDelay:`${i*.08}s`}}>
              <div className="quest-qicon">{q.icon}</div>
              <div className="quest-body"><div className={`quest-name ${fc}`}>{q.name}</div><div className="quest-reward">{q.reward}</div></div>
              <div className="quest-check">{q.done?"✅":"⭕"}</div>
            </div>
          ))}
        </div></div>
      ):tab==="shop"?(
        <div className="content"><div className="shop-screen">
          {!isPrem?(
            <div className="prem-card">
              <div className="prem-icon">👑</div>
              <div className={`prem-title ${fc}`}>{t.premiumTitle}</div>
              <div className={`prem-desc ${fc}`}>{t.premiumDesc}</div>
              <div className="prem-price">{t.premiumPrice}</div>
              <button className="btn-purple" onClick={()=>{setIsPrem(true);setShowBanner(false);showToast("👑 Premium activated!");}}>{t.premiumBtn}</button>
            </div>
          ):(
            <div className="prem-active">
              <div style={{fontSize:40,marginBottom:10}}>✅</div>
              <div style={{fontSize:18,fontWeight:800,color:"#00C853"}} className={fc}>{t.premiumActive}</div>
              <div style={{fontSize:13,color:"#718096",marginTop:4}} className={fc}>{t.premiumActiveSub}</div>
            </div>
          )}
          <div className={`sec-title ${fc}`} style={{letterSpacing:isAr?"1px":"3px"}}>{t.shopTitle}</div>
          <div className="shop-grid">
            {t.shopItems.map((item:any,i:number)=>(
              <div key={i} className="shop-card" style={{animationDelay:`${i*.07}s`}} onClick={()=>{if(item.icon==="❤️"&&gems>=100){setGems((g:number)=>g-100);setLives((l:number)=>Math.min(l+1,LIVES_MAX));showToast("❤️ +1 life!");}else showToast(`✅ ${item.name}`);}}>
                <span className="sc-icon">{item.icon}</span>
                <div className={`sc-name ${fc}`}>{item.name}</div>
                <div className="sc-desc">{item.desc}</div>
                <div className="sc-price">{item.price}</div>
              </div>
            ))}
          </div>
          <div className={`sec-title ${fc}`} style={{letterSpacing:isAr?"1px":"3px"}}>{t.gemsTitle}</div>
          <div className="gem-row">
            {t.gemPkgs.map((g:any,i:number)=>(
              <div key={i} className="gem-card" onClick={()=>showToast(`💎 ${g.amt}`)}>
                <div style={{fontSize:28,marginBottom:6}}>💎</div>
                <div className="gem-amt">{g.amt}</div>
                <div className="gem-price">{g.price}</div>
              </div>
            ))}
          </div>
          <div style={{height:20}}/>
        </div></div>
      ):null}

      {!isPrem&&!quiz&&(
        <div className="rewarded-bar" onClick={()=>setShowRewarded(true)}>
          <span className="rb-icon">📺</span>
          <span className={`rb-text ${fc}`}>{t.watchAd}</span>
          <span className="rb-badge">+1 ❤️</span>
        </div>
      )}

      {!quiz&&(
        <div className="nav">
          {TABS.map((n:any)=>(
            <div key={n.id} className={`nav-item ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className={`nav-label ${fc}`}>{n.label}</span>
              {tab===n.id&&<div className="nav-dot"/>}
            </div>
          ))}
        </div>
      )}

      {toast&&<div className={`toast ${fc}`}>{toast}</div>}
    </div>
  );
}
