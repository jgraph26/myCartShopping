let array = [5, 6, 7, 8, 9, 10, 11, 12];

// let matrix = [
//   [1, 2, 3, 4, 5, 6, 7],
//   [5, 6, 7, 8, 9, 10, 11, 12],
// ];

// let dobles = array.map((array) => {
//   return array * 2;
// });

// console.log(dobles);

// // let pares = array.filter((array) => {
// //   return array > 5;
// // });

// console.log(pares);

// let suma = matrix.flat().reduce((suma, n) => {
//   return suma + n;
// });
// let max = Math.max(...matrix.flat());

let maxi = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < arr[i + 1]) {
      const fijo = arr[i];
      arr[i] = arr[i + 1];
      arr[i + 1] = fijo;
    }
    let maximo = arr[0];
    return maximo;
  }
};

let result = maxi(array);
console.log(result);
