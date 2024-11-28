const jwt = require('jsonwebtoken');

const get_user_token = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Token not found.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log(decoded);

        req.username = decoded.username;
        next();
    } catch (err) {
        await res.status(401).json({ message: 'Invalid token.' });
        return;
    }
};

module.exports = { get_user_token };
