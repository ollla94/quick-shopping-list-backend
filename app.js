const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const recepiesRoutes = require('./routes/recepies');
const shoppingListRoutes = require('./routes/shoppingList');

const Recepie = require('./models/recepie');
const Ingredeint = require('./models/ingredient');
const ListIngredient = require('./models/listIngredient');
const ShoppingList = require('./models/shoppingList');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'images');
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
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(recepiesRoutes);
app.use(shoppingListRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

Recepie.hasMany(Ingredeint);
Ingredeint.belongsTo(Recepie);
ShoppingList.hasMany(ListIngredient);
ListIngredient.belongsTo(ShoppingList);

module.exports = app;
