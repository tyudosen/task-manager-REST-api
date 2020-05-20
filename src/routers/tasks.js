const Task = require('../models/task')
const express = require('express')

const router = express.Router()



//------------ Create task --------------------------

router.post('/tasks', async (req,res)=>{
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send()
    }
})
//-----------------------------------------------

//-------------Delete a task-------------------
router.delete('/tasks/:id', async (req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){return res.status(400).send()}
        res.send(task) 
    }catch{
        res.status(500).send()
    }
})
//-------------------------------------------

//---------- Read all tasks in db ---------------
router.get('/tasks', async (req, res) =>{
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(err){
        res.status(500).send()
    }
})

//--------------------------------------------

//----------------Read task by id from db -----------
router.get('/tasks/:id', async (req,res) =>{
    const _id = req.params.id
    try{
        const task = await Task.findById(_id)
        if(!task){return res.status(404).send()}
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})
//---------------------------------------------------------

//-------------Update task--------------------------------
router.patch('/tasks/:id', async (req,res)=>{
    const options = {
        new: true,
        runValidators: true,
    }
    const updates = Object.keys(req.body)
    const validUpdates = ['description', 'completed']
    const isValid = updates.every((update)=>{
        return validUpdates.includes(update)
    })
    if(!isValid){return res.status(400).send()}
    
    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,options)
        if(!task){return res.send(400).send() }
        res.send(task)
        
    }catch(err){
        res.status(500).send()
    }
    

    
})

module.exports = router
