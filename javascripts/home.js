document.getElementById('edit-btn').addEventListener('click', () => {
    const username = window.location.pathname.split('/')[2];
    window.location.href = `/user/${username}/home/edit`;
});

// Add click animation handler for file input label
function initFileInputAnimation() {
    const fileLabel = document.querySelector('.file-input-label');
    if (fileLabel) {
        fileLabel.addEventListener('click', function(e) {
            // Remove any existing animation classes
            this.classList.remove('clicked');
            
            // Force a reflow (necessary for the animation to restart)
            void this.offsetWidth;
            
            // Add the animation class
            this.classList.add('clicked');
            
            // Remove the class after animation completes
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 600);
        });

        // Add loading state handler
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    fileLabel.classList.add('loading');
                    
                    // Remove loading state after file processing (adjust timeout as needed)
                    setTimeout(() => {
                        fileLabel.classList.remove('loading');
                        fileLabel.classList.add('success');
                        
                        // Remove success state after a moment
                        setTimeout(() => {
                            fileLabel.classList.remove('success');
                        }, 2000);
                    }, 1500);
                }
            });
        }
    }
}

// Add the floating animation
function initFloatingAnimation() {
    const skillTags = document.querySelectorAll('.skill-tag');
    const skillsArray = Array.from(skillTags);
    
    function getRandomSkills() {
        const numberOfSkills = Math.floor(Math.random() * (skillsArray.length - 1)) + 1;
        return shuffleArray(skillsArray).slice(0, numberOfSkills);
    }
    
    function shuffleArray(array) {
        return array.slice().sort(() => Math.random() - 0.5);
    }
    
    function animateSkills() {
        // First, remove float-up class from all skills
        skillsArray.forEach(skill => {
            skill.classList.remove('float-up');
        });
        
        // Wait a brief moment before floating new skills
        setTimeout(() => {
            const selectedSkills = getRandomSkills();
            selectedSkills.forEach(skill => {
                skill.classList.add('float-up');
            });
        }, 200);
    }
    
    // Initial animation
    animateSkills();
    
    // Repeat animation every 3 seconds
    setInterval(animateSkills, 3000);
}

function check_logo_input() {
    const username = window.location.pathname.split('/')[2];
    const selected_input = document.getElementById('logo-input');
    selected_input.addEventListener('change', handle_input, false);
    const reader = new FileReader();

    function handle_input() {
        const files = selected_input.files;
        const file = files[0];
        const amount_of_files = files.length;
        handle_amount();
        
        function handle_amount() {
            const allowed_amount = 1;
            if (amount_of_files > allowed_amount) {
                alert('You can only upload one file!');
                selected_input.value = '';
            } else {
                handle_size();
            }
        }
        
        function handle_size() {
            const max_size = 256 * 1024; // 256kb
            if (file.size > max_size) {
                alert(`File is too large!, allowed size is ${max_size} bytes`);
                selected_input.value = '';
            } else {
                replace_logo();
            }
        }

        function replace_logo() {
            const logo = document.getElementById('logo-img');
            reader.onload = async (e) => {
                logo.src = e.target.result;

                await fetch(`/user/${username}/images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        img: reader.result,
                        filename: file.name
                    })
                }).then(response => response.json())
                .then(data => {
                    if (data.success) {
                        for (const info of Object.values(data)) {
                            console.log(`info: ${info}`);
                        }
                        setTimeout(() => {
                            elem.src = data.link;
                        }, 3000);
                    } else {
                        throw new Error('Failed to save image');
                    }
                })
            }
            reader.readAsDataURL(file);
        }
    }
}

// Replace the createRainEffect function with this optimized version
function createRainEffect() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    document.body.appendChild(rainContainer);

    // Create a limited pool of rain drops
    const MAX_DROPS = 30; // Limit the number of drops
    let activeDrops = 0;

    // Create rain spots (keep this limited)
    for (let i = 0; i < 3; i++) {
        const spot = document.createElement('div');
        spot.className = 'rain-spot';
        rainContainer.appendChild(spot);
    }

    // Reuse drops instead of creating new ones
    const createDrop = () => {
        // Only create new drops if we haven't reached the limit
        if (activeDrops < MAX_DROPS) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            
            const resetDrop = () => {
                drop.style.left = Math.random() * 100 + '%';
                drop.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
                drop.style.opacity = Math.random() * 0.3 + 0.1;
            };

            resetDrop();
            rainContainer.appendChild(drop);
            activeDrops++;

            // Reuse the drop when animation ends
            drop.addEventListener('animationend', () => {
                resetDrop();
                // Force a reflow to restart the animation
                void drop.offsetWidth;
                drop.style.animation = 'none';
                void drop.offsetWidth;
                drop.style.animation = '';
            });
        }
    };

    // Create initial drops
    for (let i = 0; i < MAX_DROPS; i++) {
        setTimeout(() => createDrop(), i * 100);
    }

    // Cleanup function
    return () => {
        rainContainer.remove();
    };
}

// Update the welcome text animation function
function initWelcomeAnimation() {
    const welcomeText = document.querySelector('.welcome-header');
    if (!welcomeText || welcomeText.getAttribute('data-animated')) return;
    
    const text = welcomeText.textContent.trim();
    welcomeText.textContent = '';
    welcomeText.setAttribute('data-animated', 'true');
    
    const container = document.createElement('div');
    container.style.display = 'inline';
    
    const words = text.split(/\s+/);
    let totalDelay = 0;
    
    words.forEach((word, wordIndex) => {
        [...word].forEach((letter, letterIndex) => {
            const span = document.createElement('span');
            span.className = 'animated-letter';
            span.textContent = letter;
            span.style.setProperty('--delay', `${totalDelay}s`);
            container.appendChild(span);
            totalDelay += 0.05;
        });
        
        if (wordIndex < words.length - 1) {
            const space = document.createTextNode(' ');
            container.appendChild(space);
        }
    });
    
    welcomeText.appendChild(container);
}

// Add this function at the beginning of the file
function initFadeInAnimations() {
    const elements = [
        '.top-controls',
        '.logo-container',
        '.welcome-container',
        '.about-box',
        '.contact-box'
    ];

    // Add fade-in class to all elements
    elements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('fade-in');
        }
    });

    // Trigger animations after a short delay
    setTimeout(() => {
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('active');
            }
        });
    }, 100);
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initFadeInAnimations();
    
    // Add a small delay before starting the welcome animation
    setTimeout(initWelcomeAnimation, 100);
    
    initFloatingAnimation();
    initFileInputAnimation();
    check_logo_input();
    
    // Store cleanup function
    const cleanupRain = createRainEffect();

    // Optional: Cleanup rain effect when leaving page
    window.addEventListener('unload', cleanupRain);
});
