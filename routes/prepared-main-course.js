const { Router } = require('express')
const Product = require('../models/product');
const info = require('../middleware/info');
const router = Router()
const selectCategory = new Array();
selectCategory[0] = {
    value: 'georgian',
    name: 'Грузинская кухня'
};
selectCategory[1] = {
    value: 'italian',
    name: 'Итальянская кухня'
};
selectCategory[2] = {
    value: 'pan-asian',
    name: 'Паназиатская кухня'
};
selectCategory[3] = {
    value: 'vegetarian',
    name: 'Вегетарианская кухня'
};

const georgian = selectCategory[0];
const italian = selectCategory[1];
const panasian = selectCategory[2];
const vegetarian = selectCategory[3];

router.get('/', info, async (req, res) => {
    try {
        selectCategory[0].products = await Product.find({ page: 'prepared-meal', category: `main-course/${selectCategory[0].value}` }).sort('title').lean();
        selectCategory[1].products = await Product.find({ page: 'prepared-meal', category: `main-course/${selectCategory[1].value}` }).sort('title').lean();
        selectCategory[2].products = await Product.find({ page: 'prepared-meal', category: `main-course/${selectCategory[2].value}` }).sort('title').lean();
        selectCategory[3].products = await Product.find({ page: 'prepared-meal', category: `main-course/${selectCategory[3].value}` }).sort('title').lean();
        res.render('prepared-meal-inner', {
            title: 'Вторые блюда',
            selectCategory,
            page: 'prepared-meal/main-course'
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
            name: 'Вторые блюда'
        };
        if (product.category === 'main-course/' + georgian.value) {
            category[2] = {
                value: `${category[1].value}/#${georgian.value}`,
                name: georgian.name
            };
        }
        else if (product.category === 'main-course/' + italian.value) {
            category[2] = {
                value: `${category[1].value}/#${italian.value}`,
                name: italian.name
            };
        }
        else if (product.category === 'main-course/' + panasian.value) {
            category[2] = {
                value: `${category[1].value}/#${panasian.value}`,
                name: panasian.name
            };
        }
        else if (product.category === 'main-course/' + vegetarian.value) {
            category[2] = {
                value: `${category[1].value}/#${vegetarian.value}`,
                name: vegetarian.name
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