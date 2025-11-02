/* ==================================================
   app JavaScript (progressive enhancement)
   - Menü (mobile) initialization
   - PWA install handling (A2HS)
   - Kontaktformular demo
   - Side navigation helpers
   - Lyrics toggle
   - Service Worker registration
   ==================================================
*/

/* ----------------------------------
   Service Worker Registrierung
---------------------------------- */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('service-worker.js')
    .then(reg => console.log('✅ Service Worker registriert:', reg.scope))
    .catch(err => console.error('❌ Service Worker Fehler:', err));
}

console.log('PWA läuft 🎉');


/* ----------------------------------
   Global: PWA deferred prompt holder
---------------------------------- */
let deferredPrompt;


/* ----------------------------------
   DOMContentLoaded — sichere Initialisierung
---------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // 1) Copyright Jahr setzen
  const yearElem = document.getElementById('year');
  if (yearElem) yearElem.textContent = new Date().getFullYear();

  // 2) Mobile Hamburger Menü
  function initMobileMenu() {
    const menuBtn = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    if (!menuBtn || !menu) return; // Nav noch nicht im DOM

    // Avoid duplicate listeners: replace with clone and re-query
    menuBtn.replaceWith(menuBtn.cloneNode(true));
    const freshBtn = document.getElementById('menuToggle');

    freshBtn.addEventListener('click', () => {
      const expanded = freshBtn.getAttribute('aria-expanded') === 'true';
      freshBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      menu.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        menu.classList.contains('open') &&
        !freshBtn.contains(e.target) &&
        !menu.contains(e.target) &&
        freshBtn.offsetParent !== null
      ) {
        freshBtn.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
      }
    });
  }

  // Try init immediately (if nav already present)
  initMobileMenu();

  // Re-init when nav is injected dynamically
  window.addEventListener('navLoaded', () => initMobileMenu());


  /* ----------------------------------
     PWA Installations-Schaltfläche (A2HS)
  ---------------------------------- */
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      installBtn.hidden = true;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Installation:', outcome); // accepted / dismissed
        deferredPrompt = null;
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('✅ App wurde installiert');
    if (installBtn) installBtn.hidden = true;
  });


  // 3) Aktiven Navigation-Link markieren (robust gegenüber verschiedenen Nav-Templates)
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, #menu a, .nav-menu a, .navbar a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();
    if (linkPage === currentPage) link.classList.add('active');
  });
});


/* ----------------------------------
   Kontaktformular (Demo)
---------------------------------- */
function handleContact(e) {
  e.preventDefault();
  const form = e.target;

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  if (!data.name || !data.email || !data.message) {
    alert('Bitte fülle alle Felder aus.');
    return;
  }

  alert(`Danke, ${data.name}! Deine Nachricht wurde lokal empfangen (Demo).`);
  form.reset();
}


/* ----------------------------------
   Side Navigation (Hilfsfunktionen)
---------------------------------- */
function openNav() {
  const nav = document.getElementById('mySidenav');
  if (nav) nav.style.width = '200px';
}

function closeNav() {
  const nav = document.getElementById('mySidenav');
  if (nav) nav.style.width = '0';
}


/* ----------------------------------
   Song-Lyrics Ein-/Ausblenden
---------------------------------- */
document.addEventListener('click', (e) => {
  if (!e.target.classList) return;
  if (e.target.classList.contains('toggle-lyrics')) {
    const btn = e.target;
    const lyrics = btn.previousElementSibling;
    if (!lyrics) return;

    if (lyrics.style.display === 'none' || lyrics.style.display === '') {
      lyrics.style.display = 'block';
      btn.textContent = 'Lyrics verbergen';
    } else {
      lyrics.style.display = 'none';
      btn.textContent = 'Lyrics anzeigen';
    }
  }
});
