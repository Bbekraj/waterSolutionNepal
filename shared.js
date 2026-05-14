document.addEventListener('DOMContentLoaded',function(){
  if(typeof AOS!=='undefined')AOS.init({duration:820,easing:'ease-out-cubic',once:true,offset:70});
  const nav=document.getElementById('wsn-nav');
  if(nav)window.addEventListener('scroll',()=>nav.classList.toggle('stuck',window.scrollY>60));
  document.querySelectorAll('.tslider').forEach(sl=>{
    let dn=false,sx,sc;
    sl.addEventListener('mousedown',e=>{dn=true;sx=e.pageX-sl.offsetLeft;sc=sl.scrollLeft;sl.style.cursor='grabbing';});
    ['mouseleave','mouseup'].forEach(ev=>sl.addEventListener(ev,()=>{dn=false;sl.style.cursor='grab';}));
    sl.addEventListener('mousemove',e=>{if(!dn)return;e.preventDefault();sl.scrollLeft=sc-(e.pageX-sl.offsetLeft-sx)*1.5;});
    sl.style.cursor='grab';
  });
  const cObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target,t=+el.dataset.t,sfx=el.dataset.suffix||'+';
      let s=null;
      (function step(ts){if(!s)s=ts;const p=Math.min((ts-s)/2400,1),v=Math.floor((1-Math.pow(1-p,4))*t);el.textContent=v.toLocaleString()+sfx;if(p<1)requestAnimationFrame(step);else el.textContent=t.toLocaleString()+sfx;})(performance.now());
      cObs.unobserve(el);
    });
  },{threshold:0.5});
  document.querySelectorAll('.ctr-num[data-t]').forEach(el=>cObs.observe(el));
  injectFooter();
});
function toggleNav(){const l=document.getElementById('navLinks');if(l)l.classList.toggle('open');}
function injectFooter(){
  const ph=document.getElementById('footer-placeholder');
  if(!ph)return;
  ph.innerHTML=`<footer class="wsn-footer">
  <canvas class="footer-wave-canvas" id="fwc"></canvas>
  
</footer>`;
  requestAnimationFrame(startFooterWave);
}
function startFooterWave(){
  const canvas=document.getElementById('fwc');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let t=0;
  function rsz(){canvas.width=canvas.offsetWidth||window.innerWidth;canvas.height=180;}
  rsz();window.addEventListener('resize',rsz);
  function wave(y,amp,freq,spd,al,col){
    ctx.beginPath();ctx.moveTo(0,canvas.height);
    const W=canvas.width;
    for(let x=0;x<=W;x+=3){
      const dy=Math.sin((x/W)*freq*Math.PI*2+t*spd)*amp
               +Math.sin((x/W)*freq*0.57*Math.PI*2+t*spd*1.6)*amp*0.38
               +Math.sin((x/W)*freq*1.35*Math.PI*2+t*spd*0.72)*amp*0.22;
      ctx.lineTo(x,y+dy);
    }
    ctx.lineTo(W,canvas.height);ctx.lineTo(0,canvas.height);ctx.closePath();
    ctx.fillStyle=col;ctx.globalAlpha=al;ctx.fill();
  }
  function foam(){
    for(let i=0;i<32;i++){
      const x=((i*97+t*18)%(canvas.width+40))-20;
      const y=50+Math.sin(t*0.85+i*0.52)*24;
      const r=1.8+Math.sin(t*1.4+i)*1.2;
      const a=0.05+Math.sin(t*2+i)*0.03;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=`rgba(15,240,200,${a})`;ctx.globalAlpha=1;ctx.fill();
    }
  }
  function drops(){
    for(let i=0;i<22;i++){
      const x=((i*149.5+t*22)%(canvas.width+20))-10;
      const ph=(i*0.618+t*0.28)%1;
      const y=6+ph*150;
      const r=1.0+Math.sin(t*2.2+i)*0.5;
      const a=Math.sin(ph*Math.PI)*0.42;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,194,255,${a})`;ctx.globalAlpha=1;ctx.fill();
    }
  }
  function crests(){
    for(let i=0;i<7;i++){
      const cx=((i*190+t*45)%(canvas.width+120))-60;
      const cy=56+Math.sin(t*0.9+i*0.7)*24;
      const rg=ctx.createRadialGradient(cx,cy,0,cx,cy,62);
      rg.addColorStop(0,'rgba(0,194,255,0.13)');rg.addColorStop(1,'transparent');
      ctx.fillStyle=rg;ctx.globalAlpha=0.75;
      ctx.beginPath();ctx.ellipse(cx,cy,62,20,0,0,Math.PI*2);ctx.fill();
    }
  }
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const g=ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,'rgba(3,14,37,0)');g.addColorStop(0.35,'rgba(3,14,37,0.1)');g.addColorStop(1,'#030E25');
    ctx.fillStyle=g;ctx.globalAlpha=1;ctx.fillRect(0,0,canvas.width,canvas.height);
    wave(88, 32,2.1,0.33,0.19,'#0B3D91');
    wave(98, 26,2.9,0.48,0.16,'#094f8f');
    wave(107,21,3.6,0.62,0.16,'#005a80');
    wave(115,17,4.4,0.79,0.20,'#006890');
    wave(123,12,5.3,1.02,0.28,'#004d70');
    wave(131, 8,6.4,1.28,0.50,'#003855');
    wave(139, 5,7.6,1.58,0.85,'#030E25');
    foam();drops();crests();
    ctx.globalAlpha=1;t+=0.007;
    requestAnimationFrame(loop);
  }
  loop();
}