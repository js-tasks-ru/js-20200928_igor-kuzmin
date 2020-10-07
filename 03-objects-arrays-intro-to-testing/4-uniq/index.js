/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  let newArray = [];
  if (arr !== undefined) {
    arr.forEach(value => {
      if (!newArray.includes(value)) {
        newArray.push(value);
      }
    });
  }
  return newArray;
}
