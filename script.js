document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Navbar Scroll Effect & Sticky mobile CTA
    const navbar = document.getElementById('navbar');
    const scrollBtn = document.getElementById('scroll-to-top');
    const mobileStickyCta = document.getElementById('mobile-sticky-cta');

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Scroll Logic
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Parallax Effect
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax'));
            const yPos = scrollY * speed;
            el.style.transform = `translateY(${yPos}px)`;
        });

        // Navbar & Scroll to top
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
            scrollBtn.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            scrollBtn.classList.remove('visible');
        }

        // Scroll Progress Bar
        if (scrollProgress) {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Active state for nav links
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if (navLink) navLink.classList.add('active');
            } else {
                if (navLink) navLink.classList.remove('active');
            }
        });

        // Sticky Mobile CTA Check
        // Show after hero section is passed
        const heroSection = document.getElementById('hero');
        if (window.innerWidth <= 768 && heroSection) {
            if (scrollY > heroSection.offsetHeight / 2) {
                mobileStickyCta.classList.add('visible');
            } else {
                mobileStickyCta.classList.remove('visible');
            }
        }
    });

    // 3.5 Animated Number Counters
    const counters = document.querySelectorAll('.counter');
    const counterOptions = {
        threshold: 0.5,
        rootMargin: "0px"
    };

    const animateCounters = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60 fps math

                let currentCount = 0;
                
                const updateCounter = () => {
                    currentCount += increment;
                    if (currentCount < target) {
                        counter.innerText = Math.ceil(currentCount);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, counterOptions);

    counters.forEach(counter => {
        animateCounters.observe(counter);
    });

    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenu.classList.contains('active') ? 'x' : 'menu';
        mobileMenuBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
            lucide.createIcons();
        });
    });

    // 5. Scroll to Top
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 6. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open faqs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // 8. 3D Tilt Effect for Cards
    const cards = document.querySelectorAll('.glass:not(.faq-item):not(.navbar)');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });


    // 7. Form Validation & Mock Submit
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const contact = document.getElementById('contact-method').value;
            const btnSubmit = leadForm.querySelector('.btn-submit');

            if (!name || !contact) {
                return; // HTML5 required attribute should catch this, but just in case
            }

            // Mock submission state
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = 'Odesílám...';
            btnSubmit.style.opacity = '0.7';
            btnSubmit.style.pointerEvents = 'none';

            // Simulate network request
            setTimeout(() => {
                leadForm.reset();
                btnSubmit.innerHTML = originalText;
                btnSubmit.style.opacity = '1';
                btnSubmit.style.pointerEvents = 'all';

                // Show success message
                const successMsg = document.querySelector('.form-success');
                successMsg.style.display = 'block';

                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }, 1000);
        });
    }

    // Ebook Mock Submit
    const ebookForm = document.getElementById('ebook-form');
    if (ebookForm) {
        ebookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = ebookForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Odesílám...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                ebookForm.reset();
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'all';

                const successMsg = document.getElementById('ebook-success');
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }, 1000);
        });
    }

    // 10. Pricing Toggle Logic
    const pricingToggle = document.getElementById('pricing-toggle');
    const labelMonthly = document.getElementById('label-monthly');
    const labelYearly = document.getElementById('label-yearly');

    // Care package specific elements
    const carePrice = document.getElementById('care-price');
    const careCurrency = document.getElementById('care-currency');
    const careBilling = document.getElementById('care-billing');

    if (pricingToggle) {
        pricingToggle.addEventListener('change', () => {
            if (pricingToggle.checked) {
                // Yearly
                labelMonthly.classList.remove('active');
                labelYearly.classList.add('active');

                carePrice.textContent = '5 000';
                careCurrency.textContent = 'Kč / rok';
                careBilling.textContent = 'Ročně';
            } else {
                // Monthly
                labelYearly.classList.remove('active');
                labelMonthly.classList.add('active');

                carePrice.textContent = '600';
                careCurrency.textContent = 'Kč / měsíc';
                careBilling.textContent = 'Měsíčně';
            }
        });
    }

    // 11. Pre-fill Contact Form based on Pricing Selection
    const pricingButtons = document.querySelectorAll('.pricing-footer .btn');

    if (pricingButtons) {
        pricingButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const packageType = btn.getAttribute('data-package');
                if (!packageType) return;

                let targetId = '';
                if (packageType === 'care' && pricingToggle) {
                    // Check if Care is monthly or yearly
                    if (pricingToggle.checked) {
                        targetId = 'package-care-yearly';
                    } else {
                        targetId = 'package-care-monthly';
                    }
                } else {
                    targetId = 'package-' + packageType;
                }

                const targetCheckbox = document.getElementById(targetId);
                if (targetCheckbox) {
                    targetCheckbox.checked = true;
                }
            });
        });
    }

    // 12. Portfolio Modals
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const modalOverlay = document.getElementById('portfolio-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalMetrics = document.getElementById('modal-metrics');
    const modalTags = document.getElementById('modal-tags');
    const modalIcon = document.getElementById('modal-icon');
    const modalExternalLink = document.getElementById('modal-external-link');

    const portfolioData = {
        cleanify: {
            title: 'Cleanify.cz',
            icon: 'sparkles',
            url: 'https://cleanify.cz',
            description: '<p>Tvorba zcela nové a moderní online identity pro zavedenou úklidovou firmu. Cílem bylo zbavit se "korporátního" a chladného dojmu a zaměřit se na čistotu, jednoduchost a okamžitou důvěru klienta.</p><p>Web obsahuje rychlý rezervační systém poptávek, ukázky "Před a Po" a detailní ceník rozdělený do balíčků. Díky micro-web formátu návštěvník najde vše na jediné stránce bez bloudění.</p>',
            tags: ['<span class="tag">Micro-web</span>', '<span class="tag">Služby</span>'],
            metrics: `
                <div class="metric-box">
                    <div class="metric-value">+45 %</div>
                    <div class="metric-label">Nárůst poptávek</div>
                </div>
                <div class="metric-box">
                    <div class="metric-value">-30 %</div>
                    <div class="metric-label">Bounce Rate</div>
                </div>
            `
        },
        gingershot: {
            title: 'Najgingershot.cz',
            icon: 'coffee',
            url: 'https://najgingershot.cz',
            description: '<p>Kompletní návrh prémiového e-shopu na míru zaměřeného na prodej zdravých zázvorových shotů. Cílem byl moderní, šťavnatý design s prvky "zdravého životního stylu".</p><p>Klíčovým prvkem byla implementace předplatitelského modulu, který klientům umožňuje pravidelný měsíční odběr. E-shop je plně optimalizovaný pro nákupy z mobilních zařízení s Apple/Google Pay pro rychlý a impulzivní nákup.</p>',
            tags: ['<span class="tag">E-shop</span>', '<span class="tag">Zdraví</span>'],
            metrics: `
                <div class="metric-box">
                    <div class="metric-value">+120 %</div>
                    <div class="metric-label">Konverze Mobile</div>
                </div>
                <div class="metric-box">
                    <div class="metric-value">25 %</div>
                    <div class="metric-label">Uživatelů na subskripci</div>
                </div>
            `
        },
        draiv: {
            title: 'Draiv.cz (V procesu)',
            icon: 'hammer',
            url: 'https://draiv.cz',
            description: '<p>Aktuálně pracujeme na rozsáhlém a dynamickém e-shopu Draiv.cz. Jedná se o budoucí platformu, která nabídne velkozpracování objednávek s důrazem na bleskovou rychlost a plynulost uživatelského rozhraní.</p><p>Projekt je stavěn s využitím moderních headless PWA přístupů k odemknutí maximálního výkonu a nativního "app-like" zážitku u uživatele.</p>',
            tags: ['<span class="tag">E-shop / Headless</span>', '<span class="tag">V přípravě</span>'],
            metrics: `
                <div class="metric-box" style="grid-column: 1 / -1;">
                    <div class="metric-value">Přípravná fáze</div>
                    <div class="metric-label">Očekávané spuštění: Q3 2026</div>
                </div>
            `
        }
    };

    if (portfolioCards && modalOverlay) {
        portfolioCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-modal');
                if (projectId && portfolioData[projectId]) {
                    const data = portfolioData[projectId];

                    modalTitle.textContent = data.title;
                    modalDesc.innerHTML = data.description;
                    modalTags.innerHTML = data.tags.join('');
                    modalMetrics.innerHTML = data.metrics;

                    // Handle external link
                    if (data.url && modalExternalLink) {
                        modalExternalLink.href = data.url;
                        modalExternalLink.style.display = 'inline-flex';
                    } else if (modalExternalLink) {
                        modalExternalLink.style.display = 'none';
                    }

                    // Replace lucide icon
                    modalIcon.setAttribute('data-lucide', data.icon);
                    lucide.createIcons();

                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // prevent background scrolling
                }
            });
        });

        // Close modal
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 13. Load Blog Articles
    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid) {
        fetch('articles.json')
            .then(response => response.json())
            .then(articles => {
                blogGrid.innerHTML = '';
                // Take top 3 articles for the homepage
                const recentArticles = articles.slice(0, 3);

                recentArticles.forEach((article, index) => {
                    const delay = index * 100;

                    const cardHTML = `
                        <div class="blog-card glass reveal-up" style="transition-delay: ${delay}ms;">
                            <div class="blog-img-wrapper">
                                <img src="${article.image}" alt="${article.title}">
                            </div>
                            <div class="blog-content">
                                <span class="blog-date">${new Date(article.date).toLocaleDateString('cs-CZ')}</span>
                                <h3>${article.title}</h3>
                                <p>${article.excerpt}</p>
                                <a href="article.html?id=${article.id}" class="blog-link">Číst více <i data-lucide="arrow-right"></i></a>
                            </div>
                        </div>
                    `;
                    blogGrid.insertAdjacentHTML('beforeend', cardHTML);
                });

                // Re-initialize icons for newly added HTML
                lucide.createIcons();

                // Observe new elements for scroll animation
                const newRevealElements = blogGrid.querySelectorAll('.reveal-up');
                newRevealElements.forEach(el => revealOnScroll.observe(el));
            })
            .catch(error => {
                console.error("Error loading articles:", error);
                blogGrid.innerHTML = '<p style="text-align: center; width: 100%;">Články se zatím připravují.</p>';
            });
    }

});
