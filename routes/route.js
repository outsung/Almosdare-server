
// Require
const Router = require('express').Router();

const Auth = require('./auth');
const User = require('./User/user.route');
const Dare = require('./Dare/dare.route');

Router.use(Auth)
Router.use('/users', User);
Router.use('/dares', Dare);

module.exports = Router;