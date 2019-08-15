/**
 * `clamp` will clamp a number between min and max
 *
 * @param {number} min Minimum acceptable value
 * @param {number} max Maximum acceptable value
 * @param {number} num Number to cap
 * @returns {number} Final number somewhere between min and max
 */
export const clamp = (min: number, max: number, num: number): number => {
  return num < min ? min : num > max ? max : num;
};

/**
 * `find` works like `[].find()`
 *
 * @template T
 * @param {T[]} arr Array to search in
 * @param {(value: T, index: number, obj: T[]) => boolean} predicate Predicate function to find correct item
 * @returns {(T | undefined)} Found element or undefined if no element was found
 */
export const find = <T>(
  arr: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean,
): T | undefined => {
  if (Array.prototype.find) return arr.find(predicate);

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (predicate(item, i, arr)) return item;
  }

  return undefined;
};

// export { find };

/**
 * Check if an array includes given element
 *
 * @template T
 * @param {T[]} arr Array to search in
 * @param {T} searchElement Element to search for in array
 * @param {number} [fromIndex=0] Optional index to start looking from
 * @returns {boolean} Boolean indicating if element is in array or not
 */
export const includes = <T>(
  arr: T[],
  searchElement: T,
  fromIndex: number = 0,
): boolean => {
  if (Array.prototype.includes) return arr.includes(searchElement);

  for (let i = fromIndex; i < arr.length; i++) {
    if (arr[i] === searchElement) return true;
  }

  return false;
};

/**
 * Check if any value is an array
 *
 * @param {*} value
 * @returns {value is Array<any>} Boolean indicating if value is array or not
 */
export const isArray = (value: any): value is Array<any> => {
  if (Array.isArray) return Array.isArray(value);
  return Object.prototype.toString.call(value) === '[object Array]';
};

/**
 * Convert an array like element into an array
 *
 * @template T
 * @param {ArrayLike<T>} arrayLike Array like value
 * @returns {T[]} Returns an array with the contents of the array like item
 */
export const from = <T>(arrayLike: ArrayLike<T>): T[] => {
  if (Array.from) return Array.from(arrayLike);

  const newArray = [];
  for (let i = 0; i < arrayLike.length; i++) {
    newArray.push(arrayLike[i]);
  }

  return newArray;
};
