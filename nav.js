(function () {
  // --- Inject nav HTML ---
  const navHTML = `
    <a class="bigName" href="index.html">David Kim</a>
    <button class="menuToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-right">
      <span></span><span></span><span></span>
    </button>
    <div id="nav-right">
      <nav>
        <ul>
          <li><a href="index.html">home</a></li>
          <li><a href="projects.html">projects</a></li>
          <li><a href="publications.html">publications</a></li>
          <li><a href="portfolio.html">artwork</a></li>
        </ul>
      </nav>
      <div class="iconLinks">
        <a href="#contact"><img src="data/email-offwhite.png"></a>
        <a href="https://github.com/dsykim" target="_blank"><img src="data/github-offwhite.png"></a>
        <a href="https://www.linkedin.com/in/david-kim-a34b86289/" target="_blank"><img src="data/linkedin-offwhite.png"></a>
        <a href="data/david_kim_resume.pdf" target="_blank"><img src="data/cv-offwhite.png"></a>
      </div>
    </div>
    
  `;

  const placeholder = document.getElementById('nav-container');
  placeholder.innerHTML = navHTML;

  // --- Underline logic ---
  const nav = placeholder.querySelector('nav');
  const links = Array.from(nav.querySelectorAll('a'));

  function setUnderline(el) {
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    nav.style.setProperty('--underline-left', (elRect.left - navRect.left) + 'px');
    nav.style.setProperty('--underline-width', elRect.width + 'px');
  }

  // Find active link by matching end of pathname
  const path = window.location.pathname;
  let activeLink = links.find(a => {
    const href = a.getAttribute('href');
    return path.endsWith(href) || (href === 'index.html' && (path === '/' || path.endsWith('/')));
  }) || links[0];

  activeLink.classList.add('active');

  // Snap the underline to the active link without animating
  function snapUnderline() {
    nav.classList.add('no-transition');
    setUnderline(activeLink);
    // Remove class after the next paint so the transition is only suppressed for this update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nav.classList.remove('no-transition');
      });
    });
  }

  // Set initial underline after fonts/layout settle
  window.addEventListener('load', snapUnderline);

  window.addEventListener('resize', snapUnderline);

  // Hover: slide to hovered link
  links.forEach(a => {
    a.addEventListener('mouseenter', () => setUnderline(a));
  });

  // Mouse leave nav: snap back to active
  nav.addEventListener('mouseleave', () => setUnderline(activeLink));

  // --- Collapsed menu ---
  const toggle = placeholder.querySelector('.menuToggle');

  function setMenu(open) {
    placeholder.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', () => setMenu(!placeholder.classList.contains('open')));

  placeholder.querySelectorAll('#nav-right a').forEach(a => {
    a.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('click', e => {
    if (!placeholder.contains(e.target)) setMenu(false);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && placeholder.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });
})();