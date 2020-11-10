const AuthService = require('../auth/auth-service');

const authMiddleware = (req, res, next) => {
    const [, authToken] = req.headers.authorization.split(' ');

    if (!authToken) {
        return res.status(401).json({ message: 'Please login to add an item' })
    }

    const { user_id } = AuthService.verifyJwt(authToken);

    if (!user_id) {
        return res.status(401).json({ message: 'Invalid Credentials' })
    }

    req.user_id = user_id
    next();
}

module.exports = authMiddleware