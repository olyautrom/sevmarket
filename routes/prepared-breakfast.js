const { Router } = require('express')
const Product = require('../models/product');
const info = require('../middleware/info');
const router = Router()
const selectCategory = new Array();
selectCategory[0] = {
    value: 'porridge',
    name: 'Каши'
};
selectCategory[1] = {
    value: 'cheesecake',
    name: 'Сырники'
};
selectCategory[2] = {
    value: 'pancake',
    name: 'Блинчики'
};
const porridge = selectCategory[0];
const cheesecake = selectCategory[1];
const pancake = selectCategory[2];
router.get('/', info, async (req, res) => {
    try {
        selectCategory[0].products = await Product.find({ page: 'prepared-meal', category: `breakfast/${selectCategory[0].value}` }).sort('title').lean();
        selectCategory[1].products = await Product.find({ page: 'prepared-meal', category: `breakfast/${selectCategory[1].value}` }).sort('title').lean();
        selectCategory[2].products = await Product.find({ page: 'prepared-meal', category: `breakfast/${selectCategory[2].value}` }).sort('title').lean();
        res.render('prepared-meal-inner', {
            title: 'Завтраки',
            selectCategory,
            page: 'prepared-meal/breakfast'
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
            value: `${category[0].value}/breakfast`,
            name: 'Завтраки'
        };
        if (product.category === 'breakfast/' + porridge.value) {
            category[2] = {
                value: `${category[1].value}#${porridge.value}`,
                name: porridge.name
            };
        }
        else if (product.category === 'breakfast/' + cheesecake.value) {
            category[2] = {
                value: `${category[1].value}#${cheesecake.value}`,
                name: cheesecake.name
            };
        }
        else if (product.category === 'breakfast/' + pancake.value) {
            category[2] = {
                value: `${category[1].value}#${pancake.value}`,
                name: pancake.name
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