const {Router} = require('express')
const Ingredient = require('../models/ingredient');
const Info = require('../models/info');
const info = require('../middleware/info');
const router = Router()

router.get('/', info, async (req, res) => {
    const ingredients = await Ingredient.find().lean()
    const textIngredient = (await Info.findOne({ infoId: 'textIngredient' })).value;
    res.render('ingredients', {
        title: 'Ингредиенты',
        ingredients,
        textIngredient
    })
})
module.exports = router