/**
 * Portfolio JavaScript Functionality
 * Author: Alex Morgan Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavigation();
  initSkillsTabs();
  initProjectFilters();
  initModals();
  initContactForm();
  initCopyButtons();
});

/* ==========================================================================
   NAVIGATION, SIDE-DRAWER & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Automatically inject a close button into the mobile nav drawer if not already present
  let menuCloseBtn = document.getElementById('menuCloseBtn');
  if (navLinks && !menuCloseBtn) {
    menuCloseBtn = document.createElement('button');
    menuCloseBtn.id = 'menuCloseBtn';
    menuCloseBtn.className = 'menu-close-btn';
    menuCloseBtn.setAttribute('aria-label', 'Close navigation menu');
    menuCloseBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    navLinks.prepend(menuCloseBtn); // Places it at the very top of the drawer
  }

  // Mobile menu open/close logic
  if (menuToggleBtn && navLinks) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      
      const icon = menuToggleBtn.querySelector('i');
      if (icon) {
        icon.classList.replace(isOpen ? 'fa-bars' : 'fa-xmark', isOpen ? 'fa-xmark' : 'fa-bars');
      }
    };

    menuToggleBtn.addEventListener('click', () => toggleMenu());

    if (menuCloseBtn) {
      menuCloseBtn.addEventListener('click', () => toggleMenu(false));
    }

    // Close mobile menu when a nav link is clicked
    navItems.forEach(item => {
      item.addEventListener('click', () => toggleMenu(false));
    });

    // Close on pressing the Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(false);
    });
  }

  // Navbar shadow & ScrollSpy on window scroll
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Scroll to Top Button (if applicable)
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Run initialization safely on page load
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
});

/* ==========================================================================
   SKILLS TABS (Automation vs Software)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  function initSkillsTabs() {
    const tabBtns = document.querySelectorAll('.skills-tab-btn');
    const tabPanels = document.querySelectorAll('.skills-section-panel');

    if (!tabBtns.length || !tabPanels.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  initSkillsTabs();
});

/* ==========================================================================
   PROJECT SECTIONS TOGGLING (IoT Projects & Software Projects)
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const iotSection = document.getElementById('iotProjectsSection');
  const softwareSection = document.getElementById('softwareProjectsSection');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button styles
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-project-filter');

      if (filter === 'iot') {
        if (iotSection) {
          iotSection.style.display = 'block';
          iotSection.style.animation = 'fadeIn 0.4s ease';
        }
        if (softwareSection) {
          softwareSection.style.display = 'none';
        }
      } else if (filter === 'software') {
        if (iotSection) {
          iotSection.style.display = 'none';
        }
        if (softwareSection) {
          softwareSection.style.display = 'block';
          softwareSection.style.animation = 'fadeIn 0.4s ease';
        }
      }
    });
  });
}

// Don't forget to call it on page load
document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
});

/* ==========================================================================
   MODAL CONTROLLER (Blog & Resume)
   ========================================================================== */
