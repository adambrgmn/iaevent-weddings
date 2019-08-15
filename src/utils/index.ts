export const cap = (min: number, max: number, num: number): number => {
  return num < min ? min : num > max ? max : num;
};
