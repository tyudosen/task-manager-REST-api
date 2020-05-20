require('../src/db/mongoose')
const Task = require('../src/models/task')

const _id = '5ec3dcd248ed9c394ed9db94'
// Task.findByIdAndDelete(_id).then((task)=>{
//     console.log(task);
//     return Task.countDocuments({completed: false})
    
// }).then((res)=>{
//     console.log(res);
    
// }).catch((err)=>{
//     console.log(err);
    
// })

const deleteTaskAndCount = async (id)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({})
    return count
}

deleteTaskAndCount(_id).then((res)=>{
    console.log(res);
    
}).catch((err)=>{
    console.log(err);
    
})