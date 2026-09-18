const { chromium } = require('playwright');
function lin(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function L(r,g,b){return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);}
const pr=s=>{const m=s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
 return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null;};
const URL='file:///home/user/1/soittolista/index.html';
const fails=[],notes=[];
const check=(n,c,d)=>(c?notes:fails).push((c?'OK   ':'VIKA ')+n+(d?' — '+d:''));

const fill = (n) => {
 const webs=['none','broken','old','unknown','ok'];
 const sts=['new','noanswer','talked','sent','callback','yes','no'];
 for(let i=0;i<n;i++){
  document.querySelector('#toggle-add').click();
  document.querySelector('#f-name').value='Yritys '+(i+1)+' Oy';
  document.querySelector('#f-phone').value='04'+(i%10)+' '+(100+i)+' '+(1000+i);
  document.querySelector('#f-trade').value='Toimiala '+(i%6);
  document.querySelector('#f-web').value=webs[i%webs.length];
  document.querySelector('#f-note').value=i%3?'':'muistiinpano '+i;
  document.querySelector('#add').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));
 }
 // levita kaikki tilat, jotta jokainen varimuunnos tulee testatuksi
 [...document.querySelectorAll('.item')].forEach((it,i)=>{
  const s=it.querySelector('select[data-act="status"]');
  s.value=sts[i%sts.length]; s.dispatchEvent(new Event('change',{bubbles:true}));
 });
};

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});

 // ---- A. 50 riviä: kontrasti, ylivuoto, suorituskyky
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto(URL); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(250);
 const t0=Date.now();
 await p.evaluate(fill, 50);
 await p.waitForTimeout(400);
 const ms=Date.now()-t0;
 const n=await p.evaluate(()=>document.querySelectorAll('.item').length);
 check('50 riviä lisätään', n===50, n+' riviä, '+ms+' ms');
 check('50 rivin lisäys alle 5 s', ms<5000, ms+' ms');

 for(const w of [320,375,390,768,1440]){
  await p.setViewportSize({width:w,height:844}); await p.waitForTimeout(200);
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  check(`ei ylivuotoa @${w}px / 50 riviä`, ov===0, ov+'px');
 }

 await p.setViewportSize({width:390,height:844}); await p.waitForTimeout(400);
 const res=await p.evaluate(()=>{const out=[];
  const pr2=s=>{const m=s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
   return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null;};
  document.querySelectorAll('*').forEach(el=>{
   const t=[...el.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).map(x=>x.textContent.trim()).join(' ');
   if(!t)return; const cs=getComputedStyle(el);
   if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return;
   let bg=null,e=el,grad=false;
   while(e){const g=getComputedStyle(e);
    if(g.backgroundImage&&g.backgroundImage!=='none'){grad=true;break;}
    const c=g.backgroundColor;
    if(c&&!c.startsWith('rgba(0, 0, 0, 0)')){const a=pr2(c);if(a&&a[3]>0.85){bg=c;break;}} e=e.parentElement;}
   if(grad)return;
   out.push({t:t.slice(0,24),fg:cs.color,bg:bg||'rgb(255,255,255)',fs:parseFloat(cs.fontSize),fw:cs.fontWeight});});
  return out;});
 let bad=0, worst=[99,''];
 for(const r of res){const f=pr(r.fg),g=pr(r.bg); if(!f||!g)continue;
  const a=f[3]; const mix=[0,1,2].map(i=>f[i]*a+g[i]*(1-a));
  const cr=(Math.max(L(...mix),L(g[0],g[1],g[2]))+0.05)/(Math.min(L(...mix),L(g[0],g[1],g[2]))+0.05);
  const need=(r.fs>=24||(r.fs>=18.66&&+r.fw>=700))?3:4.5;
  if(cr<need-0.02){bad++; fails.push('VIKA kontrasti '+cr.toFixed(2)+'<'+need+' "'+r.t+'"');}
  if(cr<worst[0]) worst=[cr,r.t];}
 check('kontrastit kaikissa tiloissa', bad===0, 'heikoin '+worst[0].toFixed(2)+' ("'+worst[1]+'")');

 const small=await p.evaluate(()=>[...document.querySelectorAll('a,button,input,select,summary')]
  .filter(el=>{const r=el.getBoundingClientRect();return (r.width||r.height)&&(r.height<44||r.width<44);}).length);
 check('kosketuskohteet 44x44 / 50 riviä', small===0, small+' liian pientä');

 // ---- B. vienti
 await ctx.grantPermissions(['clipboard-read','clipboard-write']);
 await p.click('#export'); await p.waitForTimeout(400);
 const clip=await p.evaluate(()=>navigator.clipboard.readText().catch(()=>''));
 check('vienti tuottaa otsikkorivin', /^Nimi\tPuhelin\tToimiala/.test(clip), clip.slice(0,40));
 check('vienti sisältää kaikki rivit', clip.trim().split('\n').length===51, clip.trim().split('\n').length+' riviä');

 // ---- C. poisto
 await p.evaluate(()=>{window.confirm=()=>true;});
 await p.evaluate(()=>document.querySelector('.kill').click());
 await p.waitForTimeout(250);
 check('poisto vähentää rivin', (await p.evaluate(()=>document.querySelectorAll('.item').length))===49);

 // ---- D. näppäimistö
 await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
 const focusable=await p.evaluate(()=>{const a=document.activeElement;
  return a&&a!==document.body?a.tagName+'.'+(a.className||'').toString().slice(0,20):'ei mitään';});
 check('sarkain siirtää fokuksen', focusable!=='ei mitään', focusable);
 const ring=await p.evaluate(()=>{const a=document.activeElement;
  a.focus(); const cs=getComputedStyle(a); return cs.outlineStyle!=='none'||cs.boxShadow!=='none';});
 check('fokus näkyy', ring);

 check('ei JS-virheitä (A-D)', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();

 // ---- E. tallennus estetty (yksityinen ikkuna)
 const ctx2=await b.newContext({viewport:{width:390,height:844}});
 const p2=await ctx2.newPage(); const errs2=[];
 p2.on('pageerror',e=>errs2.push(String(e.message)));
 await p2.addInitScript(()=>{
  Object.defineProperty(window,'localStorage',{get(){throw new Error('estetty');}});
 });
 await p2.goto(URL); await p2.waitForTimeout(400);
 const alive=await p2.evaluate(()=>!!document.querySelector('#lista'));
 check('toimii kun tallennus on estetty', alive && errs2.length===0, errs2.slice(0,1).join(''));
 const warned=await p2.evaluate(()=>/tallennus/i.test(document.querySelector('#say').textContent));
 check('varoittaa kun tallennus estetty', warned,
   await p2.evaluate(()=>document.querySelector('#say').textContent||'(tyhjä)'));
 await p2.evaluate(()=>{
  document.querySelector('#toggle-add').click();
  document.querySelector('#f-name').value='Testi ilman tallennusta';
  document.querySelector('#add').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));
 });
 await p2.waitForTimeout(250);
 check('lisääminen toimii silti', (await p2.evaluate(()=>document.querySelectorAll('.item').length))>=1);
 await ctx2.close();

 // ---- F. liike pois päältä
 const ctx3=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const p3=await ctx3.newPage();
 await p3.goto(URL); await p3.waitForTimeout(300);
 const dur=await p3.evaluate(()=>getComputedStyle(document.querySelector('.btn')).transitionDuration);
 check('reduced-motion kunnioitetaan', parseFloat(dur)<0.05, dur);
 await ctx3.close();

 console.log([...fails,...notes].join('\n'));
 console.log('\n'+(fails.length?fails.length+' VIKAA':'KAIKKI TESTIT LÄPI'));
 await b.close();
})();
