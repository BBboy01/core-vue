import { isTracking, reactive, trackEffects, triggerEffects } from '.';
import { hasChanged, isObject } from '../shared';

class RefImpl {
  private _value: any;
  private _rawValue: any;
  deps;
  __v_isRef = true;

  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.deps = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    // do nothing if passed a same value
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = convert(newVal);
      // trigger effects after the change of original value
      triggerEffects(this.deps);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
  isTracking() && trackEffects(ref.deps);
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRef(ref) {
  return new Proxy(ref, {
    get(target, key, receiver) {
      return unRef(Reflect.get(target, key, receiver));
    },

    set(target, key, value, receiver) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    },
  });
}
