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

    // 5. ANTES E DEPOIS (Coverflow Autoplay)
    const cfSlides = document.querySelectorAll('.cf-slide');
    if(cfSlides.length > 0) {
        let cfCurrent = 0;
        let cfInterval;

        function updateCoverflow() {
            cfSlides.forEach(slide => {
                slide.className = 'cf-slide'; // reseta todas classes
            });

            // Active
            cfSlides[cfCurrent].classList.add('active');

            // Prevs
            const prev1 = (cfCurrent - 1 + cfSlides.length) % cfSlides.length;
            const prev2 = (cfCurrent - 2 + cfSlides.length) % cfSlides.length;
            cfSlides[prev1].classList.add('prev1');
            cfSlides[prev2].classList.add('prev2');

            // Nexts
            const next1 = (cfCurrent + 1) % cfSlides.length;
            const next2 = (cfCurrent + 2) % cfSlides.length;
            cfSlides[next1].classList.add('next1');
            cfSlides[next2].classList.add('next2');
        }

        function nextSlide() {
            cfCurrent = (cfCurrent + 1) % cfSlides.length;
            updateCoverflow();
        }

        function startAutoplay() {
            // Garante que não duplica
            clearInterval(cfInterval);
            cfInterval = setInterval(nextSlide, 2000);
        }

        function stopAutoplay() {
            clearInterval(cfInterval);
        }

        // Init
        updateCoverflow();
        startAutoplay();

        // Pause on Hold
        const container = document.querySelector('.coverflow-container');
        if (container) {
            container.addEventListener('mousedown', stopAutoplay);
            container.addEventListener('touchstart', stopAutoplay);
            
            container.addEventListener('mouseup', startAutoplay);
            container.addEventListener('mouseleave', startAutoplay);
            container.addEventListener('touchend', startAutoplay);
        }
    }

    // 6. INFINITE SCROLL (Estudos de Caso - Ultra-Fluido)
    const track = document.querySelector('.carousel-track');
    if (track) {
        const originalSet = track.querySelectorAll('.original-set');
        
        // Função para calcular o offset do set central
        const getSetWidth = () => {
            const first = originalSet[0];
            const last = originalSet[originalSet.length - 1];
            // Largura de um set = gap + largura total dos cards originais
            return last.offsetLeft + last.clientWidth - first.offsetLeft + 32; // 32 é o gap de 2rem
        };

        const firstOriginal = originalSet[0];

        // Centralização Inicial
        window.addEventListener('load', () => {
            if (firstOriginal) {
                const centerOffset = (track.clientWidth - firstOriginal.clientWidth) / 2;
                track.scrollLeft = firstOriginal.offsetLeft - centerOffset;
            }
        });

        let isTicking = false;

        track.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const setWidth = getSetWidth();
                    const scrollLeft = track.scrollLeft;
                    
                    // Se estiver muito à direita (entrou no Set C)
                    if (scrollLeft >= setWidth * 2) {
                        track.scrollLeft = scrollLeft - setWidth;
                    } 
                    // Se estiver muito à esquerda (voltou pro Set A)
                    else if (scrollLeft <= setWidth / 2) {
                        track.scrollLeft = scrollLeft + setWidth;
                    }
                    
                    isTicking = false;
                });
                isTicking = true;
            }
        });
    }
});
