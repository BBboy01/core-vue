import { reactive, isReactive, isProxy } from '..';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observer = reactive(original);

    expect(original).not.toBe(observer);
    expect(observer.foo).toBe(1);
    expect(isReactive(observer)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isProxy(observer)).toBe(true);
    expect(isProxy(original)).toBe(false);
  });

  it('nested reactive', () => {
    const original = { nested: { foo: 1 }, array: [{ bar: 2 }] };
    const observer = reactive(original);
    expect(isReactive(observer.nested)).toBe(true);
    expect(isReactive(observer.array)).toBe(true);
    expect(isReactive(observer.array[0])).toBe(true);
  });
});
