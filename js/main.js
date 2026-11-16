(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;

  $('#year').textContent = new Date().getFullYear();

  // Theme toggle
  var themeBtn = $('#themeToggle');
  function syncIcon() { themeBtn.innerHTML = root.dataset.theme === 'dark' ? '<i class="fa fa-sun-o"></i>' : '<i class="fa fa-moon-o"></i>'; }
  syncIcon();
  themeBtn.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    syncIcon();
  });

  // Mobile menu
  var menuBtn = $('#menuBtn'), links = $('#navLinks');
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('a', links).forEach(function (a) { a.addEventListener('click', function () { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }); });

  // Scroll state: nav background, back-to-top, active link
  var nav = $('#nav'), toTop = $('#toTop');
  var sections = $$('main section[id]');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 500);
    var current = '';
    sections.forEach(function (s) { if (y + 120 >= s.offsetTop) current = s.id; });
    $$('a', links).forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0 }); });

  // Reveal on scroll + counters
  function countUp(el) {
    var end = +el.dataset.count, n = 0, step = Math.max(1, Math.ceil(end / 30));
    var t = setInterval(function () { n = Math.min(end, n + step); el.textContent = n + (n === end && end > 9 ? '+' : ''); if (n === end) clearInterval(t); }, 40);
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 }) : null;
  $$('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  // Typing effect
  var roles = ['Aspiring Data Scientist', 'Recommendation Systems', 'Full-Stack Developer', 'Data Storyteller'];
  var typed = $('#typed'), ri = 0, ci = roles[0].length, del = true;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTimeout(function tick() {
      var word = roles[ri];
      ci += del ? -1 : 1;
      typed.textContent = word.slice(0, ci);
      var wait = del ? 40 : 80;
      if (!del && ci === word.length) { del = true; wait = 1800; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 300; }
      setTimeout(tick, wait);
    }, 2000);
  }

  // Project filters
  $$('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.filters button').forEach(function (x) { x.classList.toggle('active', x === b); });
      var f = b.dataset.filter;
      $$('.project').forEach(function (p) {
        p.classList.toggle('hide', f !== 'all' && p.dataset.tags.split(' ').indexOf(f) < 0);
      });
    });
  });

  // Copy email
  var toast = $('#toast');
  function showToast(msg) { toast.textContent = msg; toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 1800); }
  $('#copyEmail').addEventListener('click', function () {
    var email = 'thonkrath@gmail.com';
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(function () { showToast('Email copied'); }, function () { showToast(email); });
    else showToast(email);
  });
})();
