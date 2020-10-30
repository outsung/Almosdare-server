
// Require
const Router = require('express').Router();

const Auth = require('./auth');
const User = require('./User/user.route');
const Dare = require('./Dare/dare.route');
const Instant = require('./Instant/instant.route');

Router.use(Auth)
Router.use('/users', User);
Router.use('/dares', Dare);
Router.use('/instants', Instant);

module.exports = Router;