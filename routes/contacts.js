const {Router} = require('express');
const info = require('../middleware/info');
const Info = require('../models/info');
const router = Router();

router.get('/', info, async (req, res) => {
    const map = (await Info.findOne({ infoId: 'map' })).value;
    const textCooperation = (await Info.findOne({ infoId: 'textCooperation' })).value;
    res.render('contacts', {
        title: 'Контакты',
        textCooperation, map
    })
})
module.exports = router