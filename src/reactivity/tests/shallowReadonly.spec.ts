import { isReadonly, shallowReadonly } from '..';

describe('shallowReadonly', () => {
  it('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n.foo)).toBe(false);
  });

  it('warn when set a shallowReadonly obj', () => {
    // mock a console.warn with jest.fn()
    console.warn = jest.fn();

    const user = shallowReadonly({ age: 10 });
    user.age = 11;
    expect(console.warn).toBeCalledTimes(1);
  });
});
