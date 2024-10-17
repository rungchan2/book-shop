async function test2() {
  console.log('test2');
  return 7 // return promise.resolve(7) 와 같음
}

test2().then((result) => {}, (error) => {});