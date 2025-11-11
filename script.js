document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initThemeToggle();
  initScrollAnimations();
  initExperienceExpand();
  initStatCounters();
  initSkillBars();
  initContactForm();
  initScrollTop();
  initSmoothScroll();
});

function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    updateActiveLink();
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.classList.remove('hidden');
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(
    '.competency-card, .timeline-item, .stat-card, .project-card, .education-col, .contact-info, .contact-form-container'
  );

  animateElements.forEach(el => {
    el.classList.add('hidden');
    observer.observe(el);
  });
}

function initExperienceExpand() {
  const expandButtons = document.querySelectorAll('.expand-btn');

  expandButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const details = document.getElementById(targetId);

      button.classList.toggle('active');

      if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        button.querySelector('span').textContent = 'View Details';
      } else {
        document.querySelectorAll('.timeline-details').forEach(detail => {
          detail.classList.remove('expanded');
        });
        document.querySelectorAll('.expand-btn').forEach(btn => {
          btn.classList.remove('active');
          btn.querySelector('span').textContent = 'View Details';
        });

        details.classList.add('expanded');
        button.querySelector('span').textContent = 'Hide Details';
      }
    });
  });
}

function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, observerOptions);

  const highlightsSection = document.querySelector('.highlights');
  if (highlightsSection) {
    observer.observe(highlightsSection);
  }

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      };

      updateCounter();
    });
  }
}

function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  let animated = false;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateSkillBars();
      }
    });
  }, observerOptions);

  const educationSection = document.querySelector('.education');
  if (educationSection) {
    observer.observe(educationSection);
  }

  function animateSkillBars() {
    skillBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      setTimeout(() => {
        bar.style.width = `${progress}%`;
      }, 100);
    });
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };

      console.log('Form submitted:', formData);

      formSuccess.classList.add('show');

      form.reset();

      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 5000);
    }
  });

  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      if (input.parentElement.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  function validateForm() {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  function validateField(field) {
    const formGroup = field.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    let isValid = true;
    let message = '';

    if (field.value.trim() === '') {
      isValid = false;
      message = 'This field is required';
    } else if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }

    if (!isValid) {
      formGroup.classList.add('error');
      errorMessage.textContent = message;
    } else {
      formGroup.classList.remove('error');
      errorMessage.textContent = '';
    }

    return isValid;
  }
}

function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}
