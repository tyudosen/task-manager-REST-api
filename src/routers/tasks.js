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
    try{
        //const task = await Task.find({author: req.user._id}) // this works too
        await req.user.populate('tasks').execPopulate();
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
