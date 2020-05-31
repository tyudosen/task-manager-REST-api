const express = require('express')
const path = require('path')


require('./db/mongoose.js' )
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')



const app = express()
const port = process.env.port || 3000

//--Register middleware function ----


// //----maintainace mode middleware -----
// app.use((req,res,next)=>{
//     res.status(503).send('Site under maintainance')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


//-----------Start server -----------------

app.listen(port,()=>{
    console.log('server running on ' + port);
    
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const Main = async () => { 
//     // const task = await Task.findById('5ed3d4381e63f52c91a6adbb');
//     // await task.populate('author').execPopulate();
//     // console.log(task.author);

//     const user = await User.findById('5ecd851cf555938f1d9d9cbc');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
      
//  }

// Main()