const jwt = require('jsonwebtoken');
const isLogged = async (req, res, next) => {

    if (req.cookies) {
        const token = req.cookies.token;
        jwt.verify(
            token,
            process.env.JWT_SECRET || 'randomkeyusaedassecretkey',
            async (err, decode) => {
                if (err) {

                    res.redirect('/login');
                }

                else {
                    next();
                }
            }
        );
    } else {
        res.status(401).send({ success: false, message: 'login failed, incorrect user/password!' });
    }
}
const newToken = (user) => {
    return jwt.sign({
        phone: user.phone
    },
        process.env.JWT_SECRET || 'randomkeyusaedassecretkey', {
        expiresIn: '1d'
    })
}

module.exports = {
    isLogged,
    newToken
};