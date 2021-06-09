const {Router} = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../../models/admin');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const router = Router();


router.get('/', auth, role, async (req, res) => {
    const users = await Admin.find()

    res.render('admin/users', {
        title: 'Пользователи',
        layout: 'admin',
        users
    })
})
router.get('/:id/edit', auth, role, async (req, res) => {
    if (!req.query.allow) {
      return res.redirect('/admin');
    }
    const user = await Admin.findById(req.params.id).lean();
  
    res.render('admin/user-edit', {
      title: `Редактировать ${user.login}`,
      layout: 'admin',
      user: {
          ...user,
          isAdmin: user.role === 'admin',
          isEditor: user.role === 'editor'
      }
    })
})
router.post('/edit', auth, role, async (req, res) => {
    try {
        const {id} = req.body;
        delete req.body.id;
        const user = await Admin.findById(id);
        const toChange = {
            login: req.body.login,
            role: req.body.role,
        }
        if (req.body.password) {
            toChange.password = await bcrypt.hash(req.body.password, 10)
        }
        Object.assign(user, toChange);
        await user.save();
        res.redirect('/admin/users');
    } catch (e) {
        console.log(e);
    }
})

router.get('/:id/delete', auth, role, async (req, res) => {
    try {
        await Admin.deleteOne({
            _id: req.params.id
        });
        res.redirect('/admin/users');
    } catch (e) {
        console.log(e);
    }
})

router.get('/add', auth, role, async (req, res) => {
    res.render('admin/user-add', {
        title: 'Добавить пользователя',
        layout: 'admin',
        error: req.flash('error')
    })
})

router.post('/add', auth, role, async (req, res) => {
    try {
        const { login, password, role } = req.body;
        const candidate = await Admin.findOne({ login });
        const hashPassword = await bcrypt.hash(password, 10);

        if (candidate) {
            req.flash('error', 'Пользователь с таким логином уже существует');
            res.redirect('/admin/users/add');
        } else {
            const user = new Admin({
                login, password: hashPassword,role
            });
            await user.save();
            res.redirect('/admin/users');
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router

