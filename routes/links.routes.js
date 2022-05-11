const appRoutes = require('express').Router();
const controller=require('../controllers/controller')

appRoutes.post("/importMachine", controller.importMachine)
appRoutes.post("/importTasks", controller.importTasks)
appRoutes.get("/getMachine", controller.getMachine)
appRoutes.get("/getTasks", controller.getTasks)

module.exports = appRoutes;