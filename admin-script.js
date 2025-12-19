// Admin Functions for Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on admin pages
    if (window.location.pathname.includes('admin') || 
        window.location.pathname.includes('manage')) {
        checkAdminAccess();
    }
});

// Check admin access
function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser.type !== 'admin') {
        alert('Admin access required! Redirecting to login...');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Log activity
function logActivity(action) {
    const activity = JSON.parse(localStorage.getItem('adminActivity') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    activity.unshift({
        user: currentUser.username || 'admin',
        action: action,
        time: new Date().toISOString()
    });
    
    // Keep only last 100 activities
    if (activity.length > 100) {
        activity.length = 100;
    }
    
    localStorage.setItem('adminActivity', JSON.stringify(activity));
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate random number
function generateRandomNumber() {
    return Math.floor(Math.random() * 100).toString().padStart(2, '0');
}

// Save all data to localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

// Load data from localStorage
function loadFromLocalStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return defaultValue;
    }
}

// Initialize default data
function initializeDefaultData() {
    const today = new Date().toISOString().split('T')[0];
    
    // Initialize users if empty
    let users = loadFromLocalStorage('matkaUsers', []);
    if (users.length === 0) {
        users = [
            {
                id: 'admin001',
                username: 'admin',
                password: 'admin123',
                type: 'admin',
                name: 'Super Admin',
                email: 'admin@matkaking.com',
                created: new Date().toISOString(),
                status: 'active'
            }
        ];
        saveToLocalStorage('matkaUsers', users);
    }
    
    // Initialize results if empty
    let results = loadFromLocalStorage('matkaResults', {});
    if (Object.keys(results).length === 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        results[yesterdayStr] = {
            faridabad: { result: '45', published: true, time: '05:15 PM' },
            gaziabad: { result: '78', published: true, time: '09:15 PM' },
            gali: { result: '23', published: true, time: '10:30 PM' },
            deshwar: { result: '56', published: true, time: '04:45 PM' },
            gali_dubai: { result: '89', published: true, time: '02:30 PM' },
            deshwar_dubai: { result: '12', published: true, time: '11:45 PM' }
        };
        saveToLocalStorage('matkaResults', results);
    }
    
    // Initialize activity log
    let activity = loadFromLocalStorage('adminActivity', []);
    if (activity.length === 0) {
        activity = [{
            user: 'system',
            action: 'System initialized',
            time: new Date().toISOString()
        }];
        saveToLocalStorage('adminActivity', activity);
    }
}

// Show loading spinner
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div class="loading-spinner"></div>
                <p style="color: #a0a0c0; margin-top: 10px;">Loading...</p>
            </div>
        `;
    }
}

// Show error message
function showError(message) {
    alert(`Error: ${message}`);
}

// Show success message
function showSuccess(message) {
    alert(`Success: ${message}`);
}

// Confirm action
function confirmAction(message) {
    return confirm(message);
}

// Export data to file
function exportData(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Import data from file
function importData(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            callback(data);
        } catch (error) {
            showError('Invalid file format!');
        }
    };
    reader.readAsText(file);
}
