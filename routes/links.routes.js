const appRoutes = require('express').Router();
const controller=require('../controllers/controller')

appRoutes.get("/", controller.test)

module.exports = appRoutes;