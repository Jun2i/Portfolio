/* ===================================================
   Juan Xyryll G. Apocero — Portfolio JavaScript
   =================================================== */

(function () {
  'use strict';

  /* ── DOM REFS ── */
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggleBtn');
  const navPanel = document.getElementById('navPanel');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollBar = document.querySelector('.scroll-progress');
  const backTop = document.getElementById('backTopBtn');
  const revealEls = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('mainContactForm');

  /* ── SCROLL PROGRESS ── */
  function updateScrollProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + '%';
  }

  /* ── HEADER SHADOW ON SCROLL ── */
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 30);
  }

  /* ── BACK TO TOP ── */
  function updateBackTop() {
    if (!backTop) return;
    backTop.classList.toggle('visible', window.scrollY > 500);
  }
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── ACTIVE NAV LINK ── */
  function updateActiveLink() {
    const sections = document.querySelectorAll('main section[id]');
    let current = '';
    sections.forEach(function (sec) {
      if (window.scrollY + 120 >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
  }

  /* ── SCROLL EVENTS ── */
  function onScroll() {
    updateScrollProgress();
    updateHeader();
    updateBackTop();
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── MOBILE NAV TOGGLE ── */
  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      const open = navPanel.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open.toString());
      // Animate bars
      const bars = navToggle.querySelectorAll('.bar');
      if (open) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });

    // Close menu on link click
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navPanel.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const bars = navToggle.querySelectorAll('.bar');
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target) && navPanel.classList.contains('open')) {
        navPanel.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const bars = navToggle.querySelectorAll('.bar');
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });
  }

  /* ── INTERSECTION OBSERVER (REVEAL) ── */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerH = header ? header.offsetHeight : 80;
        var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── CONTACT FORM ── */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('[type="submit"]');
      var originalText = btn.innerHTML;

      // Validate
      var name = contactForm.querySelector('#cf-name').value.trim();
      var email = contactForm.querySelector('#cf-email').value.trim();
      var message = contactForm.querySelector('#cf-msg').value.trim();

      if (!name || !email || !message) {
        showFormAlert(contactForm, 'Please fill in all required fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormAlert(contactForm, 'Please enter a valid email address.', 'error');
        return;
      }

      // Loading state
      btn.disabled = true;
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="animation:spin .8s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/><path d="M12 3a9 9 0 019 9"/></svg> Sending...';

      // Simulate async (replace with your backend/emailjs/formspree call)
      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = originalText;
        showFormAlert(contactForm, 'Thank you! Your message has been received. This form is ready for backend or email service integration (Formspree, EmailJS, etc.).', 'success');
        contactForm.reset();
      }, 1500);
    });
  }

  function showFormAlert(form, msg, type) {
    var existing = form.querySelector('.form-alert');
    if (existing) existing.remove();
    var alert = document.createElement('div');
    alert.className = 'form-alert form-alert-' + type;
    alert.setAttribute('role', 'alert');
    alert.style.cssText = [
      'padding: 12px 16px',
      'border-radius: 12px',
      'font-size: 0.92rem',
      'line-height: 1.5',
      'margin-top: 4px',
      type === 'success'
        ? 'background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.3); color: #4ade80;'
        : 'background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171;'
    ].join(';');
    alert.textContent = msg;
    form.appendChild(alert);
    setTimeout(function () { if (alert.parentNode) alert.remove(); }, 8000);
  }

  /* ── SERVICE CARD STAGGER ── */
  document.querySelectorAll('.svc-card').forEach(function (card, i) {
    card.style.transitionDelay = (i * 60) + 'ms';
  });

  /* ── SKILL TAG HOVER EFFECT ── */
  document.querySelectorAll('.tag').forEach(function (tag) {
    tag.style.cursor = 'default';
  });

  /* ── CERTIFICATE FILTER ── */
  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  if (certFilterBtns.length > 0) {
    certFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        certFilterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');
        certCards.forEach(function (card) {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
            setTimeout(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── RESUME MODAL ── */
  const resumeModal = document.getElementById('resumeModal');
  const resumeTriggers = document.querySelectorAll('.resume-trigger, #navResumeBtn, #aboutResumeBtn, #contactResume, #ftResume');
  const resumeCloseBtn = document.getElementById('resumeCloseBtn');
  const resumeBackdrop = document.getElementById('resumeModalBackdrop');
  const resumePrintBtn = document.getElementById('resumePrintBtn');

  function openResumeModal(e) {
    if (e) e.preventDefault();
    if (resumeModal) {
      resumeModal.classList.add('open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResumeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  resumeTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', openResumeModal);
  });

  const resumeDownloadBtn = document.getElementById('resumeDownloadBtn');

  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener('click', closeResumeModal);
  }
  if (resumeBackdrop) {
    resumeBackdrop.addEventListener('click', closeResumeModal);
  }

  /* ── DOWNLOAD PDF (html2canvas + jsPDF) — exact A4 fit ── */
  function downloadResumePDF() {
    var sheet = document.getElementById('resumeSheet');
    if (!sheet) return;

    // Ensure modal is open so the resume is rendered
    var wasOpen = resumeModal && resumeModal.classList.contains('open');
    if (!wasOpen) openResumeModal();

    // Show loading state on button
    var btn = document.getElementById('resumeDownloadBtn');
    var originalHTML = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="animation:spin .8s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/><path d="M12 3a9 9 0 019 9"/></svg> Generating...';
    }

    setTimeout(function () {
      // A4 at 96 dpi = 794px wide
      var A4_W_PX = 794;

      // Temporarily force the sheet to A4 width and let it grow as tall as needed
      var prevStyle = {
        width:        sheet.style.width,
        maxWidth:     sheet.style.maxWidth,
        minWidth:     sheet.style.minWidth,
        height:       sheet.style.height,
        overflow:     sheet.style.overflow,
        borderRadius: sheet.style.borderRadius,
        boxShadow:    sheet.style.boxShadow
      };
      sheet.style.width        = A4_W_PX + 'px';
      sheet.style.maxWidth     = A4_W_PX + 'px';
      sheet.style.minWidth     = A4_W_PX + 'px';
      sheet.style.height       = 'auto';          // let full content show
      sheet.style.overflow     = 'visible';
      sheet.style.borderRadius = '0';
      sheet.style.boxShadow    = 'none';

      // Double rAF to ensure two reflow passes complete
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          // Capture full scrollable height — no clipping
          var fullHeight = sheet.scrollHeight || sheet.offsetHeight;

          html2canvas(sheet, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width:        A4_W_PX,
            height:       fullHeight,   // capture EVERYTHING
            windowWidth:  A4_W_PX,
            windowHeight: fullHeight,
            scrollX: 0,
            scrollY: 0
          }).then(function (canvas) {
            // Restore sheet styles
            sheet.style.width        = prevStyle.width;
            sheet.style.maxWidth     = prevStyle.maxWidth;
            sheet.style.minWidth     = prevStyle.minWidth;
            sheet.style.height       = prevStyle.height;
            sheet.style.overflow     = prevStyle.overflow;
            sheet.style.borderRadius = prevStyle.borderRadius;
            sheet.style.boxShadow    = prevStyle.boxShadow;

            var imgData = canvas.toDataURL('image/jpeg', 0.98);
            var pdf = new window.jspdf.jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
              compress: true
            });

            // Stretch entire captured resume to fill the full A4 page (210mm × 297mm)
            var pageW = pdf.internal.pageSize.getWidth();
            var pageH = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH, '', 'FAST');

            pdf.save('Juan_Xyryll_Apocero_Resume.pdf');

            if (btn) {
              btn.disabled = false;
              btn.innerHTML = originalHTML;
            }
            if (!wasOpen) closeResumeModal();
          }).catch(function (err) {
            // Restore on error too
            sheet.style.width        = prevStyle.width;
            sheet.style.maxWidth     = prevStyle.maxWidth;
            sheet.style.minWidth     = prevStyle.minWidth;
            sheet.style.height       = prevStyle.height;
            sheet.style.overflow     = prevStyle.overflow;
            sheet.style.borderRadius = prevStyle.borderRadius;
            sheet.style.boxShadow    = prevStyle.boxShadow;
            console.error('PDF generation error:', err);
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = originalHTML;
            }
          });
        }); // end inner rAF
      });   // end outer rAF
    }, wasOpen ? 50 : 250);
  }

  if (resumeDownloadBtn) {
    resumeDownloadBtn.addEventListener('click', downloadResumePDF);
  }
  if (resumePrintBtn) {
    resumePrintBtn.addEventListener('click', function () {
      window.print();
    });
  }

  /* ── CREATIVE GALLERY, RANDOMIZER & LIGHTBOX ── */
  var creativeItems = document.querySelectorAll('.gal-item');
  var randomizeBtn = document.getElementById('randomizeCreativeBtn');
  var creativeLightbox = document.getElementById('creativeLightbox');
  var clBackdrop = document.getElementById('creativeLightboxBackdrop');
  var clClose = document.getElementById('creativeLightboxClose');
  var clImg = document.getElementById('creativeLightboxImg');
  var clTag = document.getElementById('creativeLightboxTag');
  var clTitle = document.getElementById('creativeLightboxTitle');

  // Curated creative sets
  var creativeSets = [
    // Set 0: Original masterworks
    [
      { img: 'creative-ui.jpg', tag: 'UI Design', label: 'Mobile & Web UI', title: 'Quantum Mobile & Web Dashboard UI' },
      { img: 'creative-graphic.jpg', tag: 'Graphic Design', label: '3D Poster & Typography', title: 'Limitless Aesthetics 3D Poster' },
      { img: 'creative-branding.jpg', tag: 'Branding', label: 'Corporate Brand Identity', title: 'Vertex Luxury Stationery Identity' },
      { img: 'creative-illustration.jpg', tag: 'Illustration', label: 'Sci-Fi Concept Art', title: 'Cybernetic Explorer in Cyberspace' },
      { img: 'creative-concept.jpg', tag: 'Visual Concepts', label: 'Metropolis Skyline', title: 'Neon Cyberpunk Megalopolis Concept' },
      { img: 'creative-digital-art.jpg', tag: 'Digital Art', label: '3D Iridescent Fluid Sphere', title: 'Chromatic Fluid 3D Orbital Sphere' }
    ],
    // Set 1: Futuristic & Generative Design
    [
      { img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', tag: 'UI Design', label: 'Hardware & OS Interface', title: 'Cybernetic Operating System & Retro Hardware' },
      { img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', tag: 'Graphic Design', label: 'Fluid Geometry', title: 'Iridescent Curved Waves & Abstract Flow' },
      { img: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80', tag: 'Branding', label: 'Studio Identity', title: 'Minimalist Architecture & Creative Studio' },
      { img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', tag: 'Illustration', label: 'Modern Classical', title: 'Classical Renaissance & Digital Surrealism' },
      { img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80', tag: 'Visual Concepts', label: 'Atmospheric Realm', title: 'Misty Alpine Horizons & Atmospheric Lighting' },
      { img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80', tag: 'Digital Art', label: '3D Glass Prisms', title: 'Chromatic Dispersion & Glass Refractions' }
    ],
    // Set 2: Vibrant Tech & Neon Art
    [
      { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', tag: 'UI Design', label: 'Data Analytics System', title: 'Enterprise Business Intelligence Dashboard' },
      { img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80', tag: 'Graphic Design', label: 'React Framework', title: 'Component-Driven Architecture Showcase' },
      { img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', tag: 'Branding', label: 'Digital Experience', title: 'Modern Interaction & Brand Visuals' },
      { img: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80', tag: 'Illustration', label: 'Cosmic Constellations', title: 'Planetary Cartography & Nebula Glow' },
      { img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', tag: 'Visual Concepts', label: 'Silicon Architecture', title: 'Microchip Neural Network Infrastructure' },
      { img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', tag: 'Digital Art', label: 'Cyberpunk Neon', title: 'Metropolitan Nightscape & Holograms' }
    ]
  ];

  var currentSetIndex = 0;

  function randomizeCreativeWork() {
    if (!randomizeBtn) return;
    randomizeBtn.classList.add('spinning');
    setTimeout(function () {
      randomizeBtn.classList.remove('spinning');
    }, 600);

    var nextIndex = (currentSetIndex + 1) % creativeSets.length;
    currentSetIndex = nextIndex;
    var targetSet = creativeSets[nextIndex];

    creativeItems.forEach(function (item, idx) {
      var data = targetSet[idx % targetSet.length];
      if (!data) return;

      var img = item.querySelector('.gal-img');
      var pill = item.querySelector('.gal-pill');
      var label = item.querySelector('.gal-label');

      if (img) {
        img.style.opacity = '0';
        setTimeout(function () {
          img.src = data.img;
          img.alt = data.title;
          img.onload = function () {
            img.style.opacity = '1';
          };
          setTimeout(function () {
            img.style.opacity = '1';
          }, 200);
        }, 150);
      }

      if (pill) pill.textContent = data.tag;
      if (label) label.textContent = data.label;
      item.setAttribute('data-category', data.tag);
      item.setAttribute('data-title', data.title);
    });
  }

  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', randomizeCreativeWork);
  }

  function openCreativeLightbox(imgSrc, tag, title) {
    if (!creativeLightbox || !clImg) return;
    clImg.src = imgSrc;
    clImg.alt = title;
    if (clTag) clTag.textContent = tag;
    if (clTitle) clTitle.textContent = title;
    creativeLightbox.classList.add('open');
    creativeLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCreativeLightbox() {
    if (!creativeLightbox) return;
    creativeLightbox.classList.remove('open');
    creativeLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (clClose) clClose.addEventListener('click', closeCreativeLightbox);
  if (clBackdrop) clBackdrop.addEventListener('click', closeCreativeLightbox);

  creativeItems.forEach(function (item) {
    function handleTrigger() {
      var img = item.querySelector('.gal-img');
      var imgSrc = img ? img.getAttribute('src') : '';
      var tag = item.getAttribute('data-category') || 'Creative Work';
      var title = item.getAttribute('data-title') || 'Visual Project';
      if (imgSrc) openCreativeLightbox(imgSrc, tag, title);
    }
    item.addEventListener('click', handleTrigger);
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrigger();
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && creativeLightbox && creativeLightbox.classList.contains('open')) {
      closeCreativeLightbox();
    }
  });

  /* ── INIT ── */
  onScroll();

})();

// CSS spin keyframe injection
(function () {
  if (document.getElementById('ag-keyframes')) return;
  var style = document.createElement('style');
  style.id = 'ag-keyframes';
  style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(style);
})();
