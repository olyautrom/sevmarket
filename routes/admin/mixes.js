const { Router } = require('express');
const Product = require('../../models/product');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/file')
const fs = require('fs');
const router = Router();

const selectCategory = new Array();
selectCategory[0] = {
    value: "confectionery",
    name: "Кондитерские смеси"
};
selectCategory[1] = {
    value: "bakery",
    name: "Хлебопекарные смеси"
};

router.get('/', auth, async (req, res) => {
    const products = await Product.find({ page: 'mixes' }).sort('title').lean();
    products.map(function (item) {
        if (item.category == selectCategory[0].value) {
            item.pageCategory = selectCategory[0].name;
        } else if (item.category == selectCategory[1].value) {
            item.pageCategory = selectCategory[1].name;
        }
    })
    selectCategory[0].selected = false;
    selectCategory[1].selected = false;
    res.render('admin/products', {
        title: 'Смеси',
        layout: 'admin',
        page: 'mixes',
        products,
        selectCategory
    })
})
router.post('/', auth, async (req, res) => {
    try {
        const category = req.body.categoryFilter; 
        if (category === 'all') {
            res.redirect('/admin/mixes');
        }   
        else   res.redirect('/admin/mixes/' + category);

    } catch (e) {
        console.log(e);
    }
})

router.get('/add', auth, async (req, res) => {
    res.render('admin/product-add', {
        title: 'Добавить продукт',
        layout: 'admin',
        page: 'mixes',
        selectCategory
    });
})

router.post('/add', auth, upload.fields([{ name: 'mainImage[]', maxCount: 1 }, { name: 'images[]', maxCount: 8 }]), async (req, res) => {
    try {
        const { title, description, ingredients, package, conditions, category } = req.body;
        const page = 'mixes';
        let images;
        
        if (req.files['images[]']) {
            images = req.files['images[]'].map(file => '/ugc_images/' + file.filename);
        }

        const product = new Product({
            title, description, ingredients, package, conditions, category, page,
            mainImage: req.files['mainImage[]'] ? '/ugc_images/' + req.files['mainImage[]'][0].filename : undefined,
            images
        });
        await product.save();
        res.redirect('/admin/mixes');

    } catch (e) {
        console.log(e);
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/admin');
    }
    const product = await Product.findById(req.params.id).lean();
    if (product.category === selectCategory[0].value) {
        selectCategory[0].selected = true;
    }
    else if (product.category === selectCategory[1].value) {
        selectCategory[1].selected = true;
    }
    res.render('admin/product-edit', {
        title: `Редактировать ${product.title}`,
        layout: 'admin',
        product,
        selectCategory,
    })
})

router.post('/edit', auth, upload.fields([{ name: 'mainImage[]', maxCount: 1 }, { name: 'images[]', maxCount: 8 }]), async (req, res) => {
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
            page: 'mixes',
        }
        
        const mainImageDeleted = !req.body.mainImagePreloaded || req.body.mainImagePreloaded.length === 0;
        const mainImage = mainImageDeleted ? undefined : product.mainImage;
        const newMainImage = req.files && req.files['mainImage[]'] && req.files['mainImage[]'][0];

        if (product.mainImage && (mainImageDeleted || newMainImage)) {
            fs.unlink('./public' + product.mainImage, (err) => {
                if (err) throw err;
            });
        }

        toChange.mainImage = newMainImage ? '/ugc_images/' + newMainImage.filename : mainImage;

        const preloadedImageIds = req.body.imagesPreloaded || [];
        const images = product.images.filter((image, index) => preloadedImageIds.indexOf(index.toString()) > -1);
        const newImages = req.files && req.files['images[]'];

        toChange.images = images;
    
        if (newImages) {
            toChange.images = images.concat(newImages.map(file => '/ugc_images/' + file.filename));
        }

        Object.assign(product, toChange);
        await product.save();
        res.redirect('/admin/mixes');
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
        res.redirect('/admin/mixes');
    } catch (e) {
        console.log(e);
    }
})

router.get('/bakery', auth, async (req, res) => {
    const products = await Product.find({ page: 'mixes', category: 'bakery' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[1].name;
    })
    selectCategory[0].selected = false;
    selectCategory[1].selected = true;
    res.render('admin/products', {
        title: 'Смеси',
        layout: 'admin',
        page: 'mixes',
        products,
        selectCategory
    })
})
router.get('/confectionery', auth, async (req, res) => {
    const products = await Product.find({ page: 'mixes', category: 'confectionery' }).sort('title').lean();
    products.map(function (item) {
        item.pageCategory = selectCategory[0].name;
    })
    selectCategory[0].selected = true;
    selectCategory[1].selected = false;
    res.render('admin/products', {
        title: 'Смеси',
        layout: 'admin',
        page: 'mixes',
        products,
        selectCategory
    })
})

module.exports = router