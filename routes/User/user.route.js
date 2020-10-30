// Require
const UserModel = require('../../models/User/user.model');
const Router = require('express').Router();

// test
Router.route('/test').delete(UserModel.Func.allDelete);
Router.route('/test').get(UserModel.Func.allGet);



Router.route('/').get(UserModel.Func.getUserByJwt);
Router.route('/id/:id').get(UserModel.Func.getUserById);
Router.route('/idx/:idx').get(UserModel.Func.getUserByIdx);

Router.route('/login').post(UserModel.Func.login);
Router.route('/signup').post(UserModel.Func.signup);




module.exports = Router;