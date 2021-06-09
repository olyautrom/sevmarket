const {Router} = require('express');
const info = require('../middleware/info');
const Info = require('../models/info');
const router = Router()

router.get('/', info, async (req, res) => {
    const textInformation = (await Info.findOne({ infoId: 'textInformation' })).value;
    const textAbout = (await Info.findOne({ infoId: 'textAbout' })).value;
    const textMain = textInformation.split('/')[0];
    const textItem1 = textInformation.split('/')[1];
    const textItem2 = textInformation.split('/')[2];
    const textItem3 = textInformation.split('/')[3];
    res.render('about-company', {
        title: 'О компании',
        textAbout, textMain, textItem1, textItem2, textItem3
    })
})
module.exports = router