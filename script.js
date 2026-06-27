
/* ════════════════════════════════════════════
   PRELOADER — circle mask reveal
════════════════════════════════════════════ */
(function(){
  const pl = document.getElementById('pl');
  const pt = document.getElementById('pl-pct');
  const orb = document.getElementById('pl-orb');

  // Build orbiting particles
  const colors = ['#6366f1','#a855f7','#22d3ee','#ec4899','#f59e0b'];
  for(let i=0;i<12;i++){
    const s = document.createElement('span');
    const r = 80 + Math.random()*55;
    s.style.cssText = `background:${colors[i%5]};width:${4+Math.random()*5}px;height:${4+Math.random()*5}px;
      --r:${r}px;--t:${2+Math.random()*4}s;animation-delay:${Math.random()*2}s;
      left:50%;top:50%;margin-left:-2px;margin-top:-2px;opacity:${0.5+Math.random()*.5}`;
    orb.appendChild(s);
  }

  let n = 0;
  const iv = setInterval(()=>{
    n = Math.min(n + Math.random()*15, 100);
    pt.textContent = Math.floor(n) + '%';
    if(n>=100){
      clearInterval(iv);
      pt.textContent = '100%';
      setTimeout(()=>{
        pl.style.clipPath = 'circle(0% at 50% 50%)';
        setTimeout(()=> pl.style.display='none', 950);
      }, 300);
    }
  }, 55);
})();

/* ════════════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════════════ */
const spEl = document.getElementById('sp');
window.addEventListener('scroll', ()=>{
  const t = document.body.scrollHeight - window.innerHeight;
  spEl.style.width = (window.scrollY/t*100)+'%';
}, {passive:true});

/* ════════════════════════════════════════════
   CURSOR + TRAIL (15 points)
════════════════════════════════════════════ */
const cd = document.getElementById('cd');
const cr = document.getElementById('cr');
const N_TRAIL = 15;
const cols = ['#6366f1','#7c3aed','#a855f7','#c026d3','#ec4899',
               '#f43f5e','#f97316','#eab308','#22d3ee','#10b981',
               '#6366f1','#7c3aed','#a855f7','#22d3ee','#6366f1'];
const trails = [];

if(window.matchMedia('(pointer:fine)').matches){
  for(let i=0;i<N_TRAIL;i++){
    const d = document.createElement('div');
    d.className = 'tr';
    const sz = Math.max(2, 8 - i*0.38);
    d.style.cssText = `width:${sz}px;height:${sz}px;background:${cols[i]};opacity:0`;
    document.body.appendChild(d);
    trails.push({el:d,x:0,y:0});
  }
  let mx=0,my=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cd.style.left=mx+'px'; cd.style.top=my+'px';
    cr.style.left=mx+'px'; cr.style.top=my+'px';
  });
  // Trail animation loop
  (function tick(){
    let lx=mx,ly=my;
    trails.forEach((t,i)=>{
      t.x += (lx-t.x)*0.36;
      t.y += (ly-t.y)*0.36;
      t.el.style.left = t.x+'px';
      t.el.style.top  = t.y+'px';
      t.el.style.opacity = ((1-i/N_TRAIL)*0.55).toFixed(3);
      lx=t.x; ly=t.y;
    });
    requestAnimationFrame(tick);
  })();
  // Hover state
  document.querySelectorAll('a,button,.skc,.pfc,.svc').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('ch'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('ch'));
  });
}

/* ════════════════════════════════════════════
   TYPEWRITER
════════════════════════════════════════════ */
const phrases=['Full-Stack Web Developer','از فرانت‌اند تا بک‌اند','React & Next.js Expert','کد تمیز، نتایج واقعی','طراحی تجربه کاربری مدرن'];
let pi=0,ci=0,del=false;
const tw=document.getElementById('tw');
function loop(){
  const s=phrases[pi];
  tw.textContent=del?s.slice(0,--ci):s.slice(0,++ci);
  if(!del&&ci===s.length){del=true;setTimeout(loop,2000);return}
  if(del&&ci===0){del=false;pi=(pi+1)%phrases.length}
  setTimeout(loop,del?36:68);
}
setTimeout(loop,2800);