function initModals() {
  const modalOverlay = document.getElementById('genericModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(title, content) {
    modalTitle.innerHTML = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Blog modal triggers
  const blogTriggers = document.querySelectorAll('.read-blog-trigger');
  const blogData = {
    blog1: {
      title: "How We Scaled Test Automation: 0 to 500 Daily Tests in CI/CD",
      content: `
        <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.75;">
          <p style="margin-bottom: 1rem;"><strong style="color: var(--text-primary)">Published:</strong> October 2026 | <strong style="color: var(--text-primary)">Category:</strong> Test Automation & CI/CD</p>
          <p style="margin-bottom: 1rem;">Scaling an enterprise test automation suite is fundamentally about reliability, isolation, and feedback speed. When test suites grow, flaky tests and prolonged execution bottlenecks kill developer productivity.</p>
          <h4 style="color: var(--text-primary); margin: 1.25rem 0 0.5rem 0;">1. Containerized Parallel Runners</h4>
          <p style="margin-bottom: 1rem;">By packaging test executions inside lightweight Docker containers orchestrated via GitHub Actions matrix workflows, our pipeline run-time dropped from 85 minutes to under 7 minutes across 500+ integration and UI tests.</p>
          <h4 style="color: var(--text-primary); margin: 1.25rem 0 0.5rem 0;">2. Flakiness Eradication Tactics</h4>
          <p style="margin-bottom: 1rem;">We adopted deterministic polling strategies using Playwright and PyTest fixtures instead of fixed sleeps, achieving a 99.8% test repeatability benchmark across staging clusters.</p>
          <h4 style="color: var(--text-primary); margin: 1.25rem 0 0.5rem 0;">3. Automated Telemetry & Instant Alerts</h4>
          <p>Every test failure now uploads failure traces, DOM snapshots, and error stack logs to an internal MinIO bucket with instant webhooks into engineering Slack channels.</p>
        </div>
      `
    },
    blog2: {
      title: "Architecting Modern Microservices: FastAPI, Docker & Event-Driven Pipelines",
      content: `
        <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.75;">
          <p style="margin-bottom: 1rem;"><strong style="color: var(--text-primary)">Published:</strong> September 2026 | <strong style="color: var(--text-primary)">Category:</strong> Software Architecture</p>
          <p style="margin-bottom: 1rem;">Modern software engineering demands high-throughput, low-latency microservices that can seamlessly communicate across asynchronous event brokers without tight coupling.</p>
          <h4 style="color: var(--text-primary); margin: 1.25rem 0 0.5rem 0;">Why FastAPI for High-Concurrency Microservices?</h4>
          <p style="margin-bottom: 1rem;">FastAPI leverages Python's asynchronous async/await primitives powered by Starlette and Pydantic schema validation. In our benchmark evaluations, it reduced serialization overhead by 40% compared to traditional Flask implementations.</p>
          <h4 style="color: var(--text-primary); margin: 1.25rem 0 0.5rem 0;">Asynchronous Event Pipelines with Redis & Celery</h4>
          <p style="margin-bottom: 1rem;">Heavy computational processes and bulk data tasks are offloaded into background task queues, ensuring customer-facing REST endpoints respond within &lt;45 milliseconds.</p>
          <h4 style="color: var(--text-primary); margin: 1.25rem 0 0.5rem 0;">Containerization Best Practices</h4>
          <p>Multi-stage Docker builds were used to generate ultra-lean production images under 85MB, reducing cold-start container initialization in Kubernetes pods.</p>
        </div>
      `
    },
    blog3: {
      title: "PLC to Cloud: Bridging Operational Technology with Modern Web APIs",
      content: `
        <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.75;">
          <p style="margin-bottom: 1rem;"><strong style="color: var(--text-primary)">Published:</strong> August 2026 | <strong style="color: var(--text-primary)">Category:</strong> Industrial Automation & IoT</p>
          <p style="margin-bottom: 1rem;">In manufacturing and automated facilities, Programmable Logic Controllers (PLCs) handle mission-critical physical operations. However, legacy factory floors frequently lack modern real-time observability.</p>
          <h4 style="color: var(--text-primary); margin: 1.25rem 0 0.5rem 0;">The Bridge: Modbus TCP to MQTT Gateways</h4>
          <p style="margin-bottom: 1rem;">Using lightweight edge nodes running Python and ROS2, we polled industrial PLCs over Modbus TCP registers at 50ms intervals and transformed binary states into structured JSON telemetry streams over lightweight MQTT brokers.</p>
          <h4 style="color: var(--text-primary); margin: 1.25rem 0 0.5rem 0;">Real-Time WebSockets & React Dashboards</h4>
          <p>By consuming MQTT telemetry through an API gateway and streaming updates to client-side React dashboards via WebSockets, plant supervisors monitor line status and predictive maintenance alerts in sub-second latency worldwide.</p>
        </div>
      `
    }
  };

  blogTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const blogId = trigger.getAttribute('data-blog');
      const data = blogData[blogId];
      if (data) {
        openModal(data.title, data.content);
      }
    });
  });

  // Resume Preview Modal Trigger
  const previewResumeBtn = document.getElementById('previewResumeBtn');
  if (previewResumeBtn) {
    previewResumeBtn.addEventListener('click', () => {
      const resumeContent = `
        <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1rem;">
            <div>
              <h2 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.2rem;">ALEX MORGAN</h2>
              <p style="color: var(--accent-cyan); font-size: 0.88rem; font-weight: 600;">Full-Stack Software Engineer & Automation Specialist</p>
            </div>
            <a href="assets/Alex_Morgan_Resume.pdf" download="Alex_Morgan_Resume.pdf" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-download"></i> Download PDF
            </a>
          </div>

          <div style="margin-bottom: 1.2rem;">
            <h4 style="color: var(--text-primary); font-size: 1rem; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; border-left: 3px solid var(--accent-cyan); padding-left: 0.5rem;">Core Competencies</h4>
            <p style="font-size: 0.86rem; color: var(--text-secondary); margin-bottom: 0.3rem;"><strong style="color: var(--text-primary);">Automation:</strong> CI/CD (GitHub Actions, GitLab CI), Selenium, Playwright, PyTest, UiPath RPA, PLC Programming, Modbus, MQTT, IoT Automation.</p>
            <p style="font-size: 0.86rem; color: var(--text-secondary);"><strong style="color: var(--text-primary);">Software:</strong> Python, TypeScript, React, Next.js, Node.js, FastAPI, PostgreSQL, MongoDB, Docker, REST APIs, Microservices, Git.</p>
          </div>

          <div style="margin-bottom: 1.2rem;">
            <h4 style="color: var(--text-primary); font-size: 1rem; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; border-left: 3px solid var(--accent-cyan); padding-left: 0.5rem;">Experience Highlights</h4>
            <div style="margin-bottom: 0.6rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:700; color:var(--text-primary);">
                <span>Senior Automation & Software Engineer - NexaTech Solutions</span>
                <span style="color:var(--accent-cyan);">2023 - Present</span>
              </div>
              <p style="font-size: 0.84rem; color: var(--text-secondary);">Automated test pipelines for 450+ microservices; reduced release cycle times by 85%; designed real-time telemetry dashboards.</p>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:700; color:var(--text-primary);">
                <span>Software Developer & Systems Specialist - CyberCore Labs</span>
                <span style="color:var(--accent-cyan);">2021 - 2023</span>
              </div>
              <p style="font-size: 0.84rem; color: var(--text-secondary);">Architected containerized microservices; created RPA invoice automation bot processing 10,000+ daily items.</p>
            </div>
          </div>

          <div>
            <h4 style="color: var(--text-primary); font-size: 1rem; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; border-left: 3px solid var(--accent-cyan); padding-left: 0.5rem;">Education & Honors</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);"><strong>B.S. in Computer Science & Automation Engineering</strong> | State University of Technology (CGPA: 3.88/4.0)</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Dean's List (Top 5%), 1st Place National Smart Automation Hackathon, RoboFest Captain.</p>
          </div>
        </div>
      `;
      openModal("Curriculum Vitae Preview", resumeContent);
    });
  }
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...`;

    // Simulate async submission
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();
      showToast("Thank you! Your message has been sent successfully.", "fa-circle-check");
    }, 1200);
  });
}

/* ==========================================================================
   COPY TO CLIPBOARD UTILITY
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`, 'fa-clipboard-check');
        }).catch(() => {
          showToast(`Selected text: ${textToCopy}`, 'fa-info');
        });
      }
    });
  });
}

/* ==========================================================================
   TOAST NOTIFICATION COMPONENT
   ========================================================================== */
function showToast(message, iconClass = 'fa-circle-check') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid ${iconClass} toast-icon"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
