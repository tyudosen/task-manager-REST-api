const mongoose = require('mongoose')


const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}

mongoose.connect(process.env.MONGODB_URL, options)


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
