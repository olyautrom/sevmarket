const express = require('express');
const path = require('path');
const fs = require('fs');
const flash = require('connect-flash');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoMarket = require('connect-mongodb-session')(session);
const csrf = require('csurf');
var compression = require('compression')

const indexRoutes = require('./routes/index');
const contactsRoutes = require('./routes/contacts');
const aboutCompanyRoutes = require('./routes/about-company');
const ingredientsRoutes = require('./routes/ingredients');
const mixesRoutes = require('./routes/mixes');
const preparedMealRoutes = require('./routes/prepared-meal');
const preparedBakingRoutes = require('./routes/prepared-baking');
const preparedDessertRoutes = require('./routes/prepared-dessert');
const preparedBreakfastRoutes = require('./routes/prepared-breakfast');
const preparedMainCourseRoutes = require('./routes/prepared-main-course');
const preparedSoupRoutes = require('./routes/prepared-soup');
const newsRoutes = require('./routes/news');
const adminRoutes = require('./routes/admin/admin');
const adminUsersRoutes = require('./routes/admin/users');
const adminNewsRoutes = require('./routes/admin/news');
const adminIngredientsRoutes = require('./routes/admin/ingredients');
const adminInfoRoutes = require('./routes/admin/info');
const adminRequestRoutes = require('./routes/admin/request');
const adminMixesRoutes = require('./routes/admin/mixes');
const adminPreparedMealRoutes = require('./routes/admin/prepared-meal');

const varMiddleware = require('./middleware/variables');
const errorHandler = require('./middleware/error');

const MONGODB_URI = ``;

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
const market = new MongoMarket({
    collection: 'sessions',
    uri: MONGODB_URI
})

app.use(flash());
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store: market,
}))

app.use(csrf())
app.use(compression())
app.use(varMiddleware);

app.use('/', indexRoutes);
app.use('/about-company', aboutCompanyRoutes);
app.use('/contacts', contactsRoutes);
app.use('/ingredients', ingredientsRoutes);
app.use('/mixes', mixesRoutes);
app.use('/prepared-meal', preparedMealRoutes);
app.use('/prepared-meal/baking', preparedBakingRoutes);
app.use('/prepared-meal/dessert', preparedDessertRoutes);
app.use('/prepared-meal/breakfast', preparedBreakfastRoutes);
app.use('/prepared-meal/main-course', preparedMainCourseRoutes);
app.use('/prepared-meal/soup', preparedSoupRoutes);
app.use('/news', newsRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/admin/news', adminNewsRoutes);
app.use('/admin/ingredients', adminIngredientsRoutes);
app.use('/admin/info', adminInfoRoutes);
app.use('/admin/request', adminRequestRoutes);
app.use('/admin/mixes', adminMixesRoutes);
app.use('/admin/prepared-meal', adminPreparedMealRoutes);

app.use(errorHandler);

const PORT = process.env.Port || 3000;

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    
        // const candidate = await Admin.findOne()
        // if (!candidate) {
        //     const admin = new Admin ({
        //         login: 'olya',
        //         password: 'utrom'
        //         role: 'admin'
        //     })

        //     await admin.save()
        // }
        

        app.listen(PORT, () => {
            console.log(`Sever is running on port ${PORT}`);
        })

    } catch(e) {
        console.log(e);
    }
}
start();
