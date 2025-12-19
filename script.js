// Matka King - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Matka King Website Initialized');
    
    // Initialize Local Storage with Default Data
    initializeLocalStorage();
    
    // Load all components
    initializeGames();
    loadResults();
    loadPredictions();
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

// Initialize Local Storage with Default Data
function initializeLocalStorage() {
    // Initialize users if not exists
    if (!localStorage.getItem('matkaUsers')) {
        const defaultUsers = [
            {
                id: 'admin001',
                username: 'admin',
                password: 'admin123',
                type: 'admin',
                name: 'Super Admin',
                email: 'admin@matkaking.com',
                created: new Date().toISOString(),
                status: 'active'
            },
            {
                id: 'guesser001',
                username: 'raju_guesser',
                password: 'pass123',
                type: 'guesser',
                name: 'Raju Kumar',
                created: new Date().toISOString(),
                status: 'active',
                balance: 5000
            },
            {
                id: 'premium001',
                username: 'vip_user',
                password: 'pass123',
                type: 'premium',
                name: 'VIP User',
                created: new Date().toISOString(),
                status: 'active',
                balance: 15000
            }
        ];
        localStorage.setItem('matkaUsers', JSON.stringify(defaultUsers));
    }
    
    // Initialize results if not exists
    if (!localStorage.getItem('matkaResults')) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const defaultResults = {
            [yesterdayStr]: {
                faridabad: { result: '45', published: true, time: '05:15 PM' },
                gaziabad: { result: '78', published: true, time: '09:15 PM' },
                gali: { result: '23', published: true, time: '10:30 PM' },
                deshwar: { result: '56', published: true, time: '04:45 PM' },
                gali_dubai: { result: '89', published: true, time: '02:30 PM' },
                deshwar_dubai: { result: '12', published: true, time: '11:45 PM' }
            }
        };
        localStorage.setItem('matkaResults', JSON.stringify(defaultResults));
    }
    
    // Initialize predictions if not exists
    if (!localStorage.getItem('matkaPredictions')) {
        const today = new Date().toISOString().split('T')[0];
        const defaultPredictions = [
            {
                id: 'pred1',
                guesserId: 'guesser001',
                guesserName: 'Raju Kumar',
                game: 'faridabad',
                numbers: ['45', '67', '89'],
                date: today,
                time: '03:00 PM',
                isCorrect: undefined,
                accuracy: undefined,
                actualResult: null
            },
            {
                id: 'pred2',
                guesserId: 'guesser001',
                guesserName: 'Raju Kumar',
                game: 'gaziabad',
                numbers: ['23', '45', '78'],
                date: today,
                time: '04:00 PM',
                isCorrect: undefined,
                accuracy: undefined,
                actualResult: null
            }
        ];
        localStorage.setItem('matkaPredictions', JSON.stringify(defaultPredictions));
    }
    
    // Initialize guesser numbers if not exists
    if (!localStorage.getItem('guesserNumbers')) {
        const defaultNumbers = {
            faridabad: ['10', '25', '36', '47', '58', '69', '72', '84', '91', '03'],
            gaziabad: ['15', '28', '37', '49', '52', '63', '74', '86', '95', '07'],
            gali: ['12', '24', '35', '46', '57', '68', '79', '81', '93', '05'],
            deshwar: ['11', '22', '33', '44', '55', '66', '77', '88', '99', '00'],
            gali_dubai: ['13', '26', '39', '42', '54', '67', '71', '85', '98', '02'],
            deshwar_dubai: ['14', '27', '38', '41', '53', '65', '76', '87', '92', '06']
        };
        localStorage.setItem('guesserNumbers', JSON.stringify(defaultNumbers));
    }
    
    // Initialize admin activity log if not exists
    if (!localStorage.getItem('adminActivity')) {
        localStorage.setItem('adminActivity', JSON.stringify([]));
    }
}

// Game Data Structure
const games = {
    1: { name: 'FARIDABAD', time: '05:15 PM', status: 'upcoming', key: 'faridabad' },
    2: { name: 'GAZIABAD', time: '09:15 PM', status: 'upcoming', key: 'gaziabad' },
    3: { name: 'GALI', time: '10:30 PM', status: 'upcoming', key: 'gali' },
    4: { name: 'DESHWAR', time: '04:45 PM', status: 'upcoming', key: 'deshwar' },
    5: { name: 'GALI DUBAI', time: '02:30 PM', status: 'upcoming', key: 'gali_dubai' },
    6: { name: 'DESHWAR DUBAI', time: '11:45 PM', status: 'upcoming', key: 'deshwar_dubai' }
};

