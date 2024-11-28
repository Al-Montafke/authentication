document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.signup-form');
    
    if (!form) {
        console.error('Could not find the signup form!');
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    confirmPassword
                }),
            });

            const data = await response.text();
            document.documentElement.innerHTML = data;
            
            startCountdown();
            
        } catch (error) {
            console.error('Error during signup:', error);
        }
    });
});

function startCountdown() {
    let timeLeft = 3;
    const timerElement = document.getElementById('timer');
    
    if (!timerElement) return;

    const countdownInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            const messageDiv = document.querySelector('.message');
            const isSuccess = messageDiv.classList.contains('success');
            const redirectPath = isSuccess ? '/login' : '/signup';
            window.location.replace(redirectPath);
        }
    }, 1000);
}
