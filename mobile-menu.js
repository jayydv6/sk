// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    if (menu && overlay) {
        menu.classList.toggle('active');
        overlay.style.display = menu.classList.contains('active') ? 'block' : 'none';
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (overlay) {
        overlay.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking on menu items
    document.querySelectorAll('.mobile-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });
    
    // Initialize mobile menu button if exists
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn && !mobileBtn.onclick) {
        mobileBtn.onclick = toggleMobileMenu;
    }
    
    // Initialize mobile menu close button
    const closeBtn = document.querySelector('.mobile-menu-close');
    if (closeBtn && !closeBtn.onclick) {
        closeBtn.onclick = toggleMobileMenu;
    }
});

// Close menu on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const menu = document.querySelector('.mobile-menu');
        if (menu && menu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});
