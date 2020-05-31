const validator = require('validator')
const mongooose = require('mongoose')

const schemaOptions = {
    timestamps: true
}
const taskSchema = new mongooose.Schema({
    description:{
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    author: {
        type: mongooose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
}, schemaOptions)

const Task = mongooose.model('tasks', taskSchema)
module.exports = Task