// Require
const DateModel = require('../../models/Dare/dare.model');
const Router = require('express').Router();

// test
Router.route('/test').delete(DateModel.Func.allDelete);
Router.route('/test').get(DateModel.Func.allGet);

Router.route('/').post(DateModel.Func.create);
Router.route('/invited/').get(DateModel.Func.getDareByUser);
Router.route('/pending/').get(DateModel.Func.getPendingDareByUser);
Router.route('/:idx/inviting').post(DateModel.Func.invitingUser);
Router.route('/:idx/response/').post(DateModel.Func.responseDare);


module.exports = Router;