const { Router } = require('express');
const Ingredient = require('../../models/ingredient');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/file');
const fs = require('fs');
const router = Router();


router.get('/', auth, async (req, res) => {
    const ingredients = await Ingredient.find();
    res.render('admin/ingredients', {
        title: 'Ингредиенты',
        layout: 'admin',
        ingredients,
    })
})
router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/admin');
    }
    const ingredient = await Ingredient.findById(req.params.id).lean();

    res.render('admin/ingredient-edit', {
        title: `Редактировать ${ingredient.title}`,
        layout: 'admin',
        ingredient
    })
})
router.post('/edit', auth, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.body
        delete req.body.id;
        const ingredient = await Ingredient.findById(id);
        const toChange = {
            title: req.body.title,
            description: req.body.description
        }
        if (req.file) {
            fs.unlink('./public' + ingredient.image, (err) => {
                if (err) throw err;
            });
            toChange.image = '/ugc_images/' + req.file.filename;
        }
        Object.assign(ingredient, toChange);
        await ingredient.save();
        res.redirect('/admin/ingredients');
    } catch (e) {
        console.log(e);
    }
})

router.get('/:id/delete', auth, async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);
        if (ingredient.image) {
            fs.unlink('./public' + ingredient.image, (err) => {
                if (err) throw err;
                console.log('path/file.txt was deleted');
            });
        }
        await Ingredient.deleteOne({
            _id: req.params.id
        });
        res.redirect('/admin/ingredients');
    } catch (e) {
        console.log(e);
    }

})

router.get('/add', auth, async (req, res) => {
    res.render('admin/ingredient-add', {
        title: 'Добавить ингредиент',
        layout: 'admin',
        error: req.flash('error')
    });
})

router.post('/add', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        if (req.file) {
            const ingredient = new Ingredient({
                title, description, image: '/ugc_images/' + req.file.filename
            });
            await ingredient.save();
            res.redirect('/admin/ingredients');
        }
        else {
            req.flash('error', 'Загрузите изображение');
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;

