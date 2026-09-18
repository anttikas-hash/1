const { chromium } = require('playwright');
const SITES=['talosaaro','sahko','maalaus','piha'];
const PAGES={talosaaro:['index','palvelut','kohteet','yritys','yhteystiedot'],
 sahko:['index','palvelut','yritys','yhteystiedot'],
 maalaus:['index','palvelut','yritys','yhteystiedot'],
 piha:['index','palvelut','yritys','yhteystiedot']};
function lin(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function L(r,g,b){return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);}
function parse(s){const m=s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
 return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null;}
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const issues=[];
 for(const site of SITES){
  for(const w of [320,375,768,1024,1440,1920]){
   const ctx=await b.newContext({viewport:{width:w,height:900}});
   const p=await ctx.newPage(); const errs=[];
   p.on('pageerror',e=>errs.push(e.message));
   p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
   for(const n of PAGES[site]){
    await p.goto(`file:///home/user/1/${site}/${n}.html`);
    await p.evaluate(()=>document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible')));
    await p.evaluate(()=>{document.querySelectorAll('img[loading="lazy"]').forEach(i=>i.loading='eager');
     window.scrollTo(0,document.body.scrollHeight);});
    await p.waitForTimeout(400);
    await p.evaluate(()=>window.scrollTo(0,0));
    await p.waitForTimeout(150);
    const ov=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    if(ov>0) issues.push(`${site}/${n} @${w}px: vaakaylivuoto ${ov}px`);
    if(w===1440){
     // kuvat latautuivat
     const badImg=await p.evaluate(()=>[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src')));
     badImg.forEach(s=>issues.push(`${site}/${n}: kuva ei latatunut ${s}`));
     const noAlt=await p.evaluate(()=>[...document.images].filter(i=>!i.hasAttribute('alt')).length);
     if(noAlt) issues.push(`${site}/${n}: ${noAlt} kuvaa ilman alt-tekstiä`);
     const h1=await p.evaluate(()=>document.querySelectorAll('h1').length);
     if(h1!==1) issues.push(`${site}/${n}: h1-otsikoita ${h1}`);
     // kontrasti
     const res=await p.evaluate(()=>{const out=[];
      document.querySelectorAll('*').forEach(el=>{
       const t=[...el.childNodes].filter(x=>x.nodeType===3&&x.textContent.trim()).map(x=>x.textContent.trim()).join(' ');
       if(!t)return; const cs=getComputedStyle(el);
       if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return;
       const pr=(str)=>{const m=str.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
        return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null;};
       let bg=null,e=el;
       while(e){const c=getComputedStyle(e).backgroundColor;
        if(c&&!c.startsWith('rgba(0, 0, 0, 0)')){const a=pr(c);if(a&&a[3]>0.85){bg=c;break;}} e=e.parentElement;}
       out.push({t:t.slice(0,34),fg:cs.color,bg:bg||'rgb(255,255,255)',fs:parseFloat(cs.fontSize),fw:cs.fontWeight});});
      return out;});
     for(const r of res){const f=parse(r.fg),g=parse(r.bg); if(!f||!g)continue;
      const a=f[3]; const mix=[0,1,2].map(i=>f[i]*a+g[i]*(1-a));
      const cr=(Math.max(L(...mix),L(g[0],g[1],g[2]))+0.05)/(Math.min(L(...mix),L(g[0],g[1],g[2]))+0.05);
      const need=(r.fs>=24||(r.fs>=18.66&&+r.fw>=700))?3:4.5;
      if(cr<need-0.02) issues.push(`${site}/${n}: kontrasti ${cr.toFixed(2)}<${need} "${r.t}"`);}
     // kosketuskohteet mobiilissa tarkistetaan erikseen
    }
   }
   if(errs.length) issues.push(`${site} @${w}px JS: ${errs.slice(0,2).join(' | ')}`);
   await ctx.close();
  }
  // kosketuskohteet 390px
  const mc=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mp=await mc.newPage();
  for(const n of PAGES[site]){
   await mp.goto(`file:///home/user/1/${site}/${n}.html`);
   await mp.evaluate(()=>document.fonts.ready); await mp.waitForTimeout(250);
   const small=await mp.evaluate(()=>[...document.querySelectorAll('a,button,input,select,textarea,summary')]
    .filter(el=>{const r=el.getBoundingClientRect();
     if(!(r.width||r.height))return false;
     // WCAG 2.5.8 vapauttaa leipätekstin sisäiset linkit
     if(el.tagName==='A'&&['P','LI','SUMMARY'].includes(el.parentElement.tagName)
        &&el.parentElement.textContent.trim().length>el.textContent.trim().length+12)return false;
     return r.height<44||r.width<44;})
    .map(el=>`${el.tagName} "${(el.textContent||'').trim().slice(0,20)}"`));
   small.forEach(s=>issues.push(`${site}/${n} @390px: kosketuskohde alle 44px ${s}`));
  }
  await mc.close();
  console.log('tarkistettu:', site);
 }
 console.log('\n'+(issues.length?issues.join('\n'):'KAIKKI NELJÄ SIVUSTOA LÄPÄISEVÄT'));
 await b.close();
})();
