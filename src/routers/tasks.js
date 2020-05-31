const Task = require('../models/task')
const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()



//------------ Create task --------------------------

router.post('/tasks', auth, async (req,res)=>{
    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send()
    }
})
//-----------------------------------------------

//-------------Delete a task-------------------
router.delete('/tasks/:id', auth, async (req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})

        if(!task){return res.status(404).send()}
        
        res.send(task) 
    }catch{
        res.status(500).send()
    }
})
//-------------------------------------------

//---------- Read all tasks in db ---------------
router.get('/tasks', auth, async (req, res) =>{
    const match = {}
    const sort = {}

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    if(req.query.completed){ match.completed = req.query.completed === 'true'}
    try{
        //const task = await Task.find({author: req.user._id}) // this works too
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.send(req.user.tasks)
    }catch(err){
        res.status(500).send()
    }
})

//--------------------------------------------

//----------------Read task by id from db -----------
router.get('/tasks/:id', auth, async (req,res) =>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({ _id, author: req.user._id})

        if(!task){return res.status(404).send()}

        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})
//---------------------------------------------------------

//-------------Update task--------------------------------
router.patch('/tasks/:id', auth, async (req,res)=>{
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
        const task = await Task.findOne({_id: req.params.id, author: req.user._id})
       
        if(!task){return res.status(400).send() }

        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()

        res.send(task)
        
    }catch(err){
        res.status(500).send()
    }
    

    
})

module.exports = router
