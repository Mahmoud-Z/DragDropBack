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
    let tasksOrder;
    date += ((req.body.TaskDurationH*60*60*1000)+(req.body.TaskDurationM*60*1000))
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
    let taskId=await (await request.query(`select max(id) from Task`)).recordset[0][""]
    if (await (await request.query(`select taskNumber from Machine where id=${req.body.machineId}`)).recordset[0].taskNumber==null || await (await request.query(`select taskNumber from Machine where id=${req.body.machineId}`)).recordset[0].taskNumber=='') 
        tasksOrder=taskId
    else
        tasksOrder=await (await request.query(`select taskNumber from Machine where id=${req.body.machineId}`)).recordset[0].taskNumber+","+taskId
    await request.query(`UPDATE [dbo].[Machine] SET [taskNumber]='${tasksOrder}' WHERE id=${req.body.machineId}`);
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
    let machineId=[]
    let allData={}
    for (let i = 0; i < machineData.recordset.length; i++) {
        machineId.push(machineData.recordset[i].id)
        allData[machineData.recordset[i].id]=[]
    }
    for (let i = 0; i < taskData.recordset.length; i++) {
        for (let j = 0; j < machineId.length; j++) {
            if(machineId[j]==taskData.recordset[i].machineId){
                allData[machineId[j]].push(taskData.recordset[i])
                delete allData.machineId
            }
        }
    }
    res.json(allData)
}
module.exports.deleteMachine = async (req, res) => {
    console.log(req.body);
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    await request.query(`delete from Machine where id=${req.body.id}
                        delete from Task where machineId=${req.body.id}`);
    res.json('Deleted successfully')
}
module.exports.deleteTask = async (req, res) => {
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    let mid =await (await request.query(`select machineId from Task where id=${req.body.id}`)).recordset[0].machineId
    let tasksOrder=await (await request.query(`select taskNumber from Machine where id=${mid}`)).recordset[0].taskNumber
    console.log(tasksOrder,tasksOrder.split(','),'before');
    console.log(tasksOrder.indexOf(req.body.id));
    let newIds=[];
    for (let i = 0; i < tasksOrder.split(',').length; i++) {
        if (tasksOrder.split(',')[i]!=req.body.id) {
            newIds.push(tasksOrder.split(',')[i])
        }
    }
    console.log(newIds.join(','));
    await request.query(`UPDATE [dbo].[Machine] SET [taskNumber]='${newIds.join(',')}' WHERE id=${mid}`);
    await request.query(`delete from Task where id=${req.body.id}`);
    res.json('Deleted successfully')
}
module.exports.updateTask = async (req, res) => {
    let sqlPool = await mssql.GetCreateIfNotExistPool(config)
    let request = new sql.Request(sqlPool)
    await request.query(`UPDATE [dbo].[Task] SET [machineId]=${req.body.machineId} WHERE id=${req.body.taskId}`);
    res.json('Deleted successfully')
}