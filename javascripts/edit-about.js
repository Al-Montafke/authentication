document.addEventListener('DOMContentLoaded', () => {

    const contentEditor = document.getElementById('contentEditor');
    const charCount = document.getElementById('charCount');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const previewContent = document.getElementById('previewContent');
    const username = window.location.pathname.split('/')[2];
    // Character count functionality
    contentEditor.addEventListener('input', () => {
        charCount.textContent = contentEditor.value.length;
        previewContent.innerHTML = DOMPurify.sanitize(marked.parse(contentEditor.value));
    });

    // Save functionality
    saveBtn.addEventListener('click', async () => {
        
        try {
            const response = await fetch('/api/edit-about', {  // Changed the endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: contentEditor.value
                })
            });

            if (response.ok) {
                alert('Content saved successfully!');
                window.location.href = `/user/${username}/home`;  // Redirect to home page after saving
            } else {
                throw new Error('Failed to save content');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Failed to save content. Please try again.');
        }
    });

    // Cancel functionality
    cancelBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
            window.location.href = `/user/${username}/home`;
        }
    });

    // Formatting tools functionality
    const formatButtons = document.querySelectorAll('.tool-btn');
    formatButtons.forEach(button => {
        button.addEventListener('click', () => {
            const format = button.dataset.format;
            applyFormat(format);
        });
    });
});

function applyFormat(format) {
    const editor = document.getElementById('contentEditor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    let formattedText = '';

    switch (format) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'underline':
            formattedText = `_${selectedText}_`;
            break;
    }

    editor.value = editor.value.substring(0, start) + formattedText + editor.value.substring(end);


}


