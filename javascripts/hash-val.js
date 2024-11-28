const bcrypt = require('bcrypt');

async function hash_password(password, saltRounds = 10) {
    const hashed_password = await bcrypt.hash(password, saltRounds);
    console.log(`Hashed: ${hashed_password}`);
    return hashed_password;
}

async function compare_password(password, hashed_password) {
    const is_match = await bcrypt.compare(password, hashed_password);
    return is_match;
}

module.exports = { hash_password, compare_password };
