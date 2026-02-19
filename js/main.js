(function() {
  'use strict';

  /* ==========================================
     MOBILE NAVIGATION
     ========================================== */
  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('main-nav--open');
      document.body.classList.toggle('nav-open');
    });

    // Close mobile nav on link click
    var links = nav.querySelectorAll('.main-nav__link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() {
        nav.classList.remove('main-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    }

    // Close on escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('main-nav--open')) {
        nav.classList.remove('main-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        toggle.focus();
      }
    });
  }

  /* ==========================================
     STICKY HEADER SCROLL EFFECT
     ========================================== */
  function initStickyHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var scrolled = false;
    window.addEventListener('scroll', function() {
      var shouldBeScrolled = window.scrollY > 10;
      if (shouldBeScrolled !== scrolled) {
        scrolled = shouldBeScrolled;
        header.classList.toggle('site-header--scrolled', scrolled);
      }
    }, { passive: true });
  }

  /* ==========================================
     HERO SLIDESHOW
     ========================================== */
  function initHeroSlideshow() {
    var slides = document.querySelectorAll('.hero__slide');
    var dotsContainer = document.querySelector('.hero__dots');
    if (slides.length < 2 || !dotsContainer) return;

    var current = 0;
    var interval = null;
    var paused = false;
    var INTERVAL_MS = 4000;

    // Create dot indicators
    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement('button');
      dot.className = 'hero__dot' + (i === 0 ? ' hero__dot--active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.dataset.index = i;
      dot.addEventListener('click', function() {
        goToSlide(parseInt(this.dataset.index));
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    }

    var dots = dotsContainer.querySelectorAll('.hero__dot');

    function goToSlide(index) {
      slides[current].classList.remove('hero__slide--active');
      dots[current].classList.remove('hero__dot--active');
      current = index;
      slides[current].classList.add('hero__slide--active');
      dots[current].classList.add('hero__dot--active');
    }

    function nextSlide() {
      goToSlide((current + 1) % slides.length);
    }

    function resetInterval() {
      clearInterval(interval);
      if (!paused) {
        interval = setInterval(nextSlide, INTERVAL_MS);
      }
    }

    // Auto-play
    interval = setInterval(nextSlide, INTERVAL_MS);

    // Pause on hover/focus
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', function() {
        paused = true;
        clearInterval(interval);
      });
      hero.addEventListener('mouseleave', function() {
        paused = false;
        resetInterval();
      });
    }

    // Touch swipe support
    var touchStartX = 0;
    var heroEl = document.querySelector('.hero__slides');
    if (heroEl) {
      heroEl.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroEl.addEventListener('touchend', function(e) {
        var diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) {
          if (diff < 0) {
            goToSlide((current + 1) % slides.length);
          } else {
            goToSlide((current - 1 + slides.length) % slides.length);
          }
          resetInterval();
        }
      }, { passive: true });
    }
  }

  /* ==========================================
     FORM HANDLING
     ========================================== */
  function initForms() {
    var forms = document.querySelectorAll('.form[data-ajax]');
    for (var i = 0; i < forms.length; i++) {
      setupForm(forms[i]);
    }
  }

  function setupForm(form) {
    var statusEl = form.querySelector('.form__status');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Show sending state
      if (statusEl) {
        statusEl.textContent = 'Submitting form...';
        statusEl.className = 'form__status form__status--visible form__status--sending';
      }
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData
      })
      .then(function(response) {
        return response.text();
      })
      .then(function(text) {
        if (statusEl) {
          statusEl.textContent = 'Form received. Thank you!';
          statusEl.className = 'form__status form__status--visible form__status--success';
        }
        form.reset();
      })
      .catch(function() {
        if (statusEl) {
          statusEl.textContent = 'There was an error submitting the form. Please try again.';
          statusEl.className = 'form__status form__status--visible form__status--error';
        }
      })
      .finally(function() {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  /* ==========================================
     INIT
     ========================================== */
  document.addEventListener('DOMContentLoaded', function() {
    initNav();
    initStickyHeader();
    initHeroSlideshow();
    initForms();
  });
})();
