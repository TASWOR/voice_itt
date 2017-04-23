var user = {
  name: "Vasya",
  age:23
}

var array = [1,2,3];

console.log(JSON.stringify(user));
console.log(JSON.stringify(array));

var obj = JSON.parse('[{"name":"Dima", "age":15},{"name":"Didasma", "age":2115}]');
console.log(obj[1].name);
