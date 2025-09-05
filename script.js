// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Modal logic
document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-modal');
        const modal = document.getElementById(id);
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });
});
document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
        const modal = el.closest('#demoModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });
});

// Background Canvas Animation (lightweight particles)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
(function initCanvas() {
    if (prefersReduced) return; // respect reduced motion
    const c = document.getElementById('bg-canvas');
    const ctx = c.getContext('2d');
    let w, h, particles;
    function resize() { w = c.width = innerWidth; h = c.height = document.querySelector('section#cta').offsetHeight + 120; }
    function createParticles() {
        particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            r: Math.random() * 2 + 0.5,
        }));
    }
    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(108,92,231,0.15)';
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        });
        // lines
        ctx.strokeStyle = 'rgba(34,211,238,0.08)';
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy);
                if (dist < 120) {
                    ctx.globalAlpha = 1 - dist / 120;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.globalAlpha = 1;
                }
            }
        }
        requestAnimationFrame(draw);
    }
    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize(); createParticles(); draw();
})();

// Typing simulation for Feature 1
const typingArea = document.getElementById('typing-area');
const suggestions = document.getElementById('suggestions');
const text = "Great ideas start with a single sentence. Let SynthMind guide your flow.";
let i = 0;
function type() {
    if (!typingArea) return;
    if (i < text.length) {
        typingArea.textContent += text.charAt(i);
        i++;
        setTimeout(type, 35);
    } else {
        suggestions.classList.remove('hidden');
    }
}
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { type(); io.disconnect(); } });
}, { threshold: 0.4 });
if (typingArea) io.observe(typingArea);

// Design morphs (Feature 2)
const grid = document.getElementById('design-grid');
let toggle = false;
function morph() {
    if (!grid) return;
    toggle = !toggle;
    [...grid.children].forEach((el, idx) => {
        el.style.transitionDuration = '800ms';
        el.style.borderRadius = toggle ? '0.75rem' : '1.25rem';
        el.style.transform = toggle ? `scale(${1 + (idx % 3) * 0.03}) rotate(${(idx % 2 ? 1 : -1) * 3}deg)` : 'scale(1) rotate(0deg)';
        el.style.opacity = toggle ? (0.7 + (idx % 3) * 0.1) : 1;
    });
}
setInterval(morph, 2200);

// Code autowrite (Feature 3)
const codeArea = document.getElementById('code-area');
const codeExtra = "\ntry {\n  const names = await fetchNames();\n  console.log(names);\n} catch (err) {\n  console.warn('Network issue, using cache');\n  return cache.get('users') || [];\n}";
const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { let j = 0; const t = () => { if (j < codeExtra.length) { codeArea.textContent += codeExtra[j++]; setTimeout(t, 18); } }; t(); io2.disconnect(); }
    })
}, { threshold: 0.4 });
if (codeArea) io2.observe(codeArea);

// GSAP ScrollTrigger (fade & slide for feature blocks)
window.addEventListener('load', () => {
    if (window.gsap && !prefersReduced) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.feature').forEach((el, i) => {
            gsap.from(el, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                },
            });
        });
    }
});

// Swiper init (Testimonials)
window.addEventListener('load', () => {
    new Swiper('#testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
});