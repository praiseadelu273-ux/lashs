// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link on scroll
        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Before/After slider
    const baSlider = document.getElementById('baSlider');
    const baDivider = document.getElementById('baDivider');
    const afterImage = document.querySelector('.ba-image.after');
    
    if (baSlider) {
        baSlider.addEventListener('input', function() {
            const value = this.value;
            if (afterImage) {
                afterImage.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
            }
            if (baDivider) {
                baDivider.style.left = value + '%';
            }
        });

        // Before/After thumbnails
        const baThumbs = document.querySelectorAll('.ba-thumb');
        baThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                baThumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const beforeSrc = this.getAttribute('data-before');
                const afterSrc = this.getAttribute('data-after');
                
                document.querySelector('.ba-image.before img').src = beforeSrc;
                document.querySelector('.ba-image.after img').src = afterSrc;
                
                baSlider.value = 50;
                afterImage.style.clipPath = 'inset(0 50% 0 0)';
                baDivider.style.left = '50%';
            });
        });
    }

    // Gallery lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            lightboxImage.src = imageSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Team card flip
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        const flipBtns = card.querySelectorAll('.flip-btn');
        flipBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                card.classList.toggle('flipped');
            });
        });
    });

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Booking form validation and submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Here you would normally send the data to your backend
            console.log('Booking data:', data);
            
            // Show success message
            alert('Thank you! Your booking request has been received. We will contact you shortly to confirm your appointment.');
            
            // Reset form
            this.reset();
        });

        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observe service cards, product cards, etc.
    const animatedElements = document.querySelectorAll(
        '.service-card, .product-card, .testimonial-card, .safety-card, .gift-card, .faq-item'
    );
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Add animation classes
    const style = document.createElement('style');
    style.textContent = `
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        section.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Initialize hero section as visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.classList.add('visible');
    }

    // Placeholder images (replace with actual images)
    const imagePlaceholders = [
        'images/before.jpg',
        'images/after.jpg',
        'images/before2.jpg',
        'images/after2.jpg',
        'images/before3.jpg',
        'images/after3.jpg',
        'images/gallery1.jpg',
        'images/gallery2.jpg',
        'images/gallery3.jpg',
        'images/gallery4.jpg',
        'images/gallery5.jpg',
        'images/gallery6.jpg',
        'images/insta1.jpg',
        'images/insta2.jpg',
        'images/insta3.jpg',
        'images/insta4.jpg',
        'images/insta5.jpg',
        'images/insta6.jpg',
        'images/artist1.jpg',
        'images/artist2.jpg',
        'images/artist3.jpg',
        'images/artist4.jpg'
    ];

    // Create placeholder images with gradient backgrounds
    imagePlaceholders.forEach(src => {
        const img = document.querySelector(`img[src="${src}"]`);
        if (img && !img.complete) {
            img.onerror = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 800;
                canvas.height = 600;
                const ctx = canvas.getContext('2d');
                
                // Create gradient
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#FF1493');
                gradient.addColorStop(1, '#FF69B4');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add text
                ctx.fillStyle = 'white';
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Lash Image', canvas.width / 2, canvas.height / 2);
                
                this.src = canvas.toDataURL();
            };
        }
    });

    // Log ready message
    console.log('Love My Lashes website loaded successfully!');
});
