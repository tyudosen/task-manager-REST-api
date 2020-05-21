const express = require('express')
const path = require('path')

require('./db/mongoose.js' )
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')



const app = express()
const port = process.env.port || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


//-----------Start server -----------------

app.listen(port,()=>{
    console.log('server running on ' + port);
    
})
//-------------------------------------

// const jsonwebtoken = require('jsonwebtoken')

// const myFunc = async () =>{
//     const token = jsonwebtoken.sign({_id: 'abc123'}, 'thisIsASecret', {expiresIn: '7 days'})
//     console.log(token);

//     console.log(jsonwebtoken.verify(token, 'thisIsASecret'))
    
// }
// myFunc()