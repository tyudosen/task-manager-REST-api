const express = require('express')
const User = require('../models/user')


const router = new express.Router()



// -------------- Create user --------------
router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.genAuthToken()
        res.status(201).send({
            user,
            token: token,
        })
    }catch(err){
        res.status(400).send(err)
    }
})
//--------------------------------------------------

//-----------------Login user----------------
router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCreds(req.body.email,req.body.password)
        const token = await user.genAuthToken()
        res.send({
            user,
            token
        })
    }catch(err){
        res.status(400).send()
    }
})
//-----------------------------------

//------------- Read all users in db ------------------

router.get('/users', async (req,res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
    
})

//-----------------------------------------------------------

//--------- Get a user by id from db ------------------

router.get('/users/:id', async (req,res) =>{
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

//---------------Update an individual user by id -------------
router.patch('/users/:id', async (req,res)=>{
    const update = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']
    const isValid = update.every((update) =>{
        return allowedUpdates.includes(update)
    })
    if(!isValid){return res.status(400).send({error: 'Invalid operation'})}
    const options = {
        new: true,
        runValidators: true,
    }
    try{
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,options)
        const user = await User.findById(req.params.id)
        console.log(user);
        
        update.forEach((update)=> user[update] = req.body[update])
        console.log(user);
        await user.save()
        
        if(!user){return res.status(404).send()}
        res.send(user)
    }catch(err){
        res.status(400).send(err)
    }
})

//-----------------------------------------------

//-----------------Delete a user -----------------------
router.delete('/users/:id', async (req,res)=>{
    // const options = {
    //     new: true,
    // }
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        res.send(user)
    }catch(err){
        res.status(500).send()
    }
})


module.exports = router