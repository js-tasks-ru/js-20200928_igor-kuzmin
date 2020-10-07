/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arr = path.split('.');
  return function recursive(obj) {
    const nextObj = obj[arr[0]];
    if (nextObj === undefined) {
      return undefined;
    }
    if (arr.length > 1) {
      arr.shift();
      return recursive(nextObj);
    } else {
      return nextObj;
    }
  };
}
