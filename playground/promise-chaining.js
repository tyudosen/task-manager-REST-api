require('../src/db/mongoose')
const User = require('../src/models/user')

//5ec23cebaf12bd7ccfd15977

const _id = '5ec2d61ffc944d90c66b6543'

// User.findByIdAndUpdate(_id, {age: 27}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age:27})
// }).then((res)=>{
//     console.log(res);
    
// }).catch((err)=>{
//     console.log(err);
    
// })

const updateAgeAndCount = async (id, age) =>{
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

const updateEmail = async (id, email) =>{
    const user = await User.findByIdAndUpdate(id,{email})
    return user;
}

updateEmail(_id,'akash@you.com').then((res)=>{
    console.log(res);
    
}).catch((err)=>{
    console.log(err);

})

// updateAgeAndCount(_id,100).then( (res)=>{
// //     console.log(res);
    
// // }).catch((err)=>{
// //     console.log(err);
    
// })