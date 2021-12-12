import { readonly, isReadonly, isProxy } from '..';

describe('readonly', () => {
  it('happy path', () => {
    // not set
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isReadonly(original)).toBe(false);
    expect(isReadonly(original.bar)).toBe(false);
    expect(isProxy(wrapped)).toBe(true);
    expect(isProxy(original)).toBe(false);
    expect(wrapped.foo).toBe(1);
  });

  it('warn when set a readonly obj', () => {
    // mock a console.warn with jest.fn()
    console.warn = jest.fn();

    const user = readonly({ age: 10 });
    user.age = 11;
    expect(console.warn).toBeCalledTimes(1);
  });
});