/* ════════════════════════════════════════════
   THEME TOGGLE
════════════════════════════════════════════ */
document.getElementById('tb').addEventListener('click',()=>{
  // کلاس transitioning اضافه کن تا transition روی html هم بره
  document.documentElement.classList.add('transitioning');
  const dark = document.documentElement.getAttribute('data-theme')==='dark';
  document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  document.getElementById('ti').className = dark ? 'fas fa-sun' : 'fas fa-moon';
  setTimeout(()=> document.documentElement.classList.remove('transitioning'), 500);
});

/* ════════════════════════════════════════════
   NAVBAR SCROLL
════════════════════════════════════════════ */
const nav=document.getElementById('nav');
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('s',window.scrollY>50);
  btt.classList.toggle('show',window.scrollY>500);
},{passive:true});

/* ════════════════════════════════════════════
   HAMBURGER / MOBILE MENU
════════════════════════════════════════════ */
const hb=document.getElementById('hb');
const mm=document.getElementById('mm');
hb.addEventListener('click',()=>{hb.classList.toggle('on');mm.classList.toggle('on')});
mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{hb.classList.remove('on');mm.classList.remove('on')}));

/* ════════════════════════════════════════════
   BACK TO TOP — rocket
════════════════════════════════════════════ */
btt.addEventListener('click',()=>{
  btt.classList.add('launch');
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(()=>btt.classList.remove('launch'),750);
});

/* ════════════════════════════════════════════
   REVEAL ON SCROLL (IntersectionObserver)
════════════════════════════════════════════ */
const rvObs=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');rvObs.unobserve(e.target)}});
},{threshold:0.08});
document.querySelectorAll('.rv').forEach(el=>rvObs.observe(el));

/* ════════════════════════════════════════════
   SKILL BARS (triggered on card visibility)
════════════════════════════════════════════ */
const barObs=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      const b=e.target.querySelector('.skbar');
      if(b) setTimeout(()=>{ b.style.width=b.dataset.w+'%'; b.classList.add('filled'); },200);
      barObs.unobserve(e.target);
    }
  });
},{threshold:0.4});
document.querySelectorAll('.skc').forEach(c=>barObs.observe(c));

/* ════════════════════════════════════════════
   COUNTERS
════════════════════════════════════════════ */
const cntObs=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target,tgt=+el.dataset.t;
      let cur=0,step=tgt/70;
      const iv=setInterval(()=>{
        cur+=step;
        if(cur>=tgt){el.textContent=tgt+'+';clearInterval(iv)}
        else el.textContent=Math.floor(cur)+'+';
      },20);
      cntObs.unobserve(el);
    }
  });
},{threshold:0.5});
document.querySelectorAll('.stn[data-t]').forEach(el=>cntObs.observe(el));

/* ════════════════════════════════════════════
   ACTIVE NAV LINK
════════════════════════════════════════════ */
const secObs=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.nla').forEach(l=>l.classList.remove('on'));
      const a=document.querySelector(`.nla[href="#${e.target.id}"]`);
      if(a)a.classList.add('on');
    }
  });
},{threshold:0.35});
document.querySelectorAll('section[id]').forEach(s=>secObs.observe(s));

