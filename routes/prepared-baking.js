const { Router } = require('express')
const Product = require('../models/product');
const info = require('../middleware/info');
const router = Router()
const selectCategory = new Array();
selectCategory[0] = {
    value: 'pies',
    name: 'Пироги'
};
selectCategory[1] = {
    value: 'tarts',
    name: 'Тарты'
};
selectCategory[2] = {
    value: 'muffins',
    name: 'Маффины и краффины'
};

const pies = selectCategory[0];
const tarts = selectCategory[1];
const muffins = selectCategory[2];

router.get('/', info, async (req, res) => {
    try {
        selectCategory[0].products = await Product.find({ page: 'prepared-meal', category: `baking/${selectCategory[0].value}` }).sort('title').lean();
        selectCategory[1].products = await Product.find({ page: 'prepared-meal', category: `baking/${selectCategory[1].value}` }).sort('title').lean();
        selectCategory[2].products = await Product.find({ page: 'prepared-meal', category: `baking/${selectCategory[2].value}` }).sort('title').lean();
        res.render('prepared-meal-inner', {
            title: 'Выпечка',
            selectCategory,
            page: 'prepared-meal/baking'
        })
    } catch (e) {
        console.log(e)
    }
})
router.get('/:id', info, async (req, res) => {
    try {
        const category = new Array();
        const product = await Product.findById(req.params.id).lean();
        product.images.unshift(product.mainImage);
        category[0] = {
            value: 'prepared-meal',
            name: 'Готовые изделия'
        };
        category[1] = {
            value: `${category[0].value}/baking`,
            name: 'Выпечка'
        };
        if (product.category === 'baking/' + pies.value) {
            category[2] = {
                value: `${category[1].value}#${pies.value}`,
                name: pies.name
            };
        }
        else if (product.category === 'baking/' + tarts.value) {
            category[2] = {
                value: `${category[1].value}#${tarts.value}`,
                name: tarts.name
            };
        }
        else if (product.category === 'baking/' + muffins.value) {
            category[2] = {
                value: `${category[1].value}#${muffins.value}`,
                name: muffins.name
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