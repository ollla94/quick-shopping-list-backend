const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const config = require('./config.json');

const recipesRoutes = require('./routes/recipes');
const shoppingListRoutes = require('./routes/shoppingList');
const authRoutes = require('./routes/auth');

const Recipe = require('./models/recipe');
const Ingredeint = require('./models/ingredient');
const ListIngredient = require('./models/listIngredient');
const ShoppingList = require('./models/shoppingList');
const User = require('./models/user');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.images_dir);
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use('/images', express.static(config.images_dir));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(recipesRoutes);
app.use(shoppingListRoutes);
app.use(authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

Recipe.hasMany(Ingredeint);
Ingredeint.belongsTo(Recipe);
ShoppingList.hasMany(ListIngredient);
ListIngredient.belongsTo(ShoppingList);
User.hasMany(Recipe);
Recipe.belongsTo(User);
User.hasOne(ShoppingList);
ShoppingList.belongsTo(User);

module.exports = app;
