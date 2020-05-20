const validator = require('validator')
const mongoose = require('mongoose')

const User = mongoose.model('user', {
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
    }
})

module.exports = User
   