// Initialize games
function initializeGames() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    Object.keys(games).forEach(gameId => {
        const game = games[gameId];
        const gameTime = parseTime(game.time);
        
        // Update yesterday's result
        updateYesterdayResult(gameId);
        
        // Check if game has started
        if (gameTime.hour < currentHour || 
            (gameTime.hour === currentHour && gameTime.minute < currentMinute)) {
            game.status = 'active';
            updateGameStatus(gameId, 'Awaiting result...');
        }
        
        // Update display time
        document.getElementById(`time-${gameId}`).textContent = game.time;
    });
}

// Parse time string to hours and minutes
function parseTime(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    hours = parseInt(hours);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    return { hour: hours, minute: parseInt(minutes) };
}

// Load results from localStorage
function loadResults() {
    const today = new Date().toISOString().split('T')[0];
    const results = JSON.parse(localStorage.getItem('matkaResults') || '{}');
    const todayResults = results[today] || {};
    
    updateResultsDisplay(todayResults);
}

// Update results display
function updateResultsDisplay(todayResults) {
    Object.keys(games).forEach(gameId => {
        const game = games[gameId];
        const resultData = todayResults[game.key];
        const resultElement = document.getElementById(`result-${gameId}`);
        const statusElement = document.getElementById(`status-${gameId}`);
        const todayElement = document.getElementById(`today-${gameId}`);
        
        if (resultData && resultData.result) {
            resultElement.textContent = resultData.result;
            resultElement.className = 'single-result present';
            
            if (resultData.published) {
                statusElement.textContent = `Published at ${resultData.time}`;
                statusElement.className = 'result-status published';
                todayElement.textContent = resultData.result;
            } else {
                statusElement.textContent = 'Result ready (not published)';
                statusElement.className = 'result-status waiting';
                todayElement.textContent = '--';
            }
        } else {
            resultElement.textContent = '--';
            resultElement.className = 'single-result';
            
            // Check if game time has passed
            const gameTime = parseTime(game.time);
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            if (gameTime.hour < currentHour || 
                (gameTime.hour === currentHour && gameTime.minute < currentMinute)) {
                statusElement.textContent = 'Awaiting result...';
                statusElement.className = 'result-status waiting';
            } else {
                statusElement.textContent = `Game starts at ${game.time}`;
                statusElement.className = 'result-status';
            }
            
            todayElement.textContent = '--';
        }
    });
}

// Update yesterday's result
function updateYesterdayResult(gameId) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const results = JSON.parse(localStorage.getItem('matkaResults') || '{}');
    const yesterdayResults = results[yesterdayStr] || {};
    
    const game = games[gameId];
    const yesterdayResult = yesterdayResults[game.key];
    
    const yesterdayElement = document.getElementById(`yesterday-${gameId}`);
    if (yesterdayElement) {
        if (yesterdayResult && yesterdayResult.result) {
            yesterdayElement.textContent = yesterdayResult.result;
        } else {
            yesterdayElement.textContent = '--';
        }
    }
}

// Check for result update
function checkResult(gameId) {
    const game = games[gameId];
    const today = new Date().toISOString().split('T')[0];
    const results = JSON.parse(localStorage.getItem('matkaResults') || '{}');
    const resultData = results[today]?.[game.key];
    
    const resultElement = document.getElementById(`result-${gameId}`);
    const statusElement = document.getElementById(`status-${gameId}`);
    
    if (!resultElement || !statusElement) return;
    
    // Show checking animation
    resultElement.textContent = '...';
    resultElement.className = 'single-result checking';
    statusElement.textContent = 'Checking for updates...';
    
    // Simulate API call
    setTimeout(() => {
        if (resultData && resultData.result) {
            if (resultData.published) {
                resultElement.textContent = resultData.result;
                resultElement.className = 'single-result present';
                statusElement.textContent = `Result: ${resultData.result} (Published)`;
                statusElement.className = 'result-status published';
                
                // Update today's result
                const todayElement = document.getElementById(`today-${gameId}`);
                if (todayElement) todayElement.textContent = resultData.result;
                
                showNotification(`Result for ${game.name}: ${resultData.result}`, 'success');
            } else {
                resultElement.textContent = '--';
                resultElement.className = 'single-result';
                statusElement.textContent = 'Result not published yet';
                statusElement.className = 'result-status waiting';
                showNotification('Result not published yet. Check back soon.', 'info');
            }
        } else {
            resultElement.textContent = '--';
            resultElement.className = 'single-result';
            statusElement.textContent = 'No result available yet';
            showNotification('No result available for this game yet.', 'info');
        }
    }, 1500);
}

