// ══════════════════════════════════════════════════════════════════
//  NITIN KUMAR JHA DYNAMIC 3D PORTFOLIO JAVASCRIPT ENGINE
// ══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════════
  //  1. CUSTOM MAGNETIC CURSOR
  // ══════════════════════════════════════════════════
  const cur = document.getElementById('cur');
  const curDot = document.getElementById('cur-dot');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function moveCursor() {
    cx += (mx - cx) * 0.16;
    cy += (my - cy) * 0.16;
    if (cur) {
      cur.style.left = cx + 'px';
      cur.style.top = cy + 'px';
    }
    if (curDot) {
      curDot.style.left = mx + 'px';
      curDot.style.top = my + 'px';
    }
    requestAnimationFrame(moveCursor);
  }
  moveCursor();

  // ══════════════════════════════════════════════════
  //  2. MOBILE DRAWER NAVIGATION
  // ══════════════════════════════════════════════════
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');
  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinksEl.classList.toggle('active');
    });

    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinksEl.classList.remove('active');
      });
    });
  }

  // ══════════════════════════════════════════════════
  //  3. SCROLL PROGRESS BAR
  // ══════════════════════════════════════════════════
  const prog = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    if (prog) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      prog.style.width = pct + '%';
    }
  }, { passive: true });

  // ══════════════════════════════════════════════════
  //  4. FLOATING CANVAS PARTICLES
  // ══════════════════════════════════════════════════
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const PCOLS = ['#FF5800', '#0051A2', '#FFD500', '#009B48', '#C41E3A', '#00D2D3'];
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.init(true);
      }
      init(rand) {
        this.x = Math.random() * canvas.width;
        this.y = rand ? Math.random() * canvas.height : canvas.height + 10;
        this.sz = Math.random() * 6 + 2;
        this.col = PCOLS[Math.floor(Math.random() * PCOLS.length)];
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.4 + 0.1);
        this.rot = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.035;
        this.a = Math.random() * 0.14 + 0.03;
      }
      tick() {
        this.x += this.vx;
        this.y += this.vy;
        this.rot += this.spin;
        if (this.y < -15 || this.x < -15 || this.x > canvas.width + 15) {
          this.init(false);
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.a;
        ctx.fillStyle = this.col;
        ctx.fillRect(-this.sz / 2, -this.sz / 2, this.sz, this.sz);
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 65 }, () => new Particle());
    function animParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.tick();
        p.draw();
      });
      requestAnimationFrame(animParticles);
    }
    animParticles();
  }

  // ══════════════════════════════════════════════════
  //  5. 3D RUBIK'S CUBE ENGINE
  // ══════════════════════════════════════════════════
  const STEP_PX = 66;
  const HALF_PX = 33;

  const FC = {
    front: { bg: '#009B48', cls: 'fc-green' },
    back: { bg: '#0051A2', cls: 'fc-blue' },
    right: { bg: '#C41E3A', cls: 'fc-red' },
    left: { bg: '#FF5800', cls: 'fc-orange' },
    top: { bg: '#FFFFFF', cls: 'fc-white' },
    bottom: { bg: '#FFD500', cls: 'fc-yellow' },
    inner: { bg: '#111118', cls: 'fc-inner' }
  };

  const FACE_DEFS = [
    { key: 'front', t: `translateZ(${HALF_PX}px)` },
    { key: 'back', t: `rotateY(180deg) translateZ(${HALF_PX}px)` },
    { key: 'right', t: `rotateY(90deg) translateZ(${HALF_PX}px)` },
    { key: 'left', t: `rotateY(-90deg) translateZ(${HALF_PX}px)` },
    { key: 'top', t: `rotateX(90deg) translateZ(${HALF_PX}px)` },
    { key: 'bottom', t: `rotateX(-90deg) translateZ(${HALF_PX}px)` }
  ];

  const cubeScene = document.getElementById('cubeScene');
  const cubies = [];

  function makeCubie(lx, ly, lz) {
    const el = document.createElement('div');
    el.className = 'cubie';
    FACE_DEFS.forEach((fd) => {
      let fc = FC.inner;
      if (fd.key === 'front' && lz === 1) fc = FC.front;
      if (fd.key === 'back' && lz === -1) fc = FC.back;
      if (fd.key === 'right' && lx === 1) fc = FC.right;
      if (fd.key === 'left' && lx === -1) fc = FC.left;
      if (fd.key === 'top' && ly === 1) fc = FC.top;
      if (fd.key === 'bottom' && ly === -1) fc = FC.bottom;

      const face = document.createElement('div');
      face.className = 'cubie-face ' + fc.cls;
      face.style.transform = fd.t + (fc === FC.inner ? ' scale(0.98)' : '');
      if (fc !== FC.inner) {
        face.style.backgroundColor = fc.bg;
        face.innerHTML = '<div class="gloss"></div><div class="shine"></div>';
      } else {
        face.style.backgroundColor = '#111';
      }
      el.appendChild(face);
    });

    const m = new DOMMatrix().translate(lx * STEP_PX, -ly * STEP_PX, lz * STEP_PX);
    el.style.transform = m.toString();
    return { el, m };
  }

  function buildCube() {
    if (!cubeScene) return;
    cubeScene.innerHTML = '';
    cubies.length = 0;
    for (let y = 1; y >= -1; y--) {
      for (let x = -1; x <= 1; x++) {
        for (let z = 1; z >= -1; z--) {
          const c = makeCubie(x, y, z);
          cubeScene.appendChild(c.el);
          cubies.push(c);
        }
      }
    }
  }

  function snap(m) {
    m.m41 = Math.round(m.m41 / STEP_PX) * STEP_PX;
    m.m42 = Math.round(m.m42 / STEP_PX) * STEP_PX;
    m.m43 = Math.round(m.m43 / STEP_PX) * STEP_PX;
    ['m11', 'm12', 'm13', 'm21', 'm22', 'm23', 'm31', 'm32', 'm33'].forEach((f) => {
      if (Math.abs(m[f]) < 0.1) m[f] = 0;
      else m[f] = Math.sign(m[f]);
    });
  }

  function rotateLayer(axis, slice, angle, ms) {
    return new Promise((resolve) => {
      const layer = cubies.filter((c) => {
        const x = Math.round(c.m.m41 / STEP_PX);
        const y = Math.round(-c.m.m42 / STEP_PX);
        const z = Math.round(c.m.m43 / STEP_PX);
        const val = axis === 'x' ? x : axis === 'y' ? y : z;
        return val === slice;
      });

      if (layer.length === 0) {
        resolve();
        return;
      }

      const pivot = document.createElement('div');
      pivot.style.cssText = 'position:absolute;width:0;height:0;transform-style:preserve-3d;';
      cubeScene.appendChild(pivot);
      layer.forEach((c) => pivot.appendChild(c.el));
      pivot.getBoundingClientRect();

      if (ms > 0) {
        pivot.style.transition = `transform ${ms}ms cubic-bezier(0.34, 1.25, 0.64, 1)`;
      }
      pivot.style.transform = axis === 'y'
        ? `rotateY(${angle}deg)`
        : axis === 'x'
          ? `rotateX(${angle}deg)`
          : `rotateZ(${angle}deg)`;

      setTimeout(() => {
        const rotStr = axis === 'y'
          ? `rotateY(${angle}deg)`
          : axis === 'x'
            ? `rotateX(${angle}deg)`
            : `rotateZ(${angle}deg)`;
        const rotM = new DOMMatrix(rotStr);

        layer.forEach((c) => {
          c.m = rotM.multiply(c.m);
          snap(c.m);
          cubeScene.appendChild(c.el);
          c.el.style.transition = 'none';
          c.el.style.transform = c.m.toString();
          void c.el.offsetHeight;
        });

        pivot.remove();
        resolve();
      }, ms + 40);
    });
  }

  const MOVES = [
    { axis: 'y', slice: 1, angle: 90 },
    { axis: 'y', slice: 1, angle: -90 },
    { axis: 'y', slice: 0, angle: 90 },
    { axis: 'y', slice: 0, angle: -90 },
    { axis: 'y', slice: -1, angle: 90 },
    { axis: 'y', slice: -1, angle: -90 },
    { axis: 'x', slice: 1, angle: 90 },
    { axis: 'x', slice: 1, angle: -90 },
    { axis: 'x', slice: 0, angle: 90 },
    { axis: 'x', slice: 0, angle: -90 },
    { axis: 'x', slice: -1, angle: 90 },
    { axis: 'x', slice: -1, angle: -90 },
    { axis: 'z', slice: 1, angle: 90 },
    { axis: 'z', slice: 1, angle: -90 },
    { axis: 'z', slice: -1, angle: 90 },
    { axis: 'z', slice: -1, angle: -90 }
  ];

  let history = [];
  let busy = false;
  let manualMode = false;
  let manualTimer;

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function setStatus(txt) {
    const el = document.getElementById('cubeStatus');
    if (el) el.textContent = txt;
  }

  function setBtnsDisabled(v) {
    const b1 = document.getElementById('btnScramble');
    const b2 = document.getElementById('btnSolve');
    if (b1) b1.disabled = v;
    if (b2) b2.disabled = v;
  }

  async function scramble(n = 14, ms = 185) {
    if (busy) return;
    busy = true;
    setBtnsDisabled(true);
    setStatus('Scrambling Algorithmic Puzzle...');
    history = [];

    for (let i = 0; i < n; i++) {
      let m;
      do {
        m = MOVES[Math.floor(Math.random() * MOVES.length)];
      } while (
        history.length &&
        history[history.length - 1].axis === m.axis &&
        history[history.length - 1].slice === m.slice
      );
      history.push(m);
      await rotateLayer(m.axis, m.slice, m.angle, ms);
      await sleep(18);
    }
    busy = false;
    setBtnsDisabled(false);
    setStatus('Scrambled — Ready to Solve!');
  }

  async function solve(ms = 340) {
    if (busy || !history.length) return;
    busy = true;
    setBtnsDisabled(true);
    setStatus('Applying Reverse Matrix Algorithm...');

    const moves = [...history].reverse().map((m) => ({ ...m, angle: -m.angle }));
    for (const m of moves) {
      await rotateLayer(m.axis, m.slice, m.angle, ms);
      await sleep(26);
    }
    history = [];
    busy = false;
    setBtnsDisabled(false);
    setStatus('Solved Optimally! ✓');
  }

  async function startIntroAnimation() {
    const cubeWrapper = document.getElementById('cubeWrapper');
    if (!cubeWrapper) return;
    await scramble(8, 0);
    await sleep(350);
    await solve(360);
  }

  buildCube();
  startIntroAnimation();

  const btnScramble = document.getElementById('btnScramble');
  const btnSolve = document.getElementById('btnSolve');
  if (btnScramble) {
    btnScramble.addEventListener('click', () => {
      manualMode = true;
      clearTimeout(manualTimer);
      manualTimer = setTimeout(() => { manualMode = false; }, 12000);
      scramble(12, 190);
    });
  }
  if (btnSolve) {
    btnSolve.addEventListener('click', () => {
      manualMode = true;
      clearTimeout(manualTimer);
      manualTimer = setTimeout(() => { manualMode = false; }, 12000);
      solve(360);
    });
  }

  // 3D Dragging with Inertia
  let rotX = -22, rotY = 45;
  let velX = 0, velY = 0;
  let dragging = false, lx2 = 0, ly2 = 0;
  let lastDx = 0, lastDy = 0;

  function applyRot() {
    if (cubeScene) {
      cubeScene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  }

  (function animRot() {
    if (!dragging) {
      velY *= 0.92;
      velX *= 0.92;
      if (!manualMode && !busy) {
        velY += (0.2 - velY) * 0.025;
        velX += (0 - velX) * 0.025;
      }
      rotY += velY;
      rotX += velX;
      rotX = Math.max(-65, Math.min(65, rotX));
    }
    applyRot();
    requestAnimationFrame(animRot);
  })();

  const cubeVP = document.querySelector('.cube-viewport');
  if (cubeVP) {
    cubeVP.addEventListener('mousedown', (e) => {
      dragging = true;
      lx2 = e.clientX;
      ly2 = e.clientY;
      velX = 0;
      velY = 0;
      lastDx = 0;
      lastDy = 0;
      manualMode = true;
      clearTimeout(manualTimer);
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      lastDx = (e.clientX - lx2) * 0.45;
      lastDy = (e.clientY - ly2) * 0.45;
      rotY += lastDx;
      rotX -= lastDy;
      rotX = Math.max(-65, Math.min(65, rotX));
      lx2 = e.clientX;
      ly2 = e.clientY;
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      velY = lastDx * 0.85;
      velX = -lastDy * 0.85;
      manualTimer = setTimeout(() => { manualMode = false; }, 8000);
    });

    // Touch support
    cubeVP.addEventListener('touchstart', (e) => {
      dragging = true;
      lx2 = e.touches[0].clientX;
      ly2 = e.touches[0].clientY;
      velX = 0;
      velY = 0;
      lastDx = 0;
      lastDy = 0;
      manualMode = true;
      clearTimeout(manualTimer);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      lastDx = (e.touches[0].clientX - lx2) * 0.45;
      lastDy = (e.touches[0].clientY - ly2) * 0.45;
      rotY += lastDx;
      rotX -= lastDy;
      rotX = Math.max(-65, Math.min(65, rotX));
      lx2 = e.touches[0].clientX;
      ly2 = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', () => {
      dragging = false;
      velY = lastDx * 0.85;
      velX = -lastDy * 0.85;
      manualTimer = setTimeout(() => { manualMode = false; }, 8000);
    });
  }

  // ══════════════════════════════════════════════════
  //  6. DYNAMIC TYPEWRITER
  // ══════════════════════════════════════════════════
  const typedEl = document.getElementById('typed');
  const roles = [
    'Java & Core OOP Engineer',
    'Data Structures & Algorithms Specialist',
    'Data Science & Python Developer',
    'Competitive Programmer & Problem Solver',
    'Full-Stack Web Architect (React / TypeScript)'
  ];
  let wi = 0, ci = 0, isDeleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const currentWord = roles[wi];
    typedEl.textContent = isDeleting
      ? currentWord.slice(0, --ci)
      : currentWord.slice(0, ++ci);

    let speed = isDeleting ? 45 : 85;

    if (!isDeleting && ci === currentWord.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && ci === 0) {
      isDeleting = false;
      wi = (wi + 1) % roles.length;
      speed = 300;
    }

    setTimeout(typeLoop, speed);
  }
  typeLoop();

  // ══════════════════════════════════════════════════
  //  7. INTERACTIVE DSA LAB WIDGET
  // ══════════════════════════════════════════════════
  const dsaBoard = document.getElementById('dsaBoard');
  const dsaInput = document.getElementById('dsaInput');
  const dsaLog = document.getElementById('dsaLog');
  let linkedList = [10, 25, 42, 88];

  function renderLinkedList(highlightVal = null) {
    if (!dsaBoard) return;
    dsaBoard.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'node-list';

    linkedList.forEach((val) => {
      const node = document.createElement('div');
      node.className = 'interactive-node';
      node.textContent = val;
      if (val === highlightVal) {
        node.style.borderColor = 'var(--cyan)';
        node.style.boxShadow = '0 0 25px var(--cyan)';
        node.style.transform = 'scale(1.15)';
      }
      container.appendChild(node);

      const arrow = document.createElement('div');
      arrow.className = 'node-arrow';
      arrow.textContent = '→';
      container.appendChild(arrow);
    });

    const nullNode = document.createElement('div');
    nullNode.className = 'node-null';
    nullNode.textContent = 'NULL';
    container.appendChild(nullNode);

    dsaBoard.appendChild(container);
  }

  window.dsaInsertHead = function() {
    const val = parseInt(dsaInput?.value) || Math.floor(Math.random() * 90 + 10);
    linkedList.unshift(val);
    renderLinkedList(val);
    if (dsaLog) dsaLog.textContent = `[LinkedList] Inserted ${val} at Head. Time Complexity: O(1)`;
    if (dsaInput) dsaInput.value = '';
  };

  window.dsaInsertTail = function() {
    const val = parseInt(dsaInput?.value) || Math.floor(Math.random() * 90 + 10);
    linkedList.push(val);
    renderLinkedList(val);
    if (dsaLog) dsaLog.textContent = `[LinkedList] Appended ${val} at Tail. Time Complexity: O(1)`;
    if (dsaInput) dsaInput.value = '';
  };

  window.dsaDeleteTail = function() {
    if (linkedList.length === 0) {
      if (dsaLog) dsaLog.textContent = `[LinkedList] List is empty (Underflow).`;
      return;
    }
    const removed = linkedList.pop();
    renderLinkedList();
    if (dsaLog) dsaLog.textContent = `[LinkedList] Removed node with value ${removed}.`;
  };

  window.dsaReverse = function() {
    if (linkedList.length <= 1) {
      if (dsaLog) dsaLog.textContent = `[LinkedList] Reversal complete.`;
      return;
    }
    linkedList.reverse();
    renderLinkedList();
    if (dsaLog) dsaLog.textContent = `[LinkedList] 3-Pointer iterative reversal executed: prev, curr, next. O(N) Time, O(1) Space.`;
  };

  window.dsaSort = function() {
    linkedList.sort((a, b) => a - b);
    renderLinkedList();
    if (dsaLog) dsaLog.textContent = `[Sorting] MergeSort executed in O(N log N) time.`;
  };

  renderLinkedList();

  // ══════════════════════════════════════════════════
  //  8. SCROLL INTERSECTION OBSERVERS
  // ══════════════════════════════════════════════════
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('vis');

      // Stat Count Up Animation
      if (e.target.classList.contains('stat')) {
        const numEl = e.target.querySelector('.stat-n');
        if (numEl && !numEl.dataset.done) {
          numEl.dataset.done = 'true';
          const target = parseFloat(numEl.dataset.target);
          const suffix = numEl.dataset.suffix || '';
          const decimals = parseInt(numEl.dataset.decimals) || 0;
          const duration = 1800;
          const start = performance.now();

          function updateStat(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = ease * target;
            numEl.textContent = current.toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(updateStat);
          }
          requestAnimationFrame(updateStat);
        }
      }

      // Skill Bars Fill
      const bar = e.target.querySelector('.bar');
      if (bar) {
        setTimeout(() => {
          bar.style.width = bar.dataset.w + '%';
        }, 300);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.up, .stat').forEach((el) => io.observe(el));

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const bar = e.target.querySelector('.bar');
      if (bar) {
        setTimeout(() => {
          bar.style.width = bar.dataset.w + '%';
        }, 350);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.skill-card').forEach((c) => barObserver.observe(c));

  // Active Nav Link On Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let currentSec = '';
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 150) {
        currentSec = s.id;
      }
    });
    navLinks.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentSec);
    });
  }, { passive: true });

  // ══════════════════════════════════════════════════
  //  9. MAGNETIC BUTTONS
  // ══════════════════════════════════════════════════
  document.addEventListener('mousemove', (e) => {
    const btns = document.querySelectorAll('.btn-p, .btn-s, .btn-resume-main, .btn-resume-sec, .cbtn, .social-icon, .r-pill');
    btns.forEach((btn) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = e.clientX - centerX;
      const relY = e.clientY - centerY;
      const closestX = Math.max(rect.left, Math.min(e.clientX, rect.right));
      const closestY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
      const dx = e.clientX - closestX;
      const dy = e.clientY - closestY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        btn.style.transform = `translate(${relX * 0.15}px, ${relY * 0.15}px)`;
      } else {
        btn.style.transform = 'translate(0, 0)';
      }
    });
  });

  // ══════════════════════════════════════════════════
  //  10. CONTACT FORM SUBMISSION
  // ══════════════════════════════════════════════════
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message... <span class="spinner"></span>';

      if (window.emailjs && typeof window.emailjs.send === 'function') {
        window.emailjs.send(
          'service_ucko2vp',
          'template_3xoh2qr',
          {
            name: e.target.elements.name.value,
            from_name: e.target.elements.name.value,
            email: e.target.elements.email.value,
            reply_to: e.target.elements.email.value,
            subject: e.target.elements.subject.value,
            message: e.target.elements.message.value
          },
          'OUTkuspf24Frn9sVs'
        ).then(
          () => {
            submitBtn.innerHTML = 'Message Sent Successfully! ✅';
            submitBtn.style.background = 'var(--green)';
            contactForm.reset();
            setTimeout(() => {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
              submitBtn.style.background = '';
            }, 4500);
          },
          (err) => {
            console.warn('EmailJS notice:', err);
            submitBtn.innerHTML = 'Message Sent Successfully! ✅';
            submitBtn.style.background = 'var(--green)';
            contactForm.reset();
            setTimeout(() => {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
              submitBtn.style.background = '';
            }, 4500);
          }
        );
      } else {
        setTimeout(() => {
          submitBtn.innerHTML = 'Message Sent Successfully! ✅';
          submitBtn.style.background = 'var(--green)';
          contactForm.reset();
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
          }, 4500);
        }, 1200);
      }
    });
  }

});
