import { extend } from '../shared';

const targetMap = new Map();
let shouldTrack;
let activeEffect;

class ReactiveEffect {
  scheduler: Function | undefined;
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;

  constructor(fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    // whether collect deps depend on shouldTrack
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const res = this._fn();
    shouldTrack = false;

    return res;
  }

  stop() {
    if (this.active) {
      cleanUpEffect(this);
      this.active = false;
    }
  }
}

function cleanUpEffect(effect) {
  effect.onStop && effect.onStop();
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

export function track(target, key) {
  if (!isTracking()) return;
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  trackEffects(deps);
}

export function trackEffects(deps) {
  if (deps.has(activeEffect)) return;
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

export function isTracking() {
  return activeEffect && shouldTrack;
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);

  triggerEffects(deps);
}

export function triggerEffects(deps) {
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // add options
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
