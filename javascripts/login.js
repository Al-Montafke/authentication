document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    let name;

    if (!form) {
        console.error('Could not find the login form!');
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        name = document.getElementById('name').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    password
                }),
            });

            const data = await response.text();
            document.documentElement.innerHTML = data;
            
            startCountdown();
            
        } catch (error) {
            console.error('Error during login:', error);
        }
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
                const redirectPath = isSuccess ? `/user/${name}/home` : '/login';
                window.location.replace(redirectPath);
            }
        }, 1000);
    }
});

