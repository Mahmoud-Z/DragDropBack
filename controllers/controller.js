// here we do all functionality that sends requests to the api and retrive data so we can send it to the frontend and show it in a user
// interface 
const appRoutes = require('express').Router(); //call for Router method inside express module to give access for any endpoint
const e = require('cors');
const sql = require('mssql')//call for using sql module
let mssql = require('../configuration/mssql-pool-management.js')
const config = require('../Configuration/config')//call for using configuration module that we create it to store database conaction

module.exports.test = async (req, res) => {
    res.json('I am alive')
}
module.exports.importMachine = async (req, res) => {
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    await request.query(`USE [DragDrop]
    GO
    
    INSERT INTO [dbo].[Machine]
               ([name]
               ,[taskNumber])
         VALUES
               (${req.body.name}
               ,${req.body.taskNumber})
    GO
    
    
    `);
    res.json('inserted successfully')
}
module.exports.importTasks = async (req, res) => {
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    await request.query(`USE [DragDrop]
    GO
    
    INSERT INTO [dbo].[Task]
               ([name]
               ,[description]
               ,[duration]
               ,[endDate]
               ,[machineId])
         VALUES
               (${req.body.name}
               ,${req.body.description}
               ,${req.body.duration}
               ,${req.body.endDate}
               ,${req.body.machineId})
    GO
    
    `);
    res.json('inserted successfully')
}
module.exports.getMachine = async (req, res) => {
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    let data=await request.query(`select * from Machine`);
    res.json(data)
}
module.exports.getTasks = async (req, res) => {
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    let data=await request.query(`select * from Task`);
    res.json(data)
}