/* ════════════════════════════════════════════
   SMOOTH SCROLL (nav links)
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});

/* ════════════════════════════════════════════
   MAGNETIC BUTTONS
════════════════════════════════════════════ */
document.querySelectorAll('.mag').forEach(wrap=>{
  const btn=wrap.querySelector('a');
  wrap.addEventListener('mousemove',e=>{
    const r=wrap.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*0.28;
    const y=(e.clientY-r.top-r.height/2)*0.28;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  wrap.addEventListener('mouseleave',()=>btn.style.transform='');
});

/* ════════════════════════════════════════════
   PORTFOLIO FILTER + RIPPLE
════════════════════════════════════════════ */
const fbs=document.querySelectorAll('.fb');
const pfcs=document.querySelectorAll('.pfc');
fbs.forEach(btn=>{
  btn.addEventListener('click',function(e){
    // Ripple effect
    const rp=document.createElement('span');
    rp.className='ripple';
    const r=this.getBoundingClientRect();
    const sz=Math.max(r.width,r.height);
    rp.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px`;
    this.appendChild(rp);
    setTimeout(()=>rp.remove(),650);

    fbs.forEach(b=>b.classList.remove('on'));
    this.classList.add('on');
    const f=this.dataset.f;
    pfcs.forEach(c=>{
      const show=f==='all'||c.dataset.c===f;
      c.style.transition='opacity .4s,transform .4s';
      c.style.opacity=show?'1':'0';
      c.style.transform=show?'scale(1)':'scale(0.88)';
      c.style.pointerEvents=show?'':'none';
      c.style.display=show?'block':'none';
    });
  });
});

/* ════════════════════════════════════════════
   TIMELINE — slide from sides
════════════════════════════════════════════ */
const tlObs=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')});
},{threshold:0.15});
document.querySelectorAll('.ti').forEach(i=>tlObs.observe(i));

/* ════════════════════════════════════════════
   GLOW TILT on cards (desktop only — on touch
   this needs two taps and fights with the scroll-reveal transform)
════════════════════════════════════════════ */
if(window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.skc,.svc,.tc').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-0.5;
      const y=(e.clientY-r.top)/r.height-0.5;
      card.style.transform=`perspective(900px) rotateY(${x*12}deg) rotateX(${-y*12}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

/* ════════════════════════════════════════════
   COPY EMAIL
════════════════════════════════════════════ */
document.getElementById('copy-em').addEventListener('click',async function(e){
  e.preventDefault();
  try{
    await navigator.clipboard.writeText('hamidreza82m@gmail.com');
    const orig=this.textContent;
    this.style.webkitTextFillColor=getComputedStyle(document.documentElement).getPropertyValue('--accent');
    this.textContent='✓ کپی شد!';
    setTimeout(()=>{this.textContent=orig;this.style.webkitTextFillColor=''},2000);
  }catch(err){window.location.href=this.href}
});

/* ════════════════════════════════════════════
   CONTACT FORM — Formspree + hCaptcha + Honeypot
   ─────────────────────────────────────────────
   قبل از استفاده:
   1) action فرم رو با endpoint فرم‌اسپری عوض کن
   2) sitekey در window.onHcaptchaLoad تعریف شده
════════════════════════════════════════════ */
(function(){
  const form   = document.getElementById('ctf');
  const btn    = document.getElementById('sub-btn');
  const txt    = document.getElementById('sub-txt');
  const ico    = document.getElementById('sub-ico');
  const msgOk  = document.getElementById('msg-ok');
  const msgErr = document.getElementById('msg-err');
  const errTxt = document.getElementById('err-txt');

  function setLoading(on){
    btn.disabled = on;
    txt.textContent = on ? 'در حال ارسال...' : 'ارسال پیام';
    ico.className   = on ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane';
    btn.style.opacity = on ? '.75' : '1';
  }

  function showMsg(type, message){
    msgOk.classList.remove('show');
    msgErr.classList.remove('show');
    if(type === 'ok') msgOk.classList.add('show');
    if(type === 'err'){ errTxt.textContent = message || 'مشکلی پیش اومد.'; msgErr.classList.add('show'); }
  }

  // ── Validate ──────────────────────────────
  function validate(){
    const fields = [...form.querySelectorAll('input:not([name="_gotcha"]),textarea')];
    let ok = true;
    fields.forEach(f => {
      const fg = f.closest('.fg');
      if(!fg) return;
      if(!f.value.trim() || (f.type==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value))){
        fg.classList.add('shake');
        setTimeout(()=> fg.classList.remove('shake'), 600);
        ok = false;
      }
    });
    return ok;
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    msgOk.classList.remove('show'); msgErr.classList.remove('show');

    // ── Honeypot check ──
    const hp = form.querySelector('input[name="_gotcha"]');
    if(hp && hp.value){ console.warn('🍯 Bot detected'); return; }

    if(!validate()) return;

    setLoading(true);

    // ── ارسال به Formspree ──
    const data = new FormData(form);

    try{
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if(res.ok){
        showMsg('ok');
        form.reset();
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        setTimeout(()=> btn.style.background = '', 3500);
      } else {
        const body = await res.json().catch(()=>({}));
        const msg = body?.errors?.map(x=>x.message).join(' ') || 'مشکلی در ارسال پیش اومد.';
        showMsg('err', msg);
      }
    } catch(_){
      showMsg('err','اتصال اینترنت رو بررسی کن و دوباره امتحان کن.');
    } finally {
      setLoading(false);
    }
  });
})();

/* ════════════════════════════════════════════
   SERVICES ACCORDION (mobile only)
════════════════════════════════════════════ */
function toggleSvc(head){
  if(window.innerWidth > 768) return;
  const card = head.closest('.svc');
  const isOpen = card.classList.contains('open');
  // بستن همه
  document.querySelectorAll('.svc').forEach(c => c.classList.remove('open'));
  // باز کردن کلیکی
  if(!isOpen) card.classList.add('open');
}

/* ════════════════════════════════════════════
   PORTFOLIO SCROLL DOTS (mobile only)
════════════════════════════════════════════ */
(function(){
  const grid = document.querySelector('.pfg');
  const dotsWrap = document.getElementById('pf-dots');
  if(!grid || !dotsWrap) return;

  const cards = [...grid.querySelectorAll('.pfc')];

  function buildDots(){
    if(window.innerWidth > 768){ dotsWrap.innerHTML=''; return; }
    dotsWrap.innerHTML = cards.map((_,i)=>
      `<button class="pf-dot${i===0?' on':''}" aria-label="پروژه ${i+1}" onclick="scrollToCard(${i})"></button>`
    ).join('');
  }

  window.scrollToCard = function(i){
    const card = cards[i];
    if(card) grid.scrollTo({left: card.offsetLeft - 16, behavior:'smooth'});
  };

  // آپدیت dot فعال با scroll
  grid.addEventListener('scroll', ()=>{
    if(window.innerWidth > 768) return;
    const mid = grid.scrollLeft + grid.clientWidth/2;
    let active = 0;
    cards.forEach((c,i)=>{ if(c.offsetLeft <= mid) active = i; });
    dotsWrap.querySelectorAll('.pf-dot').forEach((d,i)=> d.classList.toggle('on', i===active));
  }, {passive:true});

  buildDots();
  window.addEventListener('resize', buildDots);
})();

/* ════════════════════════════════════════════
   YEAR
════════════════════════════════════════════ */
document.getElementById('yr').textContent=new Date().getFullYear();

/* ════════════════════════════════════════════
   PARALLAX FLOATERS on scroll
════════════════════════════════════════════ */
(function(){
  const floaters = [...document.querySelectorAll('.floater')];
  if(!floaters.length) return;
  let ticking = false;
  function update(){
    const s = window.scrollY;
    floaters.forEach((f,i)=>{
      f.style.transform = `translateY(${s*(0.05*(i%3+1))}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if(window.innerWidth <= 768) return; // floater ها روی موبایل مخفی‌ان، کاری لازم نیست
    if(!ticking){
      ticking = true;
      requestAnimationFrame(update);
    }
  }, {passive:true});
})();

/* ════════════════════════════════════════════
   THREE.JS — Interactive Torus Scene
════════════════════════════════════════════ */
(function(){
  if(typeof THREE==='undefined')return;
  const canvas=document.getElementById('hc');
  if(!canvas)return;

  const W=canvas.parentElement.offsetWidth||480;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(W,W);

  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(45,1,0.1,100);
  cam.position.set(0,0,5);

  // Main wireframe torus
  const tGeo=new THREE.TorusGeometry(1.6,0.55,38,110);
  const tMat=new THREE.MeshBasicMaterial({color:0x6366f1,wireframe:true,transparent:true,opacity:.75});
  const torus=new THREE.Mesh(tGeo,tMat);
  scene.add(torus);

  // Inner spinning torus (different axis)
  const t2Mat=new THREE.MeshBasicMaterial({color:0xa855f7,wireframe:true,transparent:true,opacity:.42});
  const torus2=new THREE.Mesh(new THREE.TorusGeometry(1.0,0.3,24,70),t2Mat);
  torus2.rotation.x=Math.PI/2;
  scene.add(torus2);

  // Icosahedron at center
  const iMat=new THREE.MeshBasicMaterial({color:0x22d3ee,wireframe:true,transparent:true,opacity:.32});
  const ico=new THREE.Mesh(new THREE.IcosahedronGeometry(0.68,1),iMat);
  scene.add(ico);

  // Floating particles around torus
  const N=420;
  const pos=new Float32Array(N*3);
  const velY=new Float32Array(N);
  for(let i=0;i<N;i++){
    const ang=Math.random()*Math.PI*2;
    const rad=1.6+(Math.random()-.5)*2.6;
    pos[i*3]=Math.cos(ang)*rad;
    pos[i*3+1]=(Math.random()-.5)*3;
    pos[i*3+2]=Math.sin(ang)*rad;
    velY[i]=(Math.random()-.5)*.004;
  }
  const pGeo=new THREE.BufferGeometry();
  pGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const pMat=new THREE.PointsMaterial({color:0x22d3ee,size:0.024,transparent:true,opacity:.75});
  const pts=new THREE.Points(pGeo,pMat);
  scene.add(pts);

  // Mouse interaction
  let tRx=0,tRy=0;
  canvas.addEventListener('mousemove',e=>{
    const r=canvas.getBoundingClientRect();
    tRx=((e.clientY-r.top)/r.height-.5)*1.8;
    tRy=((e.clientX-r.left)/r.width-.5)*1.8;
  });
  canvas.addEventListener('mouseleave',()=>{tRx=0;tRy=0});
  canvas.addEventListener('touchmove',e=>{
    const t=e.touches[0],r=canvas.getBoundingClientRect();
    tRx=((t.clientY-r.top)/r.height-.5)*1.8;
    tRy=((t.clientX-r.left)/r.width-.5)*1.8;
  },{passive:true});

  let fr=0;
  let visible=true;
  let rafId=null;

  const visObs=new IntersectionObserver(es=>{
    visible = es[0].isIntersecting;
    if(visible && rafId===null) rafId=requestAnimationFrame(render);
  },{threshold:0});
  visObs.observe(canvas);

  function render(){
    if(!visible){ rafId=null; return; }
    rafId=requestAnimationFrame(render);
    fr+=0.009;

    // Smooth mouse follow
    torus.rotation.x+=(tRx-torus.rotation.x)*.07;
    torus.rotation.y+=(tRy-torus.rotation.y)*.07;
    torus.rotation.y+=0.004;

    torus2.rotation.y=fr*.55;
    torus2.rotation.z=fr*.32;

    ico.rotation.x=fr*.45;
    ico.rotation.y=fr*.7;

    pts.rotation.y=fr*.035;
    pts.rotation.x=fr*.016;

    // Animate particle Y positions (float up/down)
    const pa=pGeo.attributes.position;
    for(let i=0;i<N;i++){
      pa.array[i*3+1]+=velY[i];
      if(Math.abs(pa.array[i*3+1])>1.6)velY[i]*=-1;
    }
    pa.needsUpdate=true;

    // Cycle hue on torus
    const h=(fr*22)%360;
    tMat.color.setHSL(h/360,.8,.62);
    t2Mat.color.setHSL((h+120)/360,.8,.62);
    iMat.color.setHSL((h+240)/360,.8,.66);

    renderer.render(scene,cam);
  }
  render();

  // Responsive resize
  new ResizeObserver(()=>{
    const w=canvas.parentElement.offsetWidth||480;
    renderer.setSize(w,w);
  }).observe(canvas.parentElement);
})();

/* console brand */
console.log('%c🚀 حمیدرضا محمدی | Full-Stack Web Developer','color:#6366f1;font-size:16px;font-weight:bold');
console.log('%chamidreza2m@gamil.com | 09300208711','color:#22d3ee;font-size:13px');
