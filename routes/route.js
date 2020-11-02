
// Require
const Router = require('express').Router();

const Auth = require('./auth');
const User = require('./User/user.route');
const Dare = require('./Dare/dare.route');
const Instant = require('./Instant/instant.route');
const Timeline = require('./Timeline/timeline.route');

Router.use(Auth)
Router.use('/users', User);
Router.use('/dares', Dare);
Router.use('/instants', Instant);
Router.use('/timelines', Timeline);

module.exports = Router;