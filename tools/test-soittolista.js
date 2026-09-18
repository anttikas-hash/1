const { chromium } = require('playwright');
const URL='file:///home/user/1/soittolista/index.html';
const fails=[], notes=[];
function check(name, cond, detail){ (cond?notes:fails).push((cond?'OK   ':'VIKA ')+name+(detail?' — '+detail:'')); }

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const p=await ctx.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 await p.goto(URL);
 await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);

 // --- 1. tyhjä tila
 check('tyhjä tila näyttää ohjeen',
   await p.evaluate(()=>/tyhjä/i.test(document.querySelector('#lista').textContent)));

 // --- 2. siemen
 await p.click('#seed'); await p.waitForTimeout(250);
 const seeded=await p.evaluate(()=>document.querySelectorAll('.item').length);
 check('siemen tuo 16 riviä', seeded===16, 'rivejä '+seeded);

 // --- 3. ilkeä syöte
 await p.evaluate(()=>{
  const add=(n,ph,tr,web,note)=>{
   document.querySelector('#toggle-add').click();
   document.querySelector('#f-name').value=n;
   document.querySelector('#f-phone').value=ph;
   document.querySelector('#f-trade').value=tr;
   document.querySelector('#f-web').value=web;
   document.querySelector('#f-note').value=note||'';
   document.querySelector('#add').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));
  };
  add('<img src=x onerror="window.__pwned=1">','040 111 2222','Testi','none','<b>lihava</b>');
  add('Erittäinpitkäyhdyssanayritysnimirakennuspalveluosakeyhtiö','+358 40 123 4567','Rakennusliike','broken','');
  add('"Lainausmerkit" & ampersand','02-123 4567','Testi','old','rivi & merkki');
  add('Ei numeroa Oy','','Siivous','unknown','');
 });
 await p.waitForTimeout(300);
 check('XSS ei suoritu', !(await p.evaluate(()=>window.__pwned===1)));
 check('HTML näkyy tekstinä',
   await p.evaluate(()=>[...document.querySelectorAll('.name')].some(e=>e.textContent.includes('<img src=x'))));

 // --- 4. jarjestys
 // Lisatty rivi ei saa haudata listan pohjalle.
 const top5=await p.evaluate(()=>[...document.querySelectorAll('.name')].slice(0,5).map(e=>e.textContent));
 check('lisätyt rivit näkyvät kärjessä',
   top5.some(t=>/img src=x/.test(t)) && top5.some(t=>/Erittäinpitkä/.test(t)),
   top5.slice(0,3).join(' | ').slice(0,60));

 // Painike ilmestyy vain kun nakyma eroaa paremmuusjarjestyksesta.
 const hiddenNow=await p.evaluate(()=>document.querySelector('#resort').hidden);
 await p.evaluate(()=>{
  const it=document.querySelectorAll('.item')[1];
  const sel=it.querySelector('select[data-act="web"]');
  sel.value='ok'; sel.dispatchEvent(new Event('change',{bubbles:true}));
 });
 await p.waitForTimeout(250);
 check('painike ilmestyy kun järjestys vanhenee',
   await p.evaluate(()=>!document.querySelector('#resort').hidden),
   'ennen muutosta piilossa: '+hiddenNow);

 await p.click('#resort'); await p.waitForTimeout(300);
 const firstWeb=await p.evaluate(()=>document.querySelector('.item').getAttribute('data-web'));
 check('järjestelyn jälkeen paras liidi ylimpänä', firstWeb==='none', 'ylin on '+firstWeb);
 check('painike piiloutuu järjestelyn jälkeen',
   await p.evaluate(()=>document.querySelector('#resort').hidden));

 // --- 5. puhelinlinkki
 const hrefs=await p.evaluate(()=>[...document.querySelectorAll('.tel')].map(a=>a.getAttribute('href')));
 check('0-alku muuntuu +358:ksi', hrefs.some(h=>h==='tel:+358401112222'), hrefs.slice(0,3).join(' '));
 check('+358-muoto säilyy', hrefs.some(h=>h==='tel:+358401234567'));
 check('väliviivallinen numero toimii', hrefs.some(h=>h==='tel:+358212 34567'||h==='tel:+3582123 4567'||h==='tel:+35821234567'), hrefs.join(' '));
 check('numeroton rivi ei tee linkkiä',
   await p.evaluate(()=>[...document.querySelectorAll('.item')].some(i=>/Ei numeroa/.test(i.textContent)&&i.querySelector('.nophone'))));

 // --- 6. tilan vaihto ja seuranta kärkeen
 await p.evaluate(()=>{
  const items=[...document.querySelectorAll('.item')];
  const last=items[items.length-1];
  const sel=last.querySelector('select[data-act="status"]');
  sel.value='callback'; sel.dispatchEvent(new Event('change',{bubbles:true}));
 });
 await p.waitForTimeout(250);
 // Rivi EI saa hypata pois sormen alta kesken soittamisen.
 check('tilanvaihto ei siirrä riviä',
   await p.evaluate(()=>{const items=[...document.querySelectorAll('.item')];
     return items[items.length-1].getAttribute('data-status')==='callback';}));
 // Vasta pyydettaessa seuranta nousee karkeen.
 await p.click('#resort'); await p.waitForTimeout(300);
 check('järjestelyn jälkeen seuranta ylimpänä',
   await p.evaluate(()=>document.querySelector('.item').getAttribute('data-status')==='callback'));

 // --- 7. laskurit
 const c=await p.evaluate(()=>({t:+document.querySelector('#n-total').textContent,
   todo:+document.querySelector('#n-todo').textContent}));
 check('laskuri vastaa rivimäärää', c.t===20, 'listalla '+c.t);

 // --- 8. suodattimet
 for(const [f,label] of [['todo','Soittamatta'],['follow','Seuranta'],['yes','Kiinnostuneet'],['all','Kaikki']]){
  await p.click(`.chip[data-filter="${f}"]`); await p.waitForTimeout(180);
  const n=await p.evaluate(()=>document.querySelectorAll('.item').length);
  notes.push(`     suodatin ${label}: ${n} riviä`);
 }

 // --- 9. tallennus kestää uudelleenlatauksen
 await p.reload(); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
 const after=await p.evaluate(()=>document.querySelectorAll('.item').length);
 check('lista säilyy uudelleenlatauksessa', after===20, 'rivejä '+after);

 // --- 10. ylivuoto pitkällä sisällöllä
 for(const w of [320,375,390,768,1440]){
  await p.setViewportSize({width:w,height:844}); await p.waitForTimeout(220);
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  check(`ei ylivuotoa @${w}px täydellä listalla`, ov===0, ov+'px');
 }

 // --- 11. kosketuskohteet täydellä listalla
 await p.setViewportSize({width:390,height:844}); await p.waitForTimeout(400);
 const small=await p.evaluate(()=>[...document.querySelectorAll('a,button,input,select,summary')]
  .filter(el=>{const r=el.getBoundingClientRect();return (r.width||r.height)&&(r.height<44||r.width<44);})
  .map(el=>el.tagName+' "'+(el.textContent||'').trim().slice(0,14)+'"'));
 check('kosketuskohteet 44x44 täydellä listalla', small.length===0, small.slice(0,4).join(', '));

 check('ei JS-virheitä', errs.length===0, errs.slice(0,2).join(' | '));

 console.log([...fails,...notes].join('\n'));
 console.log('\n'+(fails.length?fails.length+' VIKAA':'kaikki toiminnalliset testit läpi'));
 await b.close();
})();
