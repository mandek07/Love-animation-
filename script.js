(() => {
  const particleArea = document.getElementById('particleArea');
  const bigHeart = document.getElementById('bigHeart');

  const rand = (min, max) => Math.random() * (max - min) + min;

  let lastBurstTime = 0;      // waktu terakhir burst
  const cooldown = 500;       // cooldown dalam ms (500 ms = 0.5 detik)

  function createParticle(xPercent, yPercent, sizeClass, noShadow = false) {
    const p = document.createElement('div');
    p.className = 'particle ' + sizeClass;
    p.style.left = `${xPercent}%`;
    p.style.top = `${yPercent}%`;

    if (noShadow) p.style.filter = 'none';

    const inner = document.createElement('div');
    inner.className = 'h';
    inner.style.background = `linear-gradient(135deg, rgba(255,92,138,1), rgba(255,155,179,1))`;
    p.appendChild(inner);

    const dur = rand(2200, 5000);
    const rot = rand(-30, 30);

    p.style.animationDuration = dur + 'ms';
    p.style.transform = `translateY(0) rotate(${rand(-10,10)}deg) scale(1)`;

    particleArea.appendChild(p);

    requestAnimationFrame(() => {
      p.classList.add('float-up');
      p.style.transform = `translateY(-10vh) rotate(${rot}deg)`;
    });

    setTimeout(() => {
      if (p && p.parentNode) p.parentNode.removeChild(p);
    }, dur + 100);
  }

  let gentleInterval = null;
  function startGentle() {
    if (gentleInterval) return;
    gentleInterval = setInterval(() => {
      const x = rand(10, 90);
      const y = rand(70, 95);
      const size = ['xs','s','m'][Math.floor(rand(0,3))];
      createParticle(x, y, size);
    }, 350);
  }

  function burstAt(clientX, clientY) {
    const now = Date.now();
    if (now - lastBurstTime < cooldown) return; // kalau belum lewat cooldown, skip
    lastBurstTime = now;

    const rect = particleArea.getBoundingClientRect();
    const xPercent = (clientX - rect.left) / rect.width * 100;
    const yPercent = (clientY - rect.top) / rect.height * 100;

    const count = Math.floor(rand(5, 8));
    for (let i=0; i<count; i++){
      const xJ = xPercent + rand(-6,6);
      const yJ = yPercent + rand(-4,4);
      const sizes = ['xs','s','m','l'];
      const size = sizes[Math.floor(rand(0,sizes.length))];

      setTimeout(() => createParticle(xJ, yJ, size, true), Math.floor(rand(0,120)));
    }

    bigHeart.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.15)' },
      { transform: 'scale(1)' }
    ], {
      duration: 420,
      easing: 'cubic-bezier(.2,.8,.2,1)'
    });
  }

  document.querySelector('.stage').addEventListener('click', (e) => {
    burstAt(e.clientX, e.clientY);
  });

  startGentle();

  setInterval(() => {
    const rect = bigHeart.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/3;
    for (let i=0;i<3;i++){
      setTimeout(()=> createParticle(
        (cx + rand(-20,20))/particleArea.clientWidth*100,
        (cy + rand(-10,20))/particleArea.clientHeight*100,
        ['s','m'][Math.floor(rand(0,2))]
      ), i*120);
    }
  }, 1800);

})();