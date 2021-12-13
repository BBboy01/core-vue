export const extend = Object.assign;
export const hasChanged = (value1, value2) => !Object.is(value1, value2);
export const isObject = (target) => target !== null && typeof target === 'object';
