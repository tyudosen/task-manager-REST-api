const express = require('express')
const path = require('path')
require('./db/mongoose.js' )
const User = require('./models/user.js')
const Task = require('./models/task')

const app = express()
const port = process.env.port || 3000

app.use(express.json())

// -------------- Create user --------------
app.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    }catch(err){
        res.status(400).send()
    }
})
//--------------------------------------------------

//------------- Read all users in db ------------------

app.get('/users', async (req,res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
    
})

//-----------------------------------------------------------

//--------- Get a user by id from db ------------------

app.get('/users/:id', async (req,res) =>{
    const _id = req.params.id 
    try{
        const user = await User.findById(_id)
        if(!user){return res.status(404).send()}
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
} )
//--------------------------------------------------------------

//------------ Create task --------------------------

app.post('/tasks', async (req,res)=>{
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send()
    }
})
//-----------------------------------------------

//---------- Read all tasks in db ---------------
app.get('/tasks', async (req, res) =>{
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(err){
        res.status(500).send()
    }
})

//--------------------------------------------

//----------------Read task by id from db -----------
app.get('/tasks/:id', async (req,res) =>{
    const _id = req.params.id
    try{
        const task = await Task.findById(_id)
        if(!task){return res.status(404).send()}
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

//-----------Start server -----------------

app.listen(port,()=>{
    console.log('server running on ' + port);
    
})
//-------------------------------------
