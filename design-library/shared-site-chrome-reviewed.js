(() => {
  'use strict';
  const nav = document.querySelector('nav.rp-site-nav');
  if (!nav) return;
  const roots = [...nav.querySelectorAll('.rp-nav-desktop > .rp-nav-group, .rp-mobile-menu')];
  roots.forEach(menu => {
    const summary = menu.querySelector(':scope > summary');
    summary?.setAttribute('aria-expanded', String(menu.open));
    menu.addEventListener('toggle', () => {
      summary?.setAttribute('aria-expanded', String(menu.open));
      if (menu.open) roots.forEach(other => { if (other !== menu) other.open = false; });
    });
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) roots.forEach(menu => { menu.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = roots.find(menu => menu.open);
    if (!open) return;
    open.open = false;
    open.querySelector(':scope > summary')?.focus();
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => roots.forEach(menu => { menu.open = false; }));
  });
  const currentPath = decodeURIComponent(location.pathname);
  document.querySelectorAll('.rp-site-nav a, .rp-site-footer a').forEach(link => {
    const destination = new URL(link.href, location.href);
    if (!destination.hash && decodeURIComponent(destination.pathname) === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
