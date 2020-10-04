/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArr = [...arr];
  if (param === 'asc') {
    return newArr.sort(compareStrings);
  } else {
    return newArr.sort(compareStrings).reverse();
  }
}

function compareStrings(str1, str2) {
  // если без учета регистра строки совпадают, то возвращаем инвертированный результат сравнения,
  // чтобы слово в верхнем регистре оказалось первым
  if (str1.toUpperCase().localeCompare(str2.toUpperCase()) === 0) {
    return str2.localeCompare(str1);
  } else {
    return str1.localeCompare(str2);
  }
}
