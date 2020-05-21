const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


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
        token:[{
            token:{
                type: String,
                required: true
            }
        }]
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

//------findByCreds ----------------------------------------
userSchema.statics.findByCreds = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){throw new Error('Unable to login')}

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){throw new Error('Unable to login')}

    return user
    
}

userSchema.methods.genAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisIsASecret')
    user.token = user.token.concat({token})
    await user.save()
    return token
}

//--------------------------------------------------

const User = mongoose.model('user', userSchema)

module.exports = User
   

