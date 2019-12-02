const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config.json');
const User = require('../models/user');
const ShoppingList = require('../models/shoppingList');

exports.postSingup = async (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;

    let hashedPasswored = await bcrypt.hash(password, 12)

    User.findOne({ where: { login: login } }).then(user => {
        if (user) {
            const error = new Error('Login name is already taken. Choose another name');
            error.statusCode = (401);
            throw error;
        }
        User.create({
            login: login,
            password: hashedPasswored
        }).then(user => {
            res.status(200).json({ message: 'sucsses', userId: user.id })
        })
            .catch(error => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            });
    });

};

exports.postLogin = (req, res, next) => {
    const password = req.body.password;
    const login = req.body.login;
    let loadedUser;

    User.findOne({
        where: {
            login: login
        }, include: [ShoppingList]
    }).then(user => {
        if (!user) {
            const error = new Error('Login does not exist.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password)
    }).then(match => {
        if (match) {
            const token = jwt.sign(
                {
                    login: loadedUser.login,
                    id: loadedUser.id
                },
                config.secret,
                { expiresIn: '1h' }
            );
            res.status(200).json({ message: 'logged in', token: token, user: loadedUser })
        } else {
            const error = new Error('Password is incorect.');
            error.statusCode = 401;
            throw error;
        }
    }).catch(error => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
