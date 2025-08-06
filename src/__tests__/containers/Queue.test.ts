import { Queue } from '../../containers/Queue';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  describe('Basic functionality', () => {
    test('Creates empty queue correctly', () => {
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    test('Can add element with push()', () => {
      queue.push(1);
      queue.push(2);

      expect(queue.size()).toBe(2);
      expect(queue.isEmpty()).toBe(false);
      expect(queue.front()).toBe(1);
      expect(queue.back()).toBe(2);
    });

    test('Can remove first element with pop()', () => {
      queue.push(1);
      queue.push(2);
      queue.push(3);

      queue.pop();

      expect(queue.size()).toBe(2);
      expect(queue.front()).toBe(2);
      expect(queue.back()).toBe(3);
    });

    test('FIFO order is maintained correctly', () => {
      queue.push(10);
      queue.push(20);
      queue.push(30);

      expect(queue.front()).toBe(10);
      queue.pop();

      expect(queue.front()).toBe(20);
      queue.pop();

      expect(queue.front()).toBe(30);
      queue.pop();

      expect(queue.isEmpty()).toBe(true);
    });

    test('Can access front and back elements', () => {
      queue.push(100);
      expect(queue.front()).toBe(100);
      expect(queue.back()).toBe(100);

      queue.push(200);
      expect(queue.front()).toBe(100);
      expect(queue.back()).toBe(200);
    });
  });

  describe('Exceptions', () => {
    test('Throws error when calling front() on empty queue', () => {
      expect(() => queue.front()).toThrow('Queue is empty');
    });

    test('Throws error when calling back() on empty queue', () => {
      expect(() => queue.back()).toThrow('Queue is empty');
    });

    test('Throws error when calling pop() on empty queue', () => {
      expect(() => queue.pop()).toThrow('Queue is empty');
    });
  });

  describe('Edge cases', () => {
    test('Single element operations work correctly', () => {
      queue.push(42);

      expect(queue.size()).toBe(1);
      expect(queue.front()).toBe(42);
      expect(queue.back()).toBe(42);

      queue.pop();
      expect(queue.isEmpty()).toBe(true);
    });

    test('Multiple push and pop operations', () => {
      queue.push(1);
      queue.push(2);
      queue.pop();

      queue.push(3);
      expect(queue.front()).toBe(2);
      expect(queue.back()).toBe(3);
      expect(queue.size()).toBe(2);
    });
  });
});
