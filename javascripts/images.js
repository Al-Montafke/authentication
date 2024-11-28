document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('img');
    const reader = new FileReader();

    reader.readAsDataURL(img);
});
