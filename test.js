let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('done') //resolve 는 성공했을 때 호출, reject 는 실패했을 때 호출
    }, 1000)
})


promise.then((result) => {
    console.log(result)
    return result + '!!!!'
}, (error) => {
    console.log(error)
}).then((result) => {
    console.log(result)
}, (error) => {
    console.log(error)
})