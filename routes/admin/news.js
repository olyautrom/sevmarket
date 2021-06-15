const { Router } = require('express');
const News = require('../../models/news');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/file')
const fs = require('fs');
const router = Router();


router.get('/', auth, async (req, res) => {
    const news = await News.find().sort('-date').lean()
    news.map(function(item) {
        item.date = item.date.toISOString().split('T')[0];
        item.date = item.date.split('-')[2] + '.' + item.date.split('-')[1] + '.' + item.date.split('-')[0];
    })
    res.render('admin/news', {
        title: 'Новости',
        layout: 'admin',
        news
    })
})
router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/admin');
    }
    const news = await News.findById(req.params.id).lean();

    res.render('admin/news-edit', {
        title: `Редактировать ${news.title}`,
        layout: 'admin',
        news: {
            ...news,
            date: news.date.toISOString().split('T')[0]
        }
    })
})
router.post('/edit', auth, upload.single('newsImage[]'), async (req, res) => {
    const {id} = req.body
    try {    
        delete req.body.id;
        const news = await News.findById(id);
        const toChange = {
            title: req.body.title,
            date: req.body.date,
            annotation: req.body.annotation,
            content: req.body.content
        }

        const imageDeleted = !req.body.newsImagePreloaded || req.body.newsImagePreloaded.length === 0;
        const image = imageDeleted ? undefined : news.newsImage;
        const newImage = req.file;

        if (news.newsImage && (imageDeleted || newImage)) {
            fs.unlink('./public' + news.newsImage, (err) => {
                if (err) throw err;
            });
        }

        toChange.newsImage = newImage ? '/ugc_images/' + newImage.filename : image;

        Object.assign(news, toChange);
        await news.save();
        res.redirect('/admin/news');
    } catch (e) {
        console.log(e);
    }
})

router.get('/:id/delete', auth, async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (news.newsImage) {
            fs.unlink('./public' + news.newsImage, (err) => {
                if (err) throw err;
                console.log('path/file.txt was deleted');
            });
        }
        await News.deleteOne({
            _id: req.params.id
        })
        res.redirect('/admin/news');
    } catch (e) {
        console.log(e);
    }

})

router.get('/add', auth, async (req, res) => {
    res.render('admin/news-add', {
        title: 'Добавить новость',
        layout: 'admin',
        error: req.flash('error')
    })
})

router.post('/add', auth, upload.single('newsImage[]'), async (req, res) => {
    try {
        const { title, date, annotation, content } = req.body
        if (req.file) {
            const news = new News({
                title, date, newsImage: '/ugc_images/' + req.file.filename, annotation, content
            })
            await news.save()
            res.redirect('/admin/news')
        }
        else {
            req.flash('error', 'Загрузите изображение')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router

