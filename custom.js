// Footer wave animation (Canvas 2D)
  const footerCanvas = document.getElementById('footerWaveCanvas');
  const footerCtx = footerCanvas.getContext('2d');
  let fw, fh, ftime = 0;
  function resizeFooter() { fw = window.innerWidth; fh = 180; footerCanvas.width = fw; footerCanvas.height = fh; }
  window.addEventListener('resize', resizeFooter);
  resizeFooter();
  function drawFooterWave() {
    requestAnimationFrame(drawFooterWave);
    if (!footerCtx) return;
    footerCtx.clearRect(0, 0, fw, fh);
    footerCtx.fillStyle = "#021c2a";
    footerCtx.fillRect(0, 0, fw, fh);
    for (let i = 0; i < 3; i++) {
      footerCtx.beginPath();
      let amplitude = 16 + i * 8;
      let freq = 0.008;
      let yOffset = fh - 40 + i * 18;
      footerCtx.moveTo(0, yOffset);
      for (let x = 0; x <= fw; x += 20) {
        let y = yOffset + Math.sin(x * freq + ftime * 2 + i) * amplitude + Math.cos(x * 0.012 + ftime) * 6;
        footerCtx.lineTo(x, y);
      }
      footerCtx.lineTo(fw, fh);
      footerCtx.lineTo(0, fh);
      footerCtx.fillStyle = `rgba(0, 160, 210, ${0.14 - i * 0.03})`;
      footerCtx.fill();
    }
    ftime += 0.025;
  }
  drawFooterWave();
  
  // Counters
  const counters = document.querySelectorAll('.counter-number');
  const counterSpeed = 150;
  counters.forEach(c => { const update = () => { const target = parseInt(c.dataset.target); let val = parseInt(c.innerText); const inc = Math.ceil(target/35); if(val < target) { c.innerText = val + inc; setTimeout(update, 35); } else c.innerText = target; }; update(); });
