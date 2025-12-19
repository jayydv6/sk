// Admin Panel Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    checkAdminAccess();
    
    // Load existing data
    loadAdminData();
    
    // Setup event listeners
    setupAdminListeners();
    
    // Load guesser data
    loadGuesserData();
});

// Admin credentials (in real app, this should be server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'matka123'
};

// Check admin access
function checkAdminAccess() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to login
        window.location.href = 'admin.html?login';
        return;
    }
}

// Load admin data
function loadAdminData() {
    // Load results
    const savedResults = localStorage.getItem('matkaResults');
    if (savedResults) {
        const results = JSON.parse(savedResults);
        populateResultsForm(results);
    }
    
    // Load guessers
    loadGuesserData();
}

// Populate results form
function populateResultsForm(results) {
    const games = [
        { key: 'faridabad', name: 'Faridabad', elementId: 'result-faridabad' },
        { key: 'gaziabad', name: 'Gaziabad', elementId: 'result-gaziabad' },
        { key: 'gali', name: 'Gali', elementId: 'result-gali' },
        { key: 'deshwar', name: 'Deshwar', elementId: 'result-deshwar' },
        { key: 'gali_dubai', name: 'Gali Dubai', elementId: 'result-gali-dubai' },
        { key: 'deshwar_dubai', name: 'Deshwar Dubai', elementId: 'result-deshwar-dubai' }
    ];
    
    games.forEach(game => {
        const element = document.getElementById(game.elementId);
        if (element && results[game.key]) {
            element.value = results[game.key].result || '';
            
            // Update status indicator
            const statusElement = document.getElementById(`status-${game.key}`);
            if (statusElement) {
                if (results[game.key].published) {
                    statusElement.textContent = 'Published';
                    statusElement.className = 'status-badge published';
                } else if (results[game.key].result) {
                    statusElement.textContent = 'Ready to Publish';
                    statusElement.className = 'status-badge ready';
                } else {
                    statusElement.textContent = 'Not Set';
                    statusElement.className = 'status-badge unpublished';
                }
            }
        }
    });
}

// Setup admin event listeners
function setupAdminListeners() {
    // Save results button
    const saveBtn = document.getElementById('save-results');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveResults);
    }
    
    // Publish results button
    const publishBtn = document.getElementById('publish-results');
    if (publishBtn) {
        publishBtn.addEventListener('click', publishResults);
    }
    
    // Clear all button
    const clearBtn = document.getElementById('clear-results');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearResults);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }
    
    // Add guesser button
    const addGuesserBtn = document.getElementById('add-guesser');
    if (addGuesserBtn) {
        addGuesserBtn.addEventListener('click', addNewGuesser);
    }
    
    // Save guessers button
    const saveGuessersBtn = document.getElementById('save-guessers');
    if (saveGuessersBtn) {
        saveGuessersBtn.addEventListener('click', saveGuesserChanges);
    }
}

// Save results (without publishing)
function saveResults() {
    const games = [
        { key: 'faridabad', elementId: 'result-faridabad' },
        { key: 'gaziabad', elementId: 'result-gaziabad' },
        { key: 'gali', elementId: 'result-gali' },
        { key: 'deshwar', elementId: 'result-deshwar' },
        { key: 'gali_dubai', elementId: 'result-gali-dubai' },
        { key: 'deshwar_dubai', elementId: 'result-deshwar-dubai' }
    ];
    
    let results = {};
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    games.forEach(game => {
        const element = document.getElementById(game.elementId);
        if (element && element.value.trim() !== '') {
            results[game.key] = {
                result: element.value.trim(),
                time: timeString,
                published: false
            };
        }
    });
    
    // Get existing results
    const existingResults = JSON.parse(localStorage.getItem('matkaResults') || '{}');
    
    // Merge with existing (preserve published status if exists)
    Object.keys(existingResults).forEach(key => {
        if (existingResults[key].published) {
            results[key] = existingResults[key];
        }
    });
    
    localStorage.setItem('matkaResults', JSON.stringify(results));
    
    // Update UI
    populateResultsForm(results);
    
    showNotification('Results saved successfully! They are ready to publish.', 'success');
}

// Publish results
function publishResults() {
    const savedResults = localStorage.getItem('matkaResults');
    if (!savedResults) {
        showNotification('No results to publish! Save results first.', 'error');
        return;
    }
    
    let results = JSON.parse(savedResults);
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    // Mark all results as published
    Object.keys(results).forEach(key => {
        if (results[key].result) {
            results[key].published = true;
            results[key].publishTime = timeString;
        }
    });
    
    localStorage.setItem('matkaResults', JSON.stringify(results));
    
    // Update UI
    populateResultsForm(results);
    
    showNotification('Results published successfully! Users can now see them.', 'success');
    
    // Simulate notification to all users
    setTimeout(() => {
        if (window.opener) {
            window.opener.showNotification('New results have been published!', 'info');
        }
    }, 500);
}

