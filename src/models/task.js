const validator = require('validator')
const mongooose = require('mongoose')

const Task = mongooose.model('tasks', {
    description:{
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
})

module.exports = Task