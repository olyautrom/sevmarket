const { Router } = require('express')
const Product = require('../models/product');
const info = require('../middleware/info');
const router = Router()
const selectCategory = new Array();
selectCategory[0] = {
    value: 'russian',
    name: 'Русская кухня'
};
selectCategory[1] = {
    value: 'european',
    name: 'Европейская кухня'
};
selectCategory[2] = {
    value: 'pan-asian',
    name: 'Паназиатская кухня'
};

const russian = selectCategory[0];
const european = selectCategory[1];
const panasian = selectCategory[2];

router.get('/', info, async (req, res) => {
    try {
        selectCategory[0].products = await Product.find({ page: 'prepared-meal', category: `soup/${selectCategory[0].value}` }).sort('title').lean();
        selectCategory[1].products = await Product.find({ page: 'prepared-meal', category: `soup/${selectCategory[1].value}` }).sort('title').lean();
        selectCategory[2].products = await Product.find({ page: 'prepared-meal', category: `soup/${selectCategory[2].value}` }).sort('title').lean();
        res.render('prepared-meal-inner', {
            title: 'Первые блюда',
            selectCategory,
            page: 'prepared-meal/soup'
        })
    } catch (e) {
        console.log(e)
    }
})
router.get('/:id', info, async (req, res) => {
    try {
        const category = new Array();
        const product = await Product.findById(req.params.id).lean();
        category[0] = {
            value: 'prepared-meal',
            name: 'Готовые изделия'
        };
        category[1] = {
            value: `${category[0].value}/main-course`,
            name: 'Первые блюда'
        };
        if (product.category === 'main-course/' + russian.value) {
            category[2] = {
                value: `${category[1].value}/#${russian.value}`,
                name: russian.name
            };
        }
        else if (product.category === 'main-course/' + european.value) {
            category[2] = {
                value: `${category[1].value}/#${european.value}`,
                name: european.name
            };
        }
        else if (product.category === 'main-course/' + panasian.value) {
            category[2] = {
                value: `${category[1].value}/#${panasian.value}`,
                name: panasian.name
            };
        }

        res.render('product', {
            title: `${product.title}`,
            product,
            category
        })
    } catch (e) {
        console.log(e)
    }
})
module.exports = router