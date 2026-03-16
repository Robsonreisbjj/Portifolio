/**
 * =====================================
 * SCRIPT PRINCIPAL - TEMA PIXELFORGE
 * =====================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ANIMAÇÕES ON-SCROLL (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        fadeInObserver.observe(el);
    });

    // 2. HEADER DINÂMICO
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. SMOOTH SCROLL PARA ÂNCORAS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. LÓGICA DO ACCORDION (Método)
    const accordionItems = document.querySelectorAll('.accordion-item');
    const accBanner = document.getElementById('acc-banner');

    accordionItems.forEach(item => {
        const title = item.querySelector('.acc-title');
        
        title.addEventListener('click', () => {
            // Fecha todos
            accordionItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.acc-content').style.display = 'none';
            });
            
            // Abre o clicado
            item.classList.add('active');
            item.querySelector('.acc-content').style.display = 'block';
            
            // Troca a imagem lateral suavemente
            if(accBanner) {
                const newImg = item.getAttribute('data-img');
                accBanner.style.opacity = '0';
                
                setTimeout(() => {
                    accBanner.src = newImg;
                    accBanner.style.opacity = '1';
                }, 300);
            }
        });
    });

    // 5. LÓGICA DO SLIDER (Estudos de Caso)
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.slider-next');
    const prevBtn = document.querySelector('.slider-prev');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    }
});
