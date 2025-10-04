// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

/*
 * GEP Website - Main JavaScript File
 * Handles all client-side interactions
 */

(function () {
    'use strict';

    // ========================================
    // Document Ready Functions
    // ========================================
    document.addEventListener('DOMContentLoaded', function () {
        initBackToTop();
        initFormValidation();
        initSmoothScroll();
        initMobileMenu();
        initAlertDismiss();
        initTooltips();
        initCounterAnimation();
    });

    // ========================================
    // Back to Top Button
    // ========================================
    function initBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        if (!backToTopButton) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        // Smooth scroll to top
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // Form Validation
    // ========================================
    function initFormValidation() {
        const forms = document.querySelectorAll('.needs-validation');

        Array.prototype.slice.call(forms).forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();

                    // Focus on first invalid field
                    const firstInvalid = form.querySelector(':invalid');
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                }

                form.classList.add('was-validated');
            }, false);

            // Real-time validation feedback
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(function (input) {
                input.addEventListener('blur', function () {
                    if (input.checkValidity()) {
                        input.classList.remove('is-invalid');
                        input.classList.add('is-valid');
                    } else {
                        input.classList.remove('is-valid');
                        input.classList.add('is-invalid');
                    }
                });
            });
        });
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Ignore empty or just hash anchors
                if (href === '#' || href.length <= 1) {
                    return;
                }

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerOffset = 80; // Adjust for sticky header
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // Mobile Menu Enhancement
    // ========================================
    function initMobileMenu() {
        const navbar = document.getElementById('mainNavbar');
        const toggler = document.querySelector('.navbar-toggler');

        if (!navbar || !toggler) return;

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInside = navbar.contains(event.target) || toggler.contains(event.target);

            if (!isClickInside && navbar.classList.contains('show')) {
                toggler.click();
            }
        });

        // Close menu when clicking on a link (mobile)
        const navLinks = navbar.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth < 992 && navbar.classList.contains('show')) {
                    toggler.click();
                }
            });
        });
    }

    // ========================================
    // Alert Auto-dismiss
    // ========================================
    function initAlertDismiss() {
        const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');

        alerts.forEach(alert => {
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        });
    }

    // ========================================
    // Initialize Bootstrap Tooltips
    // ========================================
    function initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // ========================================
    // Counter Animation for Statistics
    // ========================================
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString() + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString() + '+';
            }
        };

        updateCounter();
    }

    // ========================================
    // Scroll Animations
    // ========================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            if (el.classList.contains('fade-in-up')) {
                el.style.transform = 'translateY(30px)';
            } else if (el.classList.contains('slide-in-left')) {
                el.style.transform = 'translateX(-30px)';
            } else if (el.classList.contains('slide-in-right')) {
                el.style.transform = 'translateX(30px)';
            }
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    };

    // Initialize scroll animations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animateOnScroll);
    } else {
        animateOnScroll();
    }

    // ========================================
    // Utility Functions
    // ========================================

    // Format currency
    window.formatCurrency = function (amount) {
        return 'R' + amount.toLocaleString('en-ZA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Debounce function for performance
    window.debounce = function (func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Show loading spinner
    window.showLoading = function (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
        }
    };

    // Hide loading spinner
    window.hideLoading = function (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '';
        }
    };

    // ========================================
    // Console Welcome Message
    // ========================================
    console.log('%cGEP Website', 'color: #0d5e2a; font-size: 24px; font-weight: bold;');
    console.log('%cGauteng Enterprise Propeller', 'color: #666; font-size: 14px;');
    console.log('');
    console.log('For support: info@gep.co.za');

})();