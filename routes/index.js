const {Router} = require('express');
const info = require('../middleware/info');
const Info = require('../models/info');
const News = require('../models/news');
const router = Router()

router.get('/', info, async (req, res) => {
    const textIngredient = (await Info.findOne({ infoId: 'textIngredient' })).value;
    const textAbout = (await Info.findOne({ infoId: 'textAbout' })).value;
    const map = (await Info.findOne({ infoId: 'map' })).value;
    const news = await News.find().sort('-date').limit(3).lean()
    news.map(function(item) {
        item.date = item.date.toISOString().split('T')[0];
        item.date = item.date.split('-')[2] + '.' + item.date.split('-')[1] + '.' + item.date.split('-')[0];
    })
    res.render('index', {
        title: 'Главная страница',
        textIngredient, textAbout, map,
        news
    })
})

module.exports = router