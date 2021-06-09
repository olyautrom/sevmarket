const { Router } = require('express')
const News = require('../models/news');
const info = require('../middleware/info');
const router = Router()

router.get('/', info, async (req, res) => {
  const news = await News.find().sort('-date').lean()
    news.map(function(item) {
        item.date = item.date.toISOString().split('T')[0];
        item.date = item.date.split('-')[2] + '.' + item.date.split('-')[1] + '.' + item.date.split('-')[0];
    })

  res.render('news', {
    title: 'Новости',
    news
  })
})

router.get('/:id', info, async (req, res) => {
  try {
    const newsBlock = await News.findById(req.params.id).lean();
    newsBlock.date = newsBlock.date.toISOString().split('T')[0];
    newsBlock.date = newsBlock.date.split('-')[2] + '.' + newsBlock.date.split('-')[1] + '.' + newsBlock.date.split('-')[0];
    res.render('news-block', {
      title: 'Новости',
      newsTitle: `${newsBlock.title}`,
      newsBlock
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router