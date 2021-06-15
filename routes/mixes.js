const { Router } = require('express')
const Product = require('../models/product');
const info = require('../middleware/info');
const router = Router()

const selectCategory = new Array();
selectCategory[0] = {
    value: "confectionery",
    name: "Кондитерские смеси"
};
selectCategory[1] = {
    value: "bakery",
    name: "Хлебопекарные смеси"
};
const confectionery = selectCategory[0];
const bakery = selectCategory[1];

router.get('/', info, async (req, res) => {
    res.render('mixes', {
        title: 'Смеси',
        confectionery, bakery
    })
})
router.get('/inner', info, async (req, res) => {
    try {
        const productsBakery = await Product.find({ page: 'mixes', category: `${bakery.value}` }).sort('title').lean();
        const productsConfectionery = await Product.find({ page: 'mixes', category: `${confectionery.value}` }).sort('title').lean();
        res.render('mixes-inner', {
            title: 'Смеси',
            productsBakery,
            productsConfectionery,
            confectionery, bakery
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
            value: "mixes",
            name: "Смеси"
        };
        if (product.category === selectCategory[0].value) {
            category[1] = {
                value: 'mixes/inner#' + selectCategory[0].value,
                name: selectCategory[0].name
            };
        }
        else if (product.category === selectCategory[1].value) {
            category[1] = {
                value: 'mixes/inner#' + selectCategory[1].value,
                name: selectCategory[1].name
            };
        }

        res.render('product', {
            title: `${product.title}`,
            category,
            product
        })
    } catch (e) {
        console.log(e)
    }
})
module.exports = router