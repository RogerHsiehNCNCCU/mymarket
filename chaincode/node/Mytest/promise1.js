/*const promise = new Promise(function(resolve, reject) {
  // 成功時
  resolve(value)
  // 失敗時
  reject(reason)
});

promise.then(function(value) {
  // on fulfillment(已實現時)
}, function(reason) {
  // on rejection(已拒絕時)
})*/

const promise1 = new Promise(function(resolveParam, rejectParam) {
    resolveParam(1)
    rejectParam(new Error('error!'))
})

promise1.then((value) => {
    console.log(value) // 1
    return value + 1
}).then((value) => {
    console.log(value) // 2
    return value + 2
}).catch((err) => console.log(err.message))

const promise2 = new Promise(function(resolve, reject) {
  resolve(1)
})

promise2.then(function(value) {
  console.log(value) // 1
  return value + 1
}).then(function(value) {
  console.log(value) // 2
  return value + 2
}).then(function(value) {
  console.log(value) // 4
})

/*直接用Promise.resolve代表這個新的Promise物件的狀態是直接設定為fulfilled(已實現)狀態，這方法只是方便產生根(第一個)Promise物件使用的，也就是除了用建構式的new Promise()外，提供另一種方式來產生新的Promise物件。下面為範例:*/
Promise.resolve("Success").then(function(value) {
  console.log(value) // "Success"
}, function(value) {
  // 不會被呼叫
})
/*Promise.reject剛好與Promise.resolve相反，等於是要產生rejected(已拒絕)狀態的新Promise物件。範例如下:*/
Promise.reject(new Error("fail")).then(function(error) {
  // 不會被呼叫
}, function(error) {
  console.log(error); // Stacktrace
});


const promise3 = new Promise(function(resolve, reject) {
  resolve(3)
})

promise3.then((value)=> {
  console.log(value) // 3
  return value + 1
}).then( (value)=> {
  console.log(value) // 4
  return value + 2
}).then( (value)=> {
  console.log(value) // 6
})
