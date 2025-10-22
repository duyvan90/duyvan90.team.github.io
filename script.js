document.addEventListener('DOMContentLoaded', () => {

    // ===== LOGIC CHO CURSOR (Giữ nguyên) =====
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.opacity = 1;
        });
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = 0;
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = 1;
        });
    }
    // ========================================

    // 1. Logic cho Animation Header (Giữ nguyên)
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.classList.add('animate'); 
    }

    // 2. Logic cho Carousel 3D (Giữ nguyên)
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.agent-card'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (!track || cards.length === 0) return; 

    const totalMembers = cards.length;
    let currentIndex = 0; 
    const angle = 360 / totalMembers; 
    const radius = 450; 

    const updateCarousel = (newIndex) => {
        currentIndex = (newIndex % totalMembers + totalMembers) % totalMembers;
        const rotateY = -currentIndex * angle;
        track.style.transform = `rotateY(${rotateY}deg)`;
        cards.forEach((card, index) => {
            const isCurrent = index === currentIndex;
            const isPrev = index === (currentIndex - 1 + totalMembers) % totalMembers;
            const isNext = index === (currentIndex + 1) % totalMembers;
            const cardAngle = index * angle; 
            card.classList.remove('visible', 'neighbor');
            let scaleFactor = 0.85; 
            if (isCurrent) {
                card.classList.add('visible');
                scaleFactor = 1.0; 
            } else if (isPrev || isNext) {
                card.classList.add('neighbor');
                scaleFactor = 0.95; 
            }
            card.style.transform = `
                rotateY(${cardAngle}deg)
                translateZ(${radius}px)
                scale(${scaleFactor})
            `;
            card.dataset.member = index;
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
            dot.dataset.member = index; 
        });
    };
    updateCarousel(0); 
    prevBtn.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
    });
    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const targetIndex = parseInt(e.target.dataset.member);
            updateCarousel(targetIndex);
        });
    });
    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            if (!e.currentTarget.classList.contains('visible')) {
                const targetIndex = parseInt(e.currentTarget.dataset.member);
                updateCarousel(targetIndex);
            }
        });
    });
});

// ===== PAGE SWITCHING (ĐÃ CẬP NHẬT) =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section-block');
const pageTriggers = document.querySelectorAll('.nav-link, .access-terminal-btn');
const bodyEl = document.body; // <-- [THAY ĐỔI 4]: Lấy thẻ body

pageTriggers.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').replace('#', ''); // vd: "team-overview"
        const targetHref = link.getAttribute('href'); 

        // --- LOGIC THAY BACKGROUND (ĐÃ THÊM) ---
        // 1. Xóa hết các class background cũ
        bodyEl.classList.remove('bg-team', 'bg-projects', 'bg-contact');

        // 2. Thêm class background mới dựa trên ID
        switch (targetId) {
            case 'team-overview':
                bodyEl.classList.add('bg-team');
                break;
            case 'projects':
                bodyEl.classList.add('bg-projects');
                break;
            case 'contact':
                bodyEl.classList.add('bg-contact');
                break;
            // case 'about-us': không cần làm gì, nó sẽ dùng nền BG1.jpg mặc định
        }
        // --- KẾT THÚC LOGIC BACKGROUND ---

        // (Phần logic chuyển trang còn lại giữ nguyên)
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        const activeNavLink = document.querySelector(`.nav-link[href="${targetHref}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});