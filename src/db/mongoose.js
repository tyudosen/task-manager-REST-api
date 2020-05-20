const mongoose = require('mongoose')


const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', options)


// const tasks = mongoose.model('tasks', {
//     descrip:{
//         type: String,
//         trim: true,
//         required: true,
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })


// const task = new tasks({
//     descrip: 'Finish portfolio',
//     completed: false
// })

// task.save().then((res)=>{
//     console.log(res);
    
// }).catch((err)=>{
//     console.log(err);
    
// })
