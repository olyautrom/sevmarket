const { Router } = require('express')
const Product = require('../models/product');
const info = require('../middleware/info');
const router = Router()
const selectCategory = new Array();
selectCategory[0] = {
    value: 'macarons',
    name: 'Макаронс'
};
selectCategory[1] = {
    value: 'tiffin',
    name: 'Тиффин'
};
selectCategory[2] = {
    value: 'desserts',
    name: 'Десерты'
};

const macarons = selectCategory[0];
const tiffin = selectCategory[1];
const desserts = selectCategory[2];

router.get('/', info, async (req, res) => {
    try {
        selectCategory[0].products = await Product.find({ page: 'prepared-meal', category: `dessert/${selectCategory[0].value}` }).sort('title').lean();
        selectCategory[1].products = await Product.find({ page: 'prepared-meal', category: `dessert/${selectCategory[1].value}` }).sort('title').lean();
        selectCategory[2].products = await Product.find({ page: 'prepared-meal', category: `dessert/${selectCategory[2].value}` }).sort('title').lean();
        res.render('prepared-meal-inner', {
            title: 'Кондитерские изделия',
            selectCategory,
            page: 'prepared-meal/dessert'
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
            value: `${category[0].value}/dessert`,
            name: 'Кондитерские изделия'
        };
        if (product.category === 'dessert/' + macarons.value) {
            category[2] = {
                value: `${category[1].value}#${macarons.value}`,
                name: macarons.name
            };
        }
        else if (product.category === 'dessert/' + tiffin.value) {
            category[2] = {
                value: `${category[1].value}#${tiffin.value}`,
                name: tiffin.name
            };
        }
        else if (product.category === 'dessert/' + desserts.value) {
            category[2] = {
                value: `${category[1].value}#${desserts.value}`,
                name: desserts.name
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