// Show prediction modal
function showPrediction(gameId) {
    const game = games[gameId];
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; background: rgba(26, 26, 46, 0.95); padding: 20px; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="color: #ff4081;">${game.name} Predictions</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <div id="prediction-content-${gameId}">
                <p>Loading predictions...</p>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="padding: 10px 20px; background: #f50057; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load predictions for this game
    setTimeout(() => {
        const predictions = getPredictionsForGame(game.key);
        const contentElement = document.getElementById(`prediction-content-${gameId}`);
        if (contentElement) {
            contentElement.innerHTML = predictions;
        }
    }, 500);
}

// Get predictions for a specific game
function getPredictionsForGame(gameKey) {
    const today = new Date().toISOString().split('T')[0];
    const predictions = JSON.parse(localStorage.getItem('matkaPredictions') || '[]');
    
    const gamePredictions = predictions.filter(p => 
        p.game === gameKey && p.date === today
    ).slice(0, 10);
    
    if (gamePredictions.length === 0) {
        return '<p style="color: #a0a0c0; text-align: center;">No predictions yet for this game.</p>';
    }
    
    let html = '<div style="max-height: 300px; overflow-y: auto;">';
    
    gamePredictions.forEach(pred => {
        html += `
            <div style="background: rgba(255,255,255,0.05); padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong style="color: #2196f3;">${pred.guesserName}</strong>
                    <span style="color: #ffd600;">${getRating(pred.accuracy || 0)}</span>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                    ${pred.numbers.map(num => 
                        `<span style="padding: 5px 10px; background: rgba(33,150,243,0.2); border-radius: 5px;">${num}</span>`
                    ).join('')}
                </div>
                ${pred.accuracy ? `<div style="font-size: 0.8rem; color: #a0a0c0;">Accuracy: ${pred.accuracy}%</div>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    html += '<p style="margin-top: 15px; font-size: 0.9rem; color: #a0a0c0; text-align: center;">Top predictions for this game</p>';
    
    return html;
}

// Get rating stars
function getRating(accuracy) {
    if (accuracy >= 90) return '★★★★★';
    if (accuracy >= 80) return '★★★★☆';
    if (accuracy >= 70) return '★★★☆☆';
    if (accuracy >= 60) return '★★☆☆☆';
    return '★☆☆☆☆';
}

// Load guesser predictions
function loadPredictions() {
    const today = new Date().toISOString().split('T')[0];
    const predictions = JSON.parse(localStorage.getItem('matkaPredictions') || '[]');
    
    // Get top predictions for today
    const todayPredictions = predictions
        .filter(p => p.date === today)
        .slice(0, 4);
    
    const container = document.getElementById('predictions-list');
    if (!container) return;
    
    if (todayPredictions.length === 0) {
        container.innerHTML = '<p style="color: #a0a0c0; text-align: center; padding: 20px;">No predictions submitted yet today.</p>';
        return;
    }
    
    container.innerHTML = todayPredictions.map(pred => `
        <div class="prediction-item">
            <div class="prediction-header">
                <div>
                    <span class="guesser-name">${pred.guesserName}</span>
                    <span class="guesser-id">(${pred.guesserId})</span>
                </div>
                <div class="guesser-rating">
                    <i class="fas fa-star"></i> ${pred.accuracy || 'N/A'}%
                </div>
            </div>
            <div style="font-size: 0.9rem; color: #a0a0c0; margin-bottom: 8px;">
                ${pred.game.toUpperCase()} • Posted at ${pred.time}
            </div>
            <div class="prediction-numbers">
                ${pred.numbers.map(num => `<span class="prediction-number">${num}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Load website statistics
function loadWebsiteStats() {
    const users = JSON.parse(localStorage.getItem('matkaUsers') || '[]');
    const guessers = users.filter(u => u.type === 'guesser').length;
    const predictions = JSON.parse(localStorage.getItem('matkaPredictions') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const todayPredictions = predictions.filter(p => p.date === today).length;
    
    // Calculate accuracy
    const correctPredictions = predictions.filter(p => p.isCorrect === true).length;
    const totalChecked = predictions.filter(p => p.isCorrect !== undefined).length;
    const accuracy = totalChecked > 0 ? Math.round((correctPredictions / totalChecked) * 100) : 0;
    
    // Update desktop stats
    const totalGuessersEl = document.getElementById('total-guessers');
    const totalPredictionsEl = document.getElementById('total-predictions');
    const accuracyRateEl = document.getElementById('accuracy-rate');
    
    if (totalGuessersEl) totalGuessersEl.textContent = guessers;
    if (totalPredictionsEl) totalPredictionsEl.textContent = todayPredictions;
    if (accuracyRateEl) accuracyRateEl.textContent = accuracy + '%';
    
    // Update mobile stats
    const mobileGuessersEl = document.getElementById('mobile-total-guessers');
    const mobilePredictionsEl = document.getElementById('mobile-total-predictions');
    const mobileAccuracyEl = document.getElementById('mobile-accuracy-rate');
    
    if (mobileGuessersEl) mobileGuessersEl.textContent = guessers;
    if (mobilePredictionsEl) mobilePredictionsEl.textContent = todayPredictions;
    if (mobileAccuracyEl) mobileAccuracyEl.textContent = accuracy + '%';
}

// Load contact links
function loadContactLinks() {
    const contacts = [
        { icon: 'fab fa-telegram', name: 'Telegram Channel', link: '#', color: '#0088cc' },
        { icon: 'fas fa-user-secret', name: 'Admin Support', link: '#', color: '#f50057' },
        { icon: 'fas fa-headset', name: '24/7 Help Desk', link: '#', color: '#00c853' },
        { icon: 'fas fa-crown', name: 'Premium Access', link: 'login.html?type=premium', color: '#ffd700' }
    ];
    
    // Desktop contacts
    const desktopContainer = document.getElementById('contact-links');
    if (desktopContainer) {
        desktopContainer.innerHTML = contacts.map(contact => `
            <a href="${contact.link}" class="contact-link">
                <i class="${contact.icon}" style="color: ${contact.color}; font-size: 1.2rem;"></i>
                <span>${contact.name}</span>
            </a>
        `).join('');
    }
    
    // Mobile contacts
    const mobileContainer = document.getElementById('mobile-contact-links');
    if (mobileContainer) {
        mobileContainer.innerHTML = contacts.map(contact => `
            <a href="${contact.link}" class="mobile-contact-link">
                <i class="${contact.icon}" style="color: ${contact.color};"></i>
                <span>${contact.name}</span>
            </a>
        `).join('');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Telegram group button
    const telegramBtn = document.getElementById('telegram-group-btn');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Join our Telegram group for instant updates!', 'info');
        });
    }
    
    // Khaiwal telegram button
    const khaiwalTelegram = document.getElementById('khaiwal-telegram');
    if (khaiwalTelegram) {
        khaiwalTelegram.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Contact Khaiwal support on Telegram for premium services.', 'info');
        });
    }
    
    // Premium buttons
    document.querySelectorAll('.btn-premium-small, .btn-premium').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.getAttribute('href') === 'login.html?type=premium') {
                e.preventDefault();
                window.location.href = 'login.html?type=premium';
            }
        });
    });
    
    // Check result buttons
    for (let i = 1; i <= 6; i++) {
        const checkBtn = document.querySelector(`[onclick="checkResult(${i})"]`);
        if (checkBtn) {
            checkBtn.onclick = function() { checkResult(i); };
        }
    }
    
    // Prediction buttons
    for (let i = 1; i <= 6; i++) {
        const predBtn = document.querySelector(`[onclick="showPrediction(${i})"]`);
        if (predBtn) {
            predBtn.onclick = function() { showPrediction(i); };
        }
    }
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Update real-time information
function updateRealTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    // Update any real-time elements
    document.querySelectorAll('.real-time').forEach(el => {
        el.textContent = timeString;
    });
    
    // Check for game status updates
    updateGameStatuses();
}

// Update game statuses based on time
function updateGameStatuses() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    Object.keys(games).forEach(gameId => {
        const game = games[gameId];
        const gameTime = parseTime(game.time);
        
        if (gameTime.hour < currentHour || 
            (gameTime.hour === currentHour && gameTime.minute < currentMinute)) {
            
            // Game time has passed
            if (game.status !== 'active') {
                game.status = 'active';
                const statusElement = document.getElementById(`status-${gameId}`);
                if (statusElement && !statusElement.classList.contains('published')) {
                    statusElement.textContent = 'Awaiting result...';
                    statusElement.className = 'result-status waiting';
                }
            }
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Update game status
function updateGameStatus(gameId, status) {
    const statusElement = document.getElementById(`status-${gameId}`);
    if (statusElement) {
        statusElement.textContent = status;
    }
}

// Start auto-refresh
function startAutoRefresh() {
    // Auto-refresh results every 30 seconds
    setInterval(() => {
        updateGameStatuses();
        loadResults();
        loadWebsiteStats();
    }, 30000);
    
    // Update time every minute
    setInterval(updateRealTime, 60000);
}

// Global functions
window.checkResult = checkResult;
window.showPrediction = showPrediction;
window.scrollToSection = scrollToSection;
