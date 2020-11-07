// Require
const Router = require('express').Router();
const InstantMiddleware = require('../../middlewares/Instant/instant.middleware');

// test
Router.route('/test').delete(InstantMiddleware.allDelete);
Router.route('/test').get(InstantMiddleware.allGet);

Router.route('/').post(InstantMiddleware.create);
// Router.route('/invited').get(InstantMiddleware.getInstantByUser);
// Router.route('/pending').get(InstantMiddleware.getPendingInstantByUser);
Router.route('/:idx/inviting').post(InstantMiddleware.invitingUser);
Router.route('/:idx/response').post(InstantMiddleware.responseInstant);


module.exports = Router;