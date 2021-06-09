const { Router } = require('express');
const Info = require('../../models/info');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const upload = require('../../middleware/file');
const fs = require('fs');
const router = Router();


router.get('/', auth, role, async (req, res) => {
    const info = await Info.find().lean();
    res.render('admin/info', {
        title: 'Информация',
        layout: 'admin',
        info
    })
})

router.get('/:id/edit', auth, role, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/admin');
    }
    const info = await Info.findById(req.params.id).lean();

    res.render('admin/info-edit', {
        title: `Редактировать ${info.title}`,
        layout: 'admin',
        info
    })
})

router.post('/edit', auth, role, async (req, res) => { 
    try {
        const { id } = req.body
        delete req.body.id;
        await Info.findByIdAndUpdate(id, req.body);
        res.redirect('/admin/info');
    } catch (e) {
        console.log(e);
    }
})


module.exports = router;

