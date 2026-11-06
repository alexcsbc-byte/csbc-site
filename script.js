const menu = document.getElementById('menu');
const toggle = document.getElementById('toggle');
toggle.addEventListener('click', () => {
  menu.classList.toggle('open');
  toggle.classList.toggle('on');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.classList.remove('on');
}));

// Фільтр спеціальностей
const items = document.querySelectorAll('#programs-list li');
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#filters button').forEach(b => b.classList.toggle('on', b === btn));
  const f = btn.dataset.f;
  items.forEach(li => li.classList.toggle('hide', f !== 'all' && li.dataset.c !== f));
});

// Плавна поява блоків
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.sec-title, .prose, .programs, .steps li, .news article, .facts-row div')
  .forEach(el => { el.classList.add('reveal'); io.observe(el); });

document.getElementById('y').textContent = new Date().getFullYear();

// Прогрес прокрутки
const bar = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / h * 100) + '%';
}, { passive: true });

// Заголовок по словах
const h1 = document.querySelector('h1');
h1.innerHTML = h1.innerHTML.split(' ').map((w, i) => `<span class="w" style="transition-delay:${i * 70}ms">${w}</span>`).join(' ');
requestAnimationFrame(() => setTimeout(() => h1.classList.add('go'), 50));

// Біжучий рядок — дублюємо для безшовності
const track = document.querySelector('.ticker-track');
track.innerHTML += track.innerHTML;

// Лічильники
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.to, from = end > 100 ? end - 60 : 0, t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / 1400, 1), k = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (end - from) * k);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
  cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-to]').forEach(el => cio.observe(el));

// Лайтбокс галереї
const pics = [...document.querySelectorAll('.gallery img')];
const lb = document.getElementById('lb'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lb-cap');
let li = 0;
const show = i => { li = (i + pics.length) % pics.length; lbImg.src = pics[li].src; lbCap.textContent = pics[li].alt; };
pics.forEach((p, i) => p.addEventListener('click', () => { show(i); lb.classList.add('open'); }));
lb.querySelector('.lb-prev').onclick = e => { e.stopPropagation(); show(li - 1); };
lb.querySelector('.lb-next').onclick = e => { e.stopPropagation(); show(li + 1); };
lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-x')) lb.classList.remove('open'); });
addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') lb.classList.remove('open');
  if (e.key === 'ArrowLeft') show(li - 1);
  if (e.key === 'ArrowRight') show(li + 1);
});
