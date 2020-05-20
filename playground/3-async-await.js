// const doWork = async (flag)=>{
//     if(flag === 1){return 'Toyo'}
//     throw new Error('Error')
// }

const add = (a, b) =>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if(a < 0 || b < 0){return reject('must be greater than 0')}
            resolve(a+b)

        },2000)
    })
}

const doWork = async ()=>{
    const sum = await add(1,1)
    const sum2 = await add(sum,-1)
    return sum2
}



doWork().then((res)=>{
    console.log(res);
    
}).catch((err)=>[
    console.log(err)
    
])