// Clear all results
function clearResults() {
    if (confirm('Are you sure you want to clear all results? This cannot be undone.')) {
        localStorage.removeItem('matkaResults');
        
        // Clear form
        const gameInputs = [
            'result-faridabad', 'result-gaziabad', 'result-gali',
            'result-deshwar', 'result-gali-dubai', 'result-deshwar-dubai'
        ];
        
        gameInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        
        // Update status indicators
        const games = ['faridabad', 'gaziabad', 'gali', 'deshwar', 'gali_dubai', 'deshwar_dubai'];
        games.forEach(game => {
            const statusElement = document.getElementById(`status-${game}`);
            if (statusElement) {
                statusElement.textContent = 'Not Set';
                statusElement.className = 'status-badge unpublished';
            }
        });
        
        showNotification('All results cleared successfully.', 'info');
    }
}

// Logout admin
function logoutAdmin() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin.html';
}

// Load guesser data
function loadGuesserData() {
    const guessers = JSON.parse(localStorage.getItem('matkaGuessers') || '[]');
    const container = document.getElementById('guesser-list');
    
    if (!container) return;
    
    if (guessers.length === 0) {
        // Add sample guessers
        const sampleGuessers = [
            { id: 'G001', name: 'Raj Kumar', rating: 92, status: 'active', predictions: 45 },
            { id: 'G002', name: 'Amit Singh', rating: 88, status: 'active', predictions: 32 },
            { id: 'G003', name: 'Suresh Patel', rating: 85, status: 'inactive', predictions: 28 },
            { id: 'G004', name: 'Vijay Sharma', rating: 91, status: 'active', predictions: 51 }
        ];
        
        container.innerHTML = sampleGuessers.map(guesser => createGuesserRow(guesser)).join('');
    } else {
        container.innerHTML = guessers.map(guesser => createGuesserRow(guesser)).join('');
    }
}

// Create guesser table row
function createGuesserRow(guesser) {
    return `
        <tr>
            <td>${guesser.id}</td>
            <td>${guesser.name}</td>
            <td><span class="rating-badge">${guesser.rating}%</span></td>
            <td>
                <select class="form-control status-select" data-id="${guesser.id}">
                    <option value="active" ${guesser.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="inactive" ${guesser.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                    <option value="suspended" ${guesser.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                </select>
            </td>
            <td>${guesser.predictions}</td>
            <td>
                <button class="btn btn-small btn-danger" onclick="removeGuesser('${guesser.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

// Add new guesser
function addNewGuesser() {
    const guesserId = document.getElementById('new-guesser-id').value.trim();
    const guesserName = document.getElementById('new-guesser-name').value.trim();
    
    if (!guesserId || !guesserName) {
        showNotification('Please enter both ID and Name', 'error');
        return;
    }
    
    const guessers = JSON.parse(localStorage.getItem('matkaGuessers') || '[]');
    
    // Check if ID already exists
    if (guessers.some(g => g.id === guesserId)) {
        showNotification('Guesser ID already exists!', 'error');
        return;
    }
    
    const newGuesser = {
        id: guesserId,
        name: guesserName,
        rating: 50, // Default rating
        status: 'active',
        predictions: 0,
        joined: new Date().toLocaleDateString()
    };
    
    guessers.push(newGuesser);
    localStorage.setItem('matkaGuessers', JSON.stringify(guessers));
    
    // Add to table
    const container = document.getElementById('guesser-list');
    container.innerHTML += createGuesserRow(newGuesser);
    
    // Clear form
    document.getElementById('new-guesser-id').value = '';
    document.getElementById('new-guesser-name').value = '';
    
    showNotification(`Guesser ${guesserName} added successfully!`, 'success');
}

// Remove guesser
function removeGuesser(guesserId) {
    if (confirm(`Are you sure you want to remove guesser ${guesserId}?`)) {
        let guessers = JSON.parse(localStorage.getItem('matkaGuessers') || '[]');
        guessers = guessers.filter(g => g.id !== guesserId);
        localStorage.setItem('matkaGuessers', JSON.stringify(guessers));
        
        // Reload table
        loadGuesserData();
        
        showNotification(`Guesser ${guesserId} removed successfully!`, 'info');
    }
}

// Save guesser changes
function saveGuesserChanges() {
    const statusSelects = document.querySelectorAll('.status-select');
    let guessers = JSON.parse(localStorage.getItem('matkaGuessers') || '[]');
    
    statusSelects.forEach(select => {
        const guesserId = select.dataset.id;
        const guesserIndex = guessers.findIndex(g => g.id === guesserId);
        
        if (guesserIndex !== -1) {
            guessers[guesserIndex].status = select.value;
        }
    });
    
    localStorage.setItem('matkaGuessers', JSON.stringify(guessers));
    showNotification('Guesser changes saved successfully!', 'success');
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
