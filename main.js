
// ── AOS Init ──
AOS.init({ duration:800, easing:'ease-out-cubic', once:true, offset:80 });

// ── Navbar scroll ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ── Hero Canvas Wave ──
(function(){
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, t=0;
  function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  function drawWave(y, amp, freq, speed, alpha, color){
    ctx.beginPath();
    ctx.moveTo(0, h);
    for(let x=0;x<=w;x+=4){
      const dy = Math.sin((x/w)*freq*Math.PI*2 + t*speed) * amp
               + Math.sin((x/w)*freq*0.7*Math.PI*2 + t*speed*1.3) * amp*0.4;
      ctx.lineTo(x, y+dy);
    }
    ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
    ctx.fillStyle=color; ctx.globalAlpha=alpha; ctx.fill();
  }
  function loop(){
    ctx.clearRect(0,0,w,h); ctx.globalAlpha=1;
    drawWave(h*0.72, 28, 2.5, 0.4, 0.18, '#0B3D91');
    drawWave(h*0.78, 22, 3.1, 0.55, 0.14, '#00608a');
    drawWave(h*0.83, 16, 3.8, 0.7, 0.10, '#00C2FF');
    drawWave(h*0.88, 12, 4.5, 0.9, 0.07, '#0FF0C8');
    t+=0.008;
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── Particle Canvas ──
(function(){
  const canvas = document.getElementById('particles-bg');
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=document.getElementById('hero').offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  const particles = Array.from({length:60},()=>({
    x:Math.random()*1440,
    y:Math.random()*900,
    r:Math.random()*2.5+0.5,
    vx:(Math.random()-.5)*0.3,
    vy:-(Math.random()*0.6+0.2),
    alpha:Math.random()*0.6+0.1
  }));
  function loop(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.y<0){p.y=h;p.x=Math.random()*w;}
      if(p.x<0||p.x>w){p.x=Math.random()*w;}
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,194,255,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── Counter animation ──
function animateCounter(el, target, duration=2200){
  let start=0, startTime=null;
  const suffix = target >= 500 ? '+' : target >= 100 ? '+' : '+';
  function step(ts){
    if(!startTime) startTime=ts;
    const progress=Math.min((ts-startTime)/duration,1);
    const ease=1-Math.pow(1-progress,4);
    const val=Math.floor(ease*target);
    el.textContent=val.toLocaleString()+suffix;
    if(progress<1) requestAnimationFrame(step);
    else el.textContent=target.toLocaleString()+suffix;
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('.counter-num[data-target]');
const counterObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      animateCounter(e.target, parseInt(e.target.dataset.target));
      counterObs.unobserve(e.target);
    }
  });
}, {threshold:0.5});
counterEls.forEach(el=>counterObs.observe(el));

// ── Testimonial drag scroll ──
const slider = document.querySelector('.testi-slider');
let isDown=false, startX, scrollLeft;
slider.addEventListener('mousedown',e=>{ isDown=true; startX=e.pageX-slider.offsetLeft; scrollLeft=slider.scrollLeft; slider.style.cursor='grabbing'; });
slider.addEventListener('mouseleave',()=>{ isDown=false; slider.style.cursor='grab'; });
slider.addEventListener('mouseup',()=>{ isDown=false; slider.style.cursor='grab'; });
slider.addEventListener('mousemove',e=>{ if(!isDown)return; e.preventDefault(); const x=e.pageX-slider.offsetLeft; slider.scrollLeft=scrollLeft-(x-startX)*1.5; });
slider.style.cursor='grab';