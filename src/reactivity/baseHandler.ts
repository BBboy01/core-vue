import { reactive, ReactiveFlags, readonly, track, trigger } from '.';
import { extend, isObject } from '../shared';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) return !isReadonly;
    if (key === ReactiveFlags.IS_READONLY) return isReadonly;

    const res = Reflect.get(target, key, receiver);

    if (shallow) {
      return res;
    }

    // if res is object, recursively call reactive
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    !isReadonly && track(target, key);
    return res;
  };
}

function createSetter(isReadonly = false) {
  return function set(target, key, newVal, receiver) {
    if (isReadonly) {
      console.warn(`you can not set a readonly property ${key} of target ${target}`);
      return true;
    }

    const res = Reflect.set(target, key, newVal, receiver);

    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, { get: shallowReadonlyGet });
