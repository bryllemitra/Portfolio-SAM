class PortfolioController {
    constructor() {
        this.scrollContainer = document.querySelector('.scroll-container');
        this.modals = {
            project: document.getElementById('projectModal'),
            resume: document.getElementById('resumeModal')
        };
        this.modalTrack = document.getElementById('modalCarouselTrack');
        this.scrollTimeout = null;
        this.ticking = false;
    }

    init() {
        this.initScrollFix();
        this.initLazyLoading();
        this.initNavObserver();
        this.initOutsideClick();
        this.initScrollAnimations();

        setInterval(() => this.autoPlayCarousel('aboutCarouselTrack'), 3500);
        setInterval(() => this.autoPlayCarousel('heroCarouselTrack'), 4000);
    }


    initScrollFix() {
        this.scrollContainer.addEventListener('scroll', () => {
            this.scrollContainer.style.scrollBehavior = 'auto';
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.scrollContainer.style.scrollBehavior = 'smooth';
            }, 100);

            if (!this.ticking) {
                window.requestAnimationFrame(() => { this.ticking = false; });
                this.ticking = true;
            }
        });
    }

    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px 0px', threshold: 0.1 });
        images.forEach(img => observer.observe(img));
    }

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { 
            root: this.scrollContainer,
            threshold: 0.1 
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    initNavObserver() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { root: this.scrollContainer, threshold: 0.5 });
        sections.forEach(section => observer.observe(section));
    }

    moveCarousel(trackId, direction) {
        const track = document.getElementById(trackId);
        if (!track) return;
        track.scrollLeft += (direction === 1) ? track.clientWidth : -track.clientWidth;
    }

    autoPlayCarousel(trackId) {
        const track = document.getElementById(trackId);
        if (!track) return;
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollLeft += track.clientWidth;
        }
    }

    openProject(title, description, images) {
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalDesc').innerText = description;
        this.modalTrack.innerHTML = '';

        images.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            if (index === 0) {
                img.src = imgSrc;
            } else {
                img.dataset.src = imgSrc;
                img.loading = 'lazy';
            }
            img.alt = title + " image";
            this.modalTrack.appendChild(img);
        });

        this.modals.project.style.display = 'flex';
        this.modalTrack.scrollLeft = 0;
        
        setTimeout(() => {
            const lazyImages = this.modalTrack.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => img.src = img.dataset.src);
        }, 100);
    }

    closeProject() { this.modals.project.style.display = 'none'; }
    openResume() { this.modals.resume.style.display = 'flex'; }
    closeResume() { this.modals.resume.style.display = 'none'; }

    initOutsideClick() {
        window.addEventListener('click', (event) => {
            if (event.target === this.modals.project) this.closeProject();
            if (event.target === this.modals.resume) this.closeResume();
        });
    }
}

const app = new PortfolioController();
document.addEventListener('DOMContentLoaded', () => app.init());
window.moveCarousel = (id, dir) => app.moveCarousel(id, dir);
window.openProjectModal = (t, d, i) => app.openProject(t, d, i);
window.closeProjectModal = () => app.closeProject();
window.openResume = () => app.openResume();
window.closeResume = () => app.closeResume();