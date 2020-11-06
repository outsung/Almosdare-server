// Require
const Router = require('express').Router();
const AppointmentMiddleware = require('../../middlewares/Appointment/appointment.middleware');


Router.route('/').get(AppointmentMiddleware.getAppointment);


module.exports = Router;