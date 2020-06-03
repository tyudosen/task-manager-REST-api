const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Task = require('./task')
const jwt = require('jsonwebtoken')
const sharp = require('sharp')

const schemaOptions = {
    timestamps: true
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            default: true,
            validate(value){
                if(value < 0){
                    throw new Error('Age must be a positive number')
                }

            }
        },
        email:{
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Need a valid email')
                }
            }
        },
        password:{
            type: String,
            required: true,
            trim: true,
            minlength: 7,
            validate(value){
                if(value === 'password'){throw new Error('Insecure')}
            }
        },
        tokens:[{
            token:{
                type: String,
                required: true
            }
        }],
        avatar:{
            type: Buffer
        }
    },
    schemaOptions
)

userSchema.virtual('tasks',{
    ref : 'tasks',
    localField: '_id',
    foreignField: 'author'
})

//--- hash plaintext password before saving---------------
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){ //if password feild is changed
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})
//-----------------------------------------------------

//---Delete user tasks when user is removed --------------------
userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({author: user._id});
    next();
})
//------------------------------------------------------------


//------findByCreds: find user in database by email and password ----------------------------------------
userSchema.statics.findByCreds = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){throw new Error('Unable to login')}

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){throw new Error('Unable to login')}

    return user
    
}
//------------genAuthToken: generates jsonwebtokens from user id----------------------------------------------------

userSchema.methods.genAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}

//--------------------------------------------------

userSchema.methods.toJSON = function (){
    const user = this;
    const userObj = user.toObject();
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar
    return userObj
}
const User = mongoose.model('user', userSchema)

module.exports = User
   

