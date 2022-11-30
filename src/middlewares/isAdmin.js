module.exports = (req, res, next) => {
    const user = req.cookies.user;

    if (user.role == 'user') {
        return res.status(403).send('Forbidden');
    }
    next();
};
