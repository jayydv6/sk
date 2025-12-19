// Add these functions to your existing script.js file

// Load single predictions on home page
function loadSinglePredictions() {
    const today = new Date().toISOString().split('T')[0];
    const predictions = JSON.parse(localStorage.getItem('matkaPredictions') || '[]');
    
    // Get top single predictions for today
    const todaySinglePredictions = predictions.filter(p => 
        p.date === today && p.numbers && p.numbers.length === 1
    ).slice(0, 3);
    
    const container = document.getElementById('predictions-list');
    if (!container) return;
    
    if (todaySinglePredictions.length === 0) {
        // If no single predictions, show regular predictions
        loadPredictions();
        return;
    }
    
    // Display single predictions
    container.innerHTML = todaySinglePredictions.map(pred => {
        const number = pred.numbers[0];
        const gameName = pred.game.toUpperCase();
        const accuracy = pred.accuracy || '--';
        
        return `
            <div class="prediction-item">
                <div class="prediction-header">
                    <div>
                        <span class="guesser-name">${pred.guesserName}</span>
                        <span class="guesser-id">Single Prediction</span>
                    </div>
                    <div class="guesser-rating">
                        <i class="fas fa-star"></i> ${accuracy}%
                    </div>
                </div>
                <div style="font-size: 0.9rem; color: #a0a0c0; margin-bottom: 8px;">
                    ${gameName} • Posted at ${pred.time}
                </div>
                <div style="text-align: center; margin: 15px 0;">
                    <div class="spot-prediction-number">${number}</div>
                    <div style="font-size: 0.8rem; color: #a0a0c0;">Single Number Prediction</div>
                </div>
            </div>
        `;
    }).join('');
}

// Update the loadPredictions function to show both types
function loadPredictions() {
    const today = new Date().toISOString().split('T')[0];
    const predictions = JSON.parse(localStorage.getItem('matkaPredictions') || '[]');
    
    // Get top predictions for today (both single and spot)
    const todayPredictions = predictions
        .filter(p => p.date === today)
        .sort((a, b) => {
            // Prioritize single predictions
            if (a.numbers.length === 1 && b.numbers.length !== 1) return -1;
            if (b.numbers.length === 1 && a.numbers.length !== 1) return 1;
            return 0;
        })
        .slice(0, 4);
    
    const container = document.getElementById('predictions-list');
    if (!container) return;
    
    if (todayPredictions.length === 0) {
        container.innerHTML = '<p style="color: #a0a0c0; text-align: center; padding: 20px;">No predictions submitted yet today.</p>';
        return;
    }
    
    container.innerHTML = todayPredictions.map(pred => {
        const isSingle = pred.numbers.length === 1;
        
        if (isSingle) {
            const number = pred.numbers[0];
            return `
                <div class="prediction-item">
                    <div class="prediction-header">
                        <div>
                            <span class="guesser-name">${pred.guesserName}</span>
                            <span class="guesser-id">Single</span>
                        </div>
                        <div class="guesser-rating">
                            <i class="fas fa-star"></i> ${pred.accuracy || 'N/A'}%
                        </div>
                    </div>
                    <div style="font-size: 0.9rem; color: #a0a0c0; margin-bottom: 8px;">
                        ${pred.game.toUpperCase()} • ${pred.time}
                    </div>
                    <div style="text-align: center; margin: 10px 0;">
                        <div class="spot-prediction-number" style="font-size: 2.5rem;">${number}</div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="prediction-item">
                    <div class="prediction-header">
                        <div>
                            <span class="guesser-name">${pred.guesserName}</span>
                            <span class="guesser-id">Spot</span>
                        </div>
                        <div class="guesser-rating">
                            <i class="fas fa-star"></i> ${pred.accuracy || 'N/A'}%
                        </div>
                    </div>
                    <div style="font-size: 0.9rem; color: #a0a0c0; margin-bottom: 8px;">
                        ${pred.game.toUpperCase()} • ${pred.time}
                    </div>
                    <div class="prediction-numbers">
                        ${pred.numbers.map(num => `<span class="prediction-number">${num}</span>`).join('')}
                    </div>
                </div>
            `;
        }
    }).join('');
}

