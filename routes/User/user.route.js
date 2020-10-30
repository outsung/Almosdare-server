// Require
const UserModel = require('../../models/User/user.model');
const Router = require('express').Router();

// test
Router.route('/test').delete(UserModel.Func.allDelete);
Router.route('/test').get(UserModel.Func.allGet);



Router.route('/').get(UserModel.Func.getUserById);
// Router.route('/:idx').get(UserModel.Func.get);
Router.route('/:id').get(UserModel.Func.getUserById);

Router.route('/login').post(UserModel.Func.login);
Router.route('/signup').post(UserModel.Func.signup);




module.exports = Router;