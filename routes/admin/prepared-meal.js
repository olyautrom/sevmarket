const { Router } = require('express');
const Product = require('../../models/product');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/file')
const fs = require('fs');
const router = Router();

const selectCategory = new Array();
selectCategory[0] = {
    value: 'breakfast/porridge',
    name: 'Завтраки/Каши'
};
selectCategory[1] = {
    value: 'breakfast/cheesecake',
    name: 'Завтраки/Сырники'
};
selectCategory[2] = {
    value: 'breakfast/pancake',
    name: 'Завтраки/Блинчики'
};
selectCategory[3] = {
    value: 'soup/russian',
    name: 'Первые блюда/Русская кухня'
};
selectCategory[4] = {
    value: 'soup/european',
    name: 'Первые блюда/Европейская кухня'
};
selectCategory[5] = {
    value: 'soup/pan-asian',
    name: 'Первые блюда/Паназиатская кухня'
};
selectCategory[6] = {
    value: 'main-course/georgian',
    name: 'Вторые блюда/Грузинская кухня'
};
selectCategory[7] = {
    value: 'main-course/italian',
    name: 'Вторые блюда/Итальянская кухня'
};
selectCategory[8] = {
    value: 'main-course/pan-asian',
    name: 'Вторые блюда/Паназиатская кухня'
};
selectCategory[9] = {
    value: 'main-course/vegetarian',
    name: 'Вторые блюда/Вегетарианская кухня'
};
selectCategory[10] = {
    value: 'baking/pies',
    name: 'Выпечка/Пироги'
};
selectCategory[11] = {
    value: 'baking/tarts',
    name: 'Выпечка/Тарты'
};
selectCategory[12] = {
    value: 'baking/muffins',
    name: 'Выпечка/Маффины и краффины'
};
selectCategory[13] = {
    value: 'dessert/macarons',
    name: 'Десерты/Макаронс'
};
selectCategory[14] = {
    value: 'dessert/tiffin',
    name: 'Десерты/Тиффин'
};
selectCategory[15] = {
    value: 'dessert/desserts',
    name: 'Десерты/Десерты'
};
router.get('/', auth, async (req, res) => {
    const products = await Product.find({ page: 'prepared-meal' }).sort('title').lean();
    products.map(function (item) {
        for (var i = 0; i < selectCategory.length; i++) {
            if (item.category === selectCategory[i].value) {
                item.pageCategory = selectCategory[i].name;
            }
        }
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.post('/', auth, async (req, res) => {
    try {
        const category = req.body.categoryFilter; 
        if (category === 'all') {
            res.redirect('/admin/prepared-meal');
        }   
        else   res.redirect('/admin/prepared-meal/' + category);

    } catch (e) {
        console.log(e);
    }
})

router.get('/add', auth, async (req, res) => {

    res.render('admin/product-add', {
        title: 'Добавить продукт',
        layout: 'admin',
        page: 'prepared-meal',
        selectCategory
    });
})

router.post('/add', auth, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 8 }]), async (req, res) => {
    try {
        const { title, description, ingredients, package, conditions, category } = req.body;
        const imagesOrder = JSON.parse(req.body.imagesOrder);
        const images = imagesOrder.map(orderId => '/ugc_images/' + req.files['images'][Number(orderId)].filename);
        const page = 'prepared-meal';

        const product = new Product({
            title, description, ingredients, package, conditions, category, page,
            mainImage: '/ugc_images/' + req.files['mainImage'][0].filename,
            images
        });
        await product.save();
        res.redirect('/admin/prepared-meal');

    } catch (e) {
        console.log(e);
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/admin');
    }
    const product = await Product.findById(req.params.id).lean();
    for (var i = 0; i < selectCategory.length; i++) {
        if (product.category === selectCategory[i].value) {
            selectCategory[i].selected = true;
        }
        else selectCategory[i].selected = false;
    }
    res.render('admin/product-edit', {
        title: `Редактировать ${product.title}`,
        layout: 'admin',
        product,
        selectCategory,
    })
})

router.post('/edit', auth, upload.single('mainImage'), async (req, res) => {
    try {
        const { id } = req.body;
        delete req.body.id;
        const product = await Product.findById(id);
        const toChange = {
            title: req.body.title,
            description: req.body.description,
            ingredients: req.body.ingredients,
            package: req.body.package,
            conditions: req.body.conditions,
            category: req.body.category,
            page: 'prepared-meal',
        }
        if (req.file) {
            fs.unlink('./public' + product.mainImage, (err) => {
                if (err) throw err;
            });
            toChange.mainImage = '/ugc_images/' + req.file.filename;
        }
        Object.assign(product, toChange);
        await product.save();
        res.redirect('/admin/prepared-meal');
    } catch (e) {
        console.log(e);
    }
})

router.get('/:id/delete', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product.mainImage) {
            fs.unlink('./public' + product.mainImage, (err) => {
                if (err) throw err;
            });
        }
        await Product.deleteOne({
            _id: req.params.id
        });
        res.redirect('/admin/prepared-meal');
    } catch (e) {
        console.log(e);
    }
})

router.get('/breakfast/porridge', auth, async (req, res) => {
    const products = await Product.find({ category: 'breakfast/porridge' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[0].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[0].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/breakfast/cheesecake', auth, async (req, res) => {
    const products = await Product.find({ category: 'breakfast/cheesecake' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[1].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[1].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/breakfast/pancake', auth, async (req, res) => {
    const products = await Product.find({ category: 'breakfast/pancake' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[2].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[2].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/soup/russian', auth, async (req, res) => {
    const products = await Product.find({ category: 'soup/russian' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[3].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[3].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/soup/european', auth, async (req, res) => {
    const products = await Product.find({ category: 'soup/european' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[4].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[4].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/soup/pan-asian', auth, async (req, res) => {
    const products = await Product.find({ category: 'soup/pan-asian' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[5].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[5].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/main-course/georgian', auth, async (req, res) => {
    const products = await Product.find({ category: 'main-course/georgian' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[6].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[6].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/main-course/italian', auth, async (req, res) => {
    const products = await Product.find({ category: 'main-course/italian' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[7].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[7].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/main-course/pan-asian', auth, async (req, res) => {
    const products = await Product.find({ category: 'main-course/pan-asian' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[8].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[8].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/main-course/vegetarian', auth, async (req, res) => {
    const products = await Product.find({ category: 'main-course/vegetarian' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[9].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[9].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/baking/pies', auth, async (req, res) => {
    const products = await Product.find({ category: 'baking/pies' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[10].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[10].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/baking/tarts', auth, async (req, res) => {
    const products = await Product.find({ category: 'baking/tarts' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[11].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[11].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/baking/muffins', auth, async (req, res) => {
    const products = await Product.find({ category: 'baking/muffins' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[12].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[12].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/dessert/macarons', auth, async (req, res) => {
    const products = await Product.find({ category: 'dessert/macarons' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[13].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[13].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/dessert/tiffin', auth, async (req, res) => {
    const products = await Product.find({ category: 'dessert/tiffin' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[14].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[14].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
router.get('/dessert/desserts', auth, async (req, res) => {
    const products = await Product.find({ category: 'dessert/desserts' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[15].name;
    })
    for (var i = 0; i < selectCategory.length; i++) {
        selectCategory[i].selected = false;
    }
    selectCategory[15].selected = true;
    res.render('admin/products', {
        title: 'Готовые изделия',
        layout: 'admin',
        page: 'prepared-meal',
        products,
        selectCategory
    })
})
module.exports = router