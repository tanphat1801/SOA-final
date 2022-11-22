const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { userService, redisService } = require('../services');

const authController = {
    // GET /auth/login
    loginView: (req, res) => {
        const error = req.flash('error');
        res.render('auth/login', { title: 'Đăng nhập', layout: 'auth', error });
    },

    // POST /auth/login
    login: catchAsync(async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ!');
            return res.redirect('/auth/login');
        }
        const user = await userService.getOne({ username });
        if (user && password === user.password) {
            jwt.sign(
                { username, id: user._id },
                '123',
                { expiresIn: '1d' },
                (err, token) => {
                    if (err) {
                        req.flash('error', 'Đăng nhập thất bại');
                        return res.redirect('/auth/login');
                    } else {
                        res.cookie('AuthToken', token);
                        res.cookie('user', user);
                        if (user.role == 'admin') return res.redirect('/admin');
                        else if (user.role == 'teacher')
                            return res.redirect('/teacher');
                        return res.redirect('/');
                    }
                }
            );
        } else {
            req.flash('error', 'Tên đăng nhập hoặc mật khẩu không hợp lệ!');
            res.redirect('/auth/login');
        }
    }),

    changePasswordView: (req, res, next) => {
        const error = req.flash('error');
        res.render('auth/change', {
            title: 'Đổi mật khẩu',
            layout: 'auth',
            error,
        });
    },

    changePassword: catchAsync(async (req, res, next) => {
        const { currentPassword, newPassword, passwordConfirm } = req.body;

        if (!currentPassword || !newPassword || !passwordConfirm) {
            req.flash('error', 'Đổi mật khẩu thất bại');
            return res.redirect('/auth/change-password');
        }
        if (currentPassword !== req.user.password) {
            req.flash('error', 'Sai mật khẩu');
            return res.redirect('/auth/change-password');
        }
        if (passwordConfirm !== newPassword) {
            req.flash('error', 'Mật khẩu không trùng khớp');
            return res.redirect('/auth/change-password');
        }

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

        res.clearCookie('AuthToken');
        res.clearCookie('user');
        res.redirect('/auth/login');
    },
};

module.exports = authController;
