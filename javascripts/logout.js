document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                await fetch('/logout', { method: 'POST' });
                if (document.getElementById('logout-popup')) {
                    showLogoutPopup();
                } else {
                    window.location.href = '/logout';
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
        });
    }
});

function showLogoutPopup() {
    const popup = document.getElementById('logout-popup');
    const countdownElement = document.getElementById('countdown');
    
    if (!popup || !countdownElement) {
        console.error('Required elements not found');
        return;
    }
    
    // Show popup with fade-in animation
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });
    
    startCountdown(countdownElement);
}

function startCountdown(countdownElement) {
    let timeLeft = 3;
    
    const updateCountdown = () => {
        countdownElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            window.location.replace('/login');
            return;
        }
        
        timeLeft--;
        setTimeout(updateCountdown, 1000);
    };
    
    updateCountdown();
}

