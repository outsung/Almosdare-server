// Require
const Router = require('express').Router();
const DareMiddleware = require('../../middlewares/Dare/dare.middleware');

// test
Router.route('/test').delete(DareMiddleware.allDelete);
Router.route('/test').get(DareMiddleware.allGet);

Router.route('/').post(DareMiddleware.create);
// Router.route('/invited/').get(DareMiddleware.getDareByUser);
// Router.route('/pending/').get(DareMiddleware.getPendingDareByUser);
Router.route('/:idx/inviting').post(DareMiddleware.invitingUser);
Router.route('/:idx/response/').post(DareMiddleware.responseDare);


module.exports = Router;