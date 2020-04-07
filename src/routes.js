const Routes = require('express').Router();

const TrackingController = require('./app/controllers/tracking-controller');

Routes.get('/tracking', TrackingController.index);
Routes.put('/tracking/:id', TrackingController.update);

module.exports = Routes;
