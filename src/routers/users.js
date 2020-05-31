const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')


const router = new express.Router()



// -------------- Create user (Sign-up)--------------
router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.genAuthToken()
        res.status(201).send({
            user,
            token
        })
    }catch(err){
        res.status(400).send(err)
    }
})
//--------------------------------------------------

//-----------Logout user----------------------------
router.post('/users/logout', auth, async (req,res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.currToken )
        await req.user.save()
        res.send()
    }catch(err){
        res.status(500).send();
    }
})
//----------------------------------------------------

//-----Logout of all sessions----------------------------
router.post('/users/logoutall', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})
//------------------------------------------------------

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

router.get('/users/me', auth ,async (req,res)=>{
    res.send(req.user)
})

//-----------------------------------------------------------


//---------------Update an individual user by id -------------
router.patch('/users/me', auth, async (req,res)=>{
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
        
        update.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save()
        
        res.send(req.user)
    }catch(err){
        res.status(400).send(err)
    }
})

//-----------------------------------------------

//-----------------Delete a user -----------------------
router.delete('/users/me', auth , async (req,res)=>{
    try{

        await req.user.remove()
        res.send(req.user)
    }catch(err){
        res.status(500).send()
    }
})


module.exports = router