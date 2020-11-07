// Require
const Router = require('express').Router();
const TimelineMiddlewares = require('../../middlewares/Timeline/timeline.middleware');

// test
Router.route('/test').delete(TimelineMiddlewares.allDelete);
Router.route('/test').get(TimelineMiddlewares.allGet);

Router.route('/:limit').get(TimelineMiddlewares.getByTime);
Router.route('/:before/:limit').get(TimelineMiddlewares.getByTime);


module.exports = Router;