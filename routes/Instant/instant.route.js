// Require
const InstantModel = require('../../models/Instant/instant.model');
const Router = require('express').Router();

Router.route('/').post(InstantModel.Func.create);
Router.route('/invited').get(InstantModel.Func.getDareByUser);
Router.route('/pending').get(InstantModel.Func.getPendingDareByUser);
Router.route('/:idx/inviting').post(InstantModel.Func.invitingUser);
Router.route('/:idx/response').post(InstantModel.Func.responseDare);

// test
Router.route('/').delete(InstantModel.Func.allDelete);
Router.route('/').get(InstantModel.Func.allGet);

module.exports = Router;