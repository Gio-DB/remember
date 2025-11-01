/* -------------------------------
   1. Service Worker Registrierung
------------------------------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(reg => console.log("✅ Service Worker registriert:", reg.scope))
    .catch(err => console.error("❌ Service Worker Fehler:", err));
}

console.log("PWA läuft 🎉");

/* -------------------------------
   2. DOMContentLoaded Initialisierung
------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------
     2a. Setze Copyright Jahr
  ------------------------------- */
  const yearElem = document.getElementById('year');
  if (yearElem) yearElem.textContent = new Date().getFullYear();

  /* -------------------------------
     2b. Hamburger Menü toggle
  ------------------------------- */
  const btn = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if(!expanded) {
        menu.style.display = 'flex';
        menu.style.flexDirection = 'column';
        menu.style.position = 'absolute';
        menu.style.right = '1rem';
        menu.style.top = '72px';
        menu.style.background = 'var(--card)';
        menu.style.padding = '0.6rem';
        menu.style.borderRadius = '10px';
        menu.style.boxShadow = 'var(--shadow)';
      } else {
        menu.style.display = '';
        menu.style.position = '';
        menu.style.top = '';
        menu.style.right = '';
        menu.style.background = '';
        menu.style.padding = '';
        menu.style.borderRadius = '';
        menu.style.boxShadow = '';
        menu.style.flexDirection = '';
      }
    });

    // Klick außerhalb schließt Menü
    document.addEventListener('click', (e) => {
      if(!btn.contains(e.target) && !menu.contains(e.target) && window.getComputedStyle(btn).display !== 'none') {
        btn.setAttribute('aria-expanded','false');
        menu.style.display = '';
      }
    });
  }

  /* -------------------------------
     2c. Aktiven Menüpunkt markieren
  ------------------------------- */
  const current = location.pathname.split("/").pop();
  document.querySelectorAll(".navbar a, .dropdown-content a").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
});

/* -------------------------------
   3. Kontaktformular Handler (Demo)
------------------------------- */
function handleContact(e){
  e.preventDefault();
  const f = e.target;
  const data = {
    name: f.name.value.trim(),
    email: f.email.value.trim(),
    message: f.message.value.trim()
  };
  if(!data.name || !data.email || !data.message){
    alert('Bitte fülle alle Felder aus.');
    return;
  }
  alert('Danke, ' + data.name + '! Deine Nachricht wurde (lokal) empfangen — ersetze diese Funktion durch eine echte API.');
  f.reset();
}

/* -------------------------------
   4. SideNav Funktionen
------------------------------- */
function openNav() {
  const nav = document.getElementById("mySidenav");
  if(nav) nav.style.width = "200px";
}

function closeNav() {
  const nav = document.getElementById("mySidenav");
  if(nav) nav.style.width = "0";
}


/* -----------------------------------------
   ✅ PWA Installations-Schaltfläche (A2HS)
------------------------------------------ */

// Variable speichern, um Prompt später auszulösen
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// Event, wenn Browser die Installation erlaubt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();        // Standard-Popup verhindern
  deferredPrompt = e;        // Ereignis speichern
  installBtn.hidden = false; // Button sichtbar machen
});

// Klick auf Installations-Schaltfläche
installBtn.addEventListener("click", async () => {
  installBtn.hidden = true;   // Button ausblenden
  if (deferredPrompt) {
    deferredPrompt.prompt();  // Installationsdialog öffnen
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Installation:", outcome); // accepted / dismissed
    deferredPrompt = null;
  }
});

// Optional: Wenn App bereits installiert ist → Button verstecken
window.addEventListener("appinstalled", () => {
  console.log("✅ App wurde installiert");
  installBtn.hidden = true;
});


document.addEventListener("click", function(e) {
  if(e.target.classList.contains("toggle-lyrics")){
    const btn = e.target;
    const full = btn.previousElementSibling;
    if(full.style.display === "none"){
      full.style.display = "block";
      btn.textContent = "Lyrics verbergen";
    } else {
      full.style.display = "none";
      btn.textContent = "Lyrics anzeigen";
    }
  }
});
