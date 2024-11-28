async function get_image(username, filename) {
    const response = await fetch(`http://localhost:3000/user/${username}/images/${filename}`);
    if (response.status === 404) return null;

    return response.url;
}

module.exports = { get_image };