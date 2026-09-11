// ===== Gaurav Coaching Institute — site.js =====

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile menu toggle ---------- */
  var toggleBtn = document.querySelector('.menu-toggle');
  var nav = document.querySelector('header nav');
  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', function () {
      nav.classList.toggle('nav-open');
      toggleBtn.classList.toggle('open');
      var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!expanded));
    });

    // close menu when a nav link is clicked (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('header nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('#')[0] === currentPage) {
      link.classList.add('active-link');
    }
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Scroll reveal for cards / sections ---------- */
  var revealEls = document.querySelectorAll('.card, .why-item, .testimonial-card, .team-card, .mv-card, .info-card, .course-block');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Form validation & submit handling ---------- */
  document.querySelectorAll('form').forEach(function (form) {
    // skip forms without any inputs (safety)
    if (!form.querySelector('input, textarea, select')) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormMessage(form);

      var isValid = true;
      var firstInvalid = null;

      form.querySelectorAll('input, textarea, select').forEach(function (field) {
        clearFieldError(field);

        var value = field.value.trim();
        var isOptional = field.dataset.optional === 'true';

        // skip radio buttons and checkboxes from the generic required check
        if (field.type === 'radio' || field.type === 'checkbox') {
          // handled separately below (checkbox) or not required (radio)
        } else if (!isOptional && value === '') {
          setFieldError(field, 'Ye field zaroori hai');
          isValid = false;
          if (!firstInvalid) firstInvalid = field;
          return;
        }

        // email format check
        if (field.type === 'email' && value !== '') {
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            setFieldError(field, 'Sahi email likhein');
            isValid = false;
            if (!firstInvalid) firstInvalid = field;
          }
        }

        // phone format check (basic: 10 digit Indian numbers, allows +91)
        if (field.type === 'tel' && value !== '') {
          var digits = value.replace(/\D/g, '');
          if (digits.length < 10) {
            setFieldError(field, 'Sahi phone number likhein');
            isValid = false;
            if (!firstInvalid) firstInvalid = field;
          }
        }

        // required checkbox (terms etc.)
        if (field.type === 'checkbox' && field.hasAttribute('data-required') && !field.checked) {
          setFieldError(field.parentElement, 'Ye zaroori hai');
          isValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      // password confirmation match, if both fields exist
      var pw = form.querySelector('#password');
      var confirmPw = form.querySelector('#confirm');
      if (pw && confirmPw && pw.value !== confirmPw.value) {
        setFieldError(confirmPw, 'Password match nahi ho raha');
        isValid = false;
        if (!firstInvalid) firstInvalid = confirmPw;
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      showFormMessage(form, 'success', getSuccessMessage(form));
      form.reset();
    });
  });

  function setFieldError(field, message) {
    field.classList.add('field-error');
    var msg = document.createElement('div');
    msg.className = 'field-error-msg';
    msg.textContent = message;
    field.insertAdjacentElement('afterend', msg);
  }

  function clearFieldError(field) {
    field.classList.remove('field-error');
    var next = field.nextElementSibling;
    if (next && next.classList.contains('field-error-msg')) {
      next.remove();
    }
  }

  function clearFormMessage(form) {
    var existing = form.querySelector('.form-message');
    if (existing) existing.remove();
  }

  function showFormMessage(form, type, text) {
    var msg = document.createElement('div');
    msg.className = 'form-message ' + type;
    msg.textContent = text;
    form.prepend(msg);
    msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function getSuccessMessage(form) {
    if (form.id === 'login-form') return 'Login ho gaya! (Demo — koi backend connected nahi hai)';
    if (form.id === 'signup-form') return 'Account ban gaya! (Demo — koi backend connected nahi hai)';
    if (form.id === 'register-form') return 'Registration successful! Hum jald hi aapse contact karenge.';
    if (form.id === 'contact-form') return 'Message bhej diya gaya! Hum jald hi reply karenge.';
    if (form.id === 'enquiry-form') return 'Enquiry mil gayi! Hum jald hi contact karenge.';
    return 'Submit ho gaya!';
  }

});
