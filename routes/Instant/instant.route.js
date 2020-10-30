// Require
const InstantModel = require('../../models/Instant/instant.model');
const Router = require('express').Router();

// test
Router.route('/test').delete(InstantModel.Func.allDelete);
Router.route('/test').get(InstantModel.Func.allGet);

Router.route('/').post(InstantModel.Func.create);
Router.route('/invited').get(InstantModel.Func.getInstantByUser);
Router.route('/pending').get(InstantModel.Func.getPendingInstantByUser);
Router.route('/:idx/inviting').post(InstantModel.Func.invitingUser);
Router.route('/:idx/response').post(InstantModel.Func.responseInstant);

module.exports = Router;