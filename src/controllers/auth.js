const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { userService, redisService } = require('../services');

const authController = {
    // POST /auth/login
    login: catchAsync(async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password)
            return res
                .status(500)
                .send('Tên đăng nhập hoặc mật khẩu không hợp lệ!');
        const user = await userService.getOne({ username });
        if (user && password === user.password) {
            jwt.sign(
                { username, id: user._id },
                '123',
                { expiresIn: '1d' },
                (err, token) => {
                    if (err) return res.status(500).send('Đăng nhập thất bại!');
                    else return res.json(token);
                }
            );
        } else {
            res.status(500).send('Tên đăng nhập hoặc mật khẩu không hợp lệ!');
        }
    }),

    changePassword: catchAsync(async (req, res, next) => {
        const { currentPassword, newPassword, passwordConfirm } = req.body;

        if (!currentPassword || !newPassword || !passwordConfirm)
            return res.status(500).send('Đổi mật khẩu thất bại');
        if (currentPassword !== req.user.password)
            return res.status(500).send('Sai mật khẩu');
        if (passwordConfirm !== newPassword)
            return res.status(500).send('Mật khẩu không trùng khớp');

        await userService.update(
            { _id: req.user._id },
            { password: newPassword }
        );
        next();
    }),

    // GET /auth/logout
    logout: (req, res) => {
        const { token } = req.tokenData;
        // get token eat to set redis expiration
        redisService.set(`bl_${token}`, token);
        res.send('Đăng xuất thành công');
    },
};

module.exports = authController;
