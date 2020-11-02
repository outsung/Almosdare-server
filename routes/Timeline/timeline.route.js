// Require
const TimelineModel = require('../../models/Timeline/timeline.model');
const Router = require('express').Router();

// test
Router.route('/test').delete(TimelineModel.Func.allDelete);
Router.route('/test').get(TimelineModel.Func.allGet);

Router.route('/:limit').get(TimelineModel.Func.getByTime);
Router.route('/:before/:limit').get(TimelineModel.Func.getByTime);

module.exports = Router;