const foo = [];

setInterval(() => {
  foo.push(Math.random().toString().padEnd(1000, 'a'));
  console.log(foo.length);
}, 1);
