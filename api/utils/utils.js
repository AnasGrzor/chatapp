const jwt = require('jsonwebtoken');

function createToken(userId) {
    const payload = {
        userId: userId
    };

    const token = jwt.sign(payload, "abcd", { expiresIn: '1h' });

    return token
}

module.exports = { createToken }