export const cap = (min: number, max: number, num: number): number => {
  return num < min ? min : num > max ? max : num;
};

export const find = <T>(
  arr: T[],
  cond: (item: T) => boolean,
): T | undefined => {
  if (Array.prototype.find) return arr.find(cond);

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (cond(item)) return item;
  }

  return undefined;
};

export const includes = <T>(arr: T[], item: any): boolean => {
  if (Array.prototype.includes) return arr.includes(item);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === item) return true;
  }

  return false;
};

export const isArray = (value: any): value is Array<any> => {
  if (Array.isArray) return Array.isArray(value);
  return Object.prototype.toString.call(value) === '[object Array]';
};

export const from = <T>(arrayLike: ArrayLike<T>): T[] => {
  if (Array.from) return Array.from(arrayLike);

  const newArray = [];
  for (let i = 0; i < arrayLike.length; i++) {
    newArray.push(arrayLike[i]);
  }

  return newArray;
};
