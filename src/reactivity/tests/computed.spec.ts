import { reactive, computed } from '..';

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({ age: 1 });

    const age = computed(() => user.age);

    expect(age.value).toBe(1);
  });

  it('should compute lazily', () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => value.foo);
    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not be called again
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compte until needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not run again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
