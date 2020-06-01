const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')


const router = new express.Router()
const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|png|jpg)$/)){
            return cb(new Error('Please upload an image'))
        }
        
        cb(undefined, true)

    }
})



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

//------------Upload profile pic-------------------
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error,req,res,next)=>{
    res.status(400).send({error: error.message})
})
//----------------------------------------------------

//-----------------Delete profile pic------------------------
router.delete('/users/me/avatar', auth, async (req,res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
//-------------------------------------------------------

//---------------Serve avatar------------------------------
router.get('/users/:id/avatar', async(req,res) =>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'images/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})


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