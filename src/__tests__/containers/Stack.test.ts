import { Stack } from '../../containers/Stack';

describe('Stack', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  describe('Basic functionality', () => {
    test('Creates empty stack correctly', () => {
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });

    test('Can add element with push()', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.size()).toBe(2);
      expect(stack.isEmpty()).toBe(false);
      expect(stack.top()).toBe(2);
    });

    test('Can remove last element with pop()', () => {
      stack.push(1);
      stack.push(2);
      stack.pop();

      expect(stack.size()).toBe(1);
      expect(stack.top()).toBe(1);
    });

    test('Can remove all elements with clear()', () => {
      stack.push(1);
      stack.push(2);
      stack.clear();

      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });
  });

  describe('Exceptions', () => {
    test('Throws error when calling top() on empty stack', () => {
      expect(() => stack.top()).toThrow('Stack is empty');
    });

    test('Throws error when calling pop() on empty stack', () => {
      expect(() => stack.pop()).toThrow('Stack is empty');
    });
  });
});
