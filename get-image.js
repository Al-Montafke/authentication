const dotenv = require('dotenv');
dotenv.config();

async function get_image(username, filename) {
    const response = await fetch(`${process.env.pre_link}/user/${username}/images/${filename}`);
    if (response.status === 404) return null;

    return response.url;
}

module.exports = { get_image };