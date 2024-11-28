document.addEventListener('DOMContentLoaded', async () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Improved cookie parsing
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Get initial theme
    const currentTheme = getCookie('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.checked = currentTheme === 'dark';

    // Handle theme toggle
    themeToggle.addEventListener('change', async (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);

        try {
            const response = await fetch('/api/save-theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ theme: newTheme })
            });
            
            if (!response.ok) {
                console.error('Failed to save theme preference');
                // Revert the toggle if save failed
                themeToggle.checked = !themeToggle.checked;
                document.documentElement.setAttribute('data-theme', currentTheme);
            }
        } catch (error) {
            console.error('Error saving theme:', error);
            // Revert the toggle if save failed
            themeToggle.checked = !themeToggle.checked;
            document.documentElement.setAttribute('data-theme', currentTheme);
        }
    });
});
    