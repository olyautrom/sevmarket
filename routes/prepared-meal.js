const { Router } = require('express')
const info = require('../middleware/info');
const router = Router()

router.get('/', info, async (req, res) => {
    res.render('prepared-meal', {
        title: 'Готовые изделия',
    })
})
module.exports = router