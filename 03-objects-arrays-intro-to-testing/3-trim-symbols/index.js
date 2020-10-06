/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) {
    return '';
  }
  if (size === undefined) {
    return string;
  }
  let newString = '';
  let count = 1;
  let prevChar;
  for (const char of string) {
    if (char === prevChar) {
      count++;
      if (count <= size) {
        newString += char;
      }
    } else {
      count = 1;
      prevChar = char;
      newString += char;
    }
  }
  return newString;
}
