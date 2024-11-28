document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.signup-form');

    if (!form) {
        console.error('Could not find the signup form!');
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const inputs = {
            username: document.getElementById('username'),
            email: document.getElementById('email'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirm-password')
        };
        
        // Reset previous states
        resetFormStates();
        
        // Validate passwords match
        if (inputs.password.value !== inputs.confirmPassword.value) {
            showMessage('Passwords do not match', 'error');
            inputs.password.parentElement.classList.add('error');
            inputs.confirmPassword.parentElement.classList.add('error');
            return;
        }
        
        // Add loading state
        submitBtn.classList.add('loading');
        
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: inputs.username.value,
                    email: inputs.email.value,
                    password: inputs.password.value
                }),
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            // Show success message
            showMessage('Account created successfully!', 'success');
            
            // Add success state to all inputs
            Object.values(inputs).forEach(input => {
                input.parentElement.classList.add('success');
            });
            
            // Start redirect countdown
            startCountdown();
            
        } catch (error) {
            console.error('Error during signup:', error);
            
            // Show error message
            showMessage('Could not create account. Please try again.', 'error');
            
            // Add error state to inputs
            Object.values(inputs).forEach(input => {
                input.parentElement.classList.add('error');
            });
            
            // Remove loading state
            submitBtn.classList.remove('loading');
        }
    });

    // Same helper functions as login.js
    function resetFormStates() {
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    function showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => message.classList.add('show'), 10);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 500);
        }, 5000);
    }

    function startCountdown() {
        let timeLeft = 3;
        const countdownInterval = setInterval(() => {
            timeLeft--;
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                window.location.replace('/login');
            }
        }, 1000);
    }
}); 