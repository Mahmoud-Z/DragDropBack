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
    console.log(`USE [DragDrop]
    GO
    
    INSERT INTO [dbo].[Machine]
               ([name]
               )
         VALUES
               ('${req.body.machineName}'
               )
    `);

    await request.query(`
    INSERT INTO [dbo].[Machine]
               ([name]
               )
         VALUES
               ('${req.body.machineName}'
               )
    `);
    
    res.json('inserted successfully')
}
module.exports.importTasks = async (req, res) => {
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    let date=new Date().getTime();
    date += ((req.body.TaskDurationH*60*60*1000)+(req.body.TaskDurationM*60*1000))
    console.log(new Date(date));
    await request.query(`
    
    INSERT INTO [dbo].[Task]
               ([name]
               ,[duration]
               ,[endDate]
               ,[machineId])
         VALUES
               ('${req.body.name}'
               ,'${req.body.TaskDurationH}:${req.body.TaskDurationM}'
               ,'${new Date(date).toISOString()}'
               ,'${req.body.machineId}')
    `);
    res.json('inserted successfully')
}
module.exports.getMachine = async (req, res) => {
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    let data=await request.query(`select * from Machine`);
    res.json(data.recordset)
}
module.exports.getTasks = async (req, res) => {
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    let machineData=await request.query(`select * from Machine`);
    let taskData=await request.query(`select * from Task`);
    // let machineId=[]
    // let allData={}
    // console.log(machineData);
    // for (let i = 0; i < machineData.recordset.length; i++) {
    //     machineId.push(machineData.recordset[i].id)
    //     allData[machineData.recordset[i].id]=[]
    // }
    // console.log(machineId);
    // for (let i = 0; i < taskData.recordset.length; i++) {
    //     for (let j = 0; j < machineId.length; j++) {
    //         if(machineId[j]==taskData.recordset[i].machineId){
    //             console.log(machineId[j],taskData.recordset[i].machineId);
    //             allData[machineId[j]].push(taskData.recordset[i])
    //             delete allData.machineId
    //         }
    //     }
    // }
    res.json(taskData.recordset)
}