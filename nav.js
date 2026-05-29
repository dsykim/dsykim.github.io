(function () {
  // --- Inject nav HTML ---
  const navHTML = `
    <nav>
      <ul>
        <li><a href="index.html">home</a></li>
        <li><a href="projects.html">projects</a></li>
        <li><a href="publications.html">publications</a></li>
        <li><a href="portfolio.html">artwork</a></li>
      </ul>
    </nav>
    <a class="bigName" href="index.html">david kim</a>
  `;

  const placeholder = document.getElementById('nav-placeholder');
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

  // Set initial underline after fonts/layout settle
  window.addEventListener('load', () => {
    nav.classList.add('no-transition');
    setUnderline(activeLink);
    // Remove class after the next paint so transition is only suppressed for initial set
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nav.classList.remove('no-transition');
      });
    });
  });

  // Hover: slide to hovered link
  links.forEach(a => {
    a.addEventListener('mouseenter', () => setUnderline(a));
  });

  // Mouse leave nav: snap back to active
  nav.addEventListener('mouseleave', () => setUnderline(activeLink));
})();