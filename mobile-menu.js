// Mobile Menu Functionality
let mobileMenuOpen = false;

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        mobileMenu.style.display = 'block';
        overlay.style.display = 'block';
        setTimeout(() => {
            mobileMenu.classList.add('open');
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
        mobileMenu.classList.remove('open');
        setTimeout(() => {
            mobileMenu.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenuOpen && 
        !mobileMenu.contains(event.target) && 
        !mobileMenuBtn.contains(event.target)) {
        toggleMobileMenu();
    }
});

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && mobileMenuOpen) {
        toggleMobileMenu();
    }
});

// Close mobile menu when clicking a link (except external links)
document.querySelectorAll('.mobile-menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
        if (this.getAttribute('href') && !this.getAttribute('href').startsWith('http')) {
            toggleMobileMenu();
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && mobileMenuOpen) {
        toggleMobileMenu();
    }
});