// Update contact links with settings
function loadContactLinks() {
    // Load settings
    const settings = JSON.parse(localStorage.getItem('matkaSettings') || '{}');
    const contacts = settings.contacts || {};
    
    const contactsList = [
        { icon: 'fab fa-telegram', name: 'Telegram Channel', link: contacts.telegram || '#', color: '#0088cc' },
        { icon: 'fab fa-whatsapp', name: 'WhatsApp Support', link: contacts.whatsapp ? `https://wa.me/${contacts.whatsapp}` : '#', color: '#25D366' },
        { icon: 'fas fa-phone', name: 'Admin Phone', link: contacts.phone ? `tel:${contacts.phone}` : '#', color: '#f50057' },
        { icon: 'fas fa-crown', name: 'Premium Access', link: 'login.html?type=premium', color: '#ffd700' }
    ];
    
    // Desktop contacts
    const desktopContainer = document.getElementById('contact-links');
    if (desktopContainer) {
        desktopContainer.innerHTML = contactsList.map(contact => `
            <a href="${contact.link}" class="contact-link" ${contact.link === '#' ? 'onclick="return false;"' : ''}>
                <i class="${contact.icon}" style="color: ${contact.color}; font-size: 1.2rem;"></i>
                <span>${contact.name}</span>
            </a>
        `).join('');
    }
    
    // Mobile contacts
    const mobileContainer = document.getElementById('mobile-contact-links');
    if (mobileContainer) {
        mobileContainer.innerHTML = contactsList.map(contact => `
            <a href="${contact.link}" class="mobile-contact-link" ${contact.link === '#' ? 'onclick="return false;"' : ''}>
                <i class="${contact.icon}" style="color: ${contact.color};"></i>
                <span>${contact.name}</span>
            </a>
        `).join('');
    }
    
    // Update Khaiwal Telegram button
    const khaiwalBtn = document.getElementById('khaiwal-telegram');
    if (khaiwalBtn && contacts.khaiwalTelegram) {
        khaiwalBtn.href = contacts.khaiwalTelegram;
        khaiwalBtn.onclick = null;
    }
    
    // Update Telegram group button
    const telegramBtn = document.getElementById('telegram-group-btn');
    if (telegramBtn && contacts.telegram) {
        telegramBtn.href = contacts.telegram;
        telegramBtn.onclick = null;
    }
}

// Update game times from settings
function updateGameTimesFromSettings() {
    const settings = JSON.parse(localStorage.getItem('matkaSettings') || '{}');
    const gameTimes = settings.gameTimes || {
        faridabad: '05:15 PM',
        gaziabad: '09:15 PM',
        gali: '10:30 PM',
        deshwar: '04:45 PM',
        gali_dubai: '02:30 PM',
        deshwar_dubai: '11:45 PM'
    };
    
    // Update game times display
    document.getElementById('time-1').textContent = gameTimes.faridabad;
    document.getElementById('time-2').textContent = gameTimes.gaziabad;
    document.getElementById('time-3').textContent = gameTimes.gali;
    document.getElementById('time-4').textContent = gameTimes.deshwar;
    document.getElementById('time-5').textContent = gameTimes.gali_dubai;
    document.getElementById('time-6').textContent = gameTimes.deshwar_dubai;
    
    // Update games object
    games[1].time = gameTimes.faridabad;
    games[2].time = gameTimes.gaziabad;
    games[3].time = gameTimes.gali;
    games[4].time = gameTimes.deshwar;
    games[5].time = gameTimes.gali_dubai;
    games[6].time = gameTimes.deshwar_dubai;
}

// Update the DOMContentLoaded function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Matka King Website Initialized');
    
    // Initialize Local Storage with Default Data
    initializeLocalStorage();
    
    // Load settings first
    const settings = JSON.parse(localStorage.getItem('matkaSettings') || '{}');
    if (!settings.contacts) {
        // Initialize default settings
        const defaultSettings = {
            contacts: {
                telegram: '#',
                whatsapp: '',
                phone: '',
                email: '',
                khaiwalTelegram: '#',
                premiumContact: 'Contact admin for premium access'
            },
            config: {
                siteTitle: 'Matka King',
                siteSlogan: 'Faridabad | Gaziabad | Gali | Deshwar | Gali Dubai | Deshwar Dubai',
                maintenanceMode: 'off',
                resultDelay: 5,
                predictionLimit: 10
            },
            gameTimes: {
                faridabad: '05:15 PM',
                gaziabad: '09:15 PM',
                gali: '10:30 PM',
                deshwar: '04:45 PM',
                gali_dubai: '02:30 PM',
                deshwar_dubai: '11:45 PM'
            },
            ads: {
                top: '',
                sidebar: '',
                mobile: ''
            }
        };
        localStorage.setItem('matkaSettings', JSON.stringify(defaultSettings));
    }
    
    // Update site title and slogan from settings
    if (settings.config) {
        document.title = settings.config.siteTitle + ' | Matka Results';
        const logo = document.querySelector('.logo h1');
        if (logo) logo.textContent = settings.config.siteTitle;
        const slogan = document.querySelector('.logo p');
        if (slogan && settings.config.siteSlogan) slogan.textContent = settings.config.siteSlogan;
    }
    
    // Load all components
    updateGameTimesFromSettings();
    initializeGames();
    loadResults();
    loadSinglePredictions(); // Changed from loadPredictions()
    loadContactLinks();
    setupEventListeners();
    updateRealTime();
    loadWebsiteStats();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to Matka King! Real-time results for 6 markets.', 'info');
    }, 1000);
    
    // Start auto-refresh
    startAutoRefresh();
});
