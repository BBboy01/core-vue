import { isTracking, reactive, trackEffects, triggerEffects } from '.';
import { hasChanged, isObject } from '../shared';

class RefImpl {
  private _value: any;
  private _rawValue: any;
  deps;

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
