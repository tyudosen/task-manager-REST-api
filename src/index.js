const express = require('express')
const path = require('path')


require('./db/mongoose.js' )
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')



const app = express()
const port = process.env.PORT

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


