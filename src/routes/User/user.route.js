// Require
const Router = require('express').Router();
const UserMiddleware = require('../../middlewares/User/user.middleware');

// test
Router.route('/test').delete(UserMiddleware.allDelete);
Router.route('/test').get(UserMiddleware.allGet);



Router.route('/').get(UserMiddleware.getUserByJwt);
Router.route('/id/:id').get(UserMiddleware.getUserById);
Router.route('/idx/:idx').get(UserMiddleware.getUserByIdx);

Router.route('/login').post(UserMiddleware.login);
Router.route('/signup').post(UserMiddleware.signup);




module.exports = Router;