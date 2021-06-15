const { Router } = require('express');
const Request = require('../../models/request');
const auth = require('../../middleware/auth');
const router = Router();


router.get('/', auth, async (req, res) => {
    const requestNew = await Request.find({ status: true}).lean();
    const request = await Request.find({ status: false}).lean();
    console.log(request);
    res.render('admin/request', {
        title: 'Заявки',
        layout: 'admin',
        requestNew, request
    })
})

router.get('/:id/check', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/admin');
    }
    await Request.findByIdAndUpdate(req.params.id, {"status": false});
    res.redirect('/admin/request');
})


module.exports = router;

