const { Router } = require('express');
const bcrypt = require('bcrypt')
const Admin = require('../../models/admin');
const auth = require('../../middleware/auth');
const router = Router();

router.get('/', auth, (req, res) => {
    res.render('admin/enter', {
        title: 'Добро пожаловать!',
        layout: 'admin'
    })
})

router.get('/login', (req, res) => {
    res.render('admin/login', {
        title: 'Вход',
        layout: false,
        error: req.flash('error')
    })
})

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const candidate = await Admin.findOne({ login });

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.admin = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/admin');
                })
            } else {
                req.flash('error', 'Введен неверный пароль');
                res.redirect('/admin/login');
            }
        } else {
            req.flash('error', 'Пользователя с таким логином не существует');
            res.redirect('/admin/login');
        }
    } catch (e) {
        console.log(e);
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
})


module.exports = router