// Require
const UserModel = require('../../models/User/user.model');
const Router = require('express').Router();

Router.route('/:idx').get(UserModel.Func.get);
Router.route('/login').post(UserModel.Func.login);
Router.route('/signup').post(UserModel.Func.signup);

// test
Router.route('/').delete(UserModel.Func.allDelete);
Router.route('/').get(UserModel.Func.allGet);


module.exports = Router;