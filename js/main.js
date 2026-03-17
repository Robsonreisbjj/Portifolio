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

    // 6. INFINITE SCROLL (Estudos de Caso - Dinâmico com Clonagem)
    const track = document.querySelector('.carousel-track');
    if (track) {
        const setupCarousel = () => {
            const originalCards = Array.from(track.children);
            if (originalCards.length === 0) return;

            // Limpa clones antigos se houver (para evitar duplicatas no resize)
            track.querySelectorAll('.carousel-clone').forEach(el => el.remove());

            // Clona cards para o início (Buffer A) e fim (Buffer C)
            const clonesEnd = originalCards.map(card => {
                const clone = card.cloneNode(true);
                clone.classList.add('carousel-clone');
                return clone;
            });
            const clonesStart = originalCards.map(card => {
                const clone = card.cloneNode(true);
                clone.classList.add('carousel-clone');
                return clone;
            });

            // Adiciona clones ao track
            clonesEnd.forEach(clone => track.appendChild(clone));
            clonesStart.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));

            // Função para calcular largura de um set completo
            const getSetWidth = () => {
                const gap = parseFloat(getComputedStyle(track).gap) || 32;
                const totalCardsWidth = originalCards.reduce((acc, card) => acc + card.offsetWidth, 0);
                return totalCardsWidth + (originalCards.length * gap);
            };

            // Centralização Inicial
            setTimeout(() => {
                const setWidth = getSetWidth();
                track.scrollLeft = setWidth;
            }, 100);

            // 6.1 DRAG TO SCROLL (Desktop)
            let isDown = false;
            let isTicking = false;
            let startX;
            let scrollLeftPos;

            track.addEventListener('mousedown', (e) => {
                isDown = true;
                track.style.scrollSnapType = 'none';
                startX = e.pageX - track.offsetLeft;
                scrollLeftPos = track.scrollLeft;
            });

            track.addEventListener('mouseleave', () => {
                isDown = false;
                track.style.scrollSnapType = 'x mandatory';
            });

            track.addEventListener('mouseup', () => {
                isDown = false;
                track.style.scrollSnapType = 'x mandatory';
            });

            track.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - track.offsetLeft;
                const walk = (x - startX) * 2;
                track.scrollLeft = scrollLeftPos - walk;
            });

            // 6.2 LÓGICA DE INFINITE SCROLL NO EVENTO DE SCROLL
            track.addEventListener('scroll', () => {
                if (!isTicking) {
                    window.requestAnimationFrame(() => {
                        const setWidth = getSetWidth();
                        const currentScroll = track.scrollLeft;
                        
                        if (currentScroll >= setWidth * 2) {
                            track.scrollLeft = currentScroll - setWidth;
                        } else if (currentScroll <= 0) {
                            track.scrollLeft = currentScroll + setWidth;
                        }
                        isTicking = false;
                    });
                    isTicking = true;
                }
            });
        };

        window.addEventListener('load', setupCarousel);
        // Opcional: Recalcular no redimensionamento da tela
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(setupCarousel, 250);
        });
    }
});
