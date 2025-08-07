import { List } from '../../containers/List';

class TestableList<T> extends List<T> {
  public toArrayReverse(): T[] {
    const result: T[] = [];
    let cur = this.tail;
    while (cur) {
      result.push(cur.value);
      cur = cur.prev;
    }
    return result;
  }
}

describe('List', () => {
  let list: TestableList<number>;

  beforeEach(() => {
    list = new TestableList<number>();
  });

  describe('Basic functionality', () => {
    test('Creates empty list correctly', () => {
      expect(list.isEmpty()).toBe(true);
      expect(list.size()).toBe(0);
    });

    test('Can add element with pushFront()', () => {
      list.pushFront(1);
      list.pushFront(2);

      expect(list.size()).toBe(2);
      expect(list.isEmpty()).toBe(false);
      expect(list.front()).toBe(2);
      expect(list.back()).toBe(1);
    });

    test('Can add element with pushBack()', () => {
      list.pushBack(1);
      list.pushBack(2);

      expect(list.size()).toBe(2);
      expect(list.isEmpty()).toBe(false);
      expect(list.front()).toBe(1);
      expect(list.back()).toBe(2);
    });

    test('Can remove element with popFront()', () => {
      list.pushBack(1);
      list.pushBack(2);
      list.pushBack(3);

      list.popFront();

      expect(list.size()).toBe(2);
      expect(list.front()).toBe(2);
      expect(list.back()).toBe(3);
    });

    test('Can remove element with popBack()', () => {
      list.pushBack(1);
      list.pushBack(2);
      list.pushBack(3);

      list.popBack();

      expect(list.size()).toBe(2);
      expect(list.front()).toBe(1);
      expect(list.back()).toBe(2);
    });

    test('Can mix front and back operations', () => {
      list.pushBack(2);
      list.pushFront(1);
      list.pushBack(3);
      list.pushFront(0);

      expect(list.size()).toBe(4);
      expect(list.front()).toBe(0);
      expect(list.back()).toBe(3);

      list.popFront();
      list.popBack();

      expect(list.size()).toBe(2);
      expect(list.front()).toBe(1);
      expect(list.back()).toBe(2);
    });

    test('Can clear all elements', () => {
      list.pushBack(1);
      list.pushBack(2);
      list.pushBack(3);

      list.clear();

      expect(list.isEmpty()).toBe(true);
      expect(list.size()).toBe(0);
    });

    test('Can insert at specific index with full verification', () => {
      list.pushBack(1);
      list.pushBack(3);
      list.pushBack(5);

      list.insert(1, 2);
      list.insert(3, 4);

      expect(list.size()).toBe(5);

      expect([...list]).toEqual([1, 2, 3, 4, 5]);
    });

    test('Can insert at beginning and end with verification', () => {
      list.pushBack(3);

      list.insert(0, 1);
      list.insert(1, 2);
      list.insert(3, 4);

      expect(list.size()).toBe(4);

      expect([...list]).toEqual([1, 2, 3, 4]);
    });

    test('Can erase at specific index with full verification', () => {
      list.pushBack(1);
      list.pushBack(2);
      list.pushBack(3);
      list.pushBack(4);
      list.pushBack(5);

      list.erase(2);
      list.erase(0);
      list.erase(2);

      expect(list.size()).toBe(2);

      expect([...list]).toEqual([2, 4]);
    });

    test('Complex insert and erase operations', () => {
      list.pushBack(10);
      list.insert(0, 5);
      list.insert(2, 15);
      list.insert(1, 7);

      expect([...list]).toEqual([5, 7, 10, 15]);

      list.erase(1);
      list.erase(0);

      expect([...list]).toEqual([10, 15]);
      expect(list.size()).toBe(2);
      expect(list.front()).toBe(10);
      expect(list.back()).toBe(15);
    });
  });

  describe('Exceptions', () => {
    test('Throws error when calling front() on empty list', () => {
      expect(() => list.front()).toThrow('List is empty');
    });

    test('Throws error when calling back() on empty list', () => {
      expect(() => list.back()).toThrow('List is empty');
    });

    test('Throws error when calling popFront() on empty list', () => {
      expect(() => list.popFront()).toThrow('List is empty');
    });

    test('Throws error when calling popBack() on empty list', () => {
      expect(() => list.popBack()).toThrow('List is empty');
    });

    test('Throws error when inserting at invalid index', () => {
      list.pushBack(1);

      expect(() => list.insert(-1, 99)).toThrow('Index out of bounds');
      expect(() => list.insert(2, 99)).toThrow('Index out of bounds');
    });

    test('Throws error when erasing at invalid index', () => {
      list.pushBack(1);

      expect(() => list.erase(-1)).toThrow('Index out of bounds');
      expect(() => list.erase(1)).toThrow('Index out of bounds');
    });

    test('Insert and erase maintain bidirectional links', () => {
      list.pushBack(1);
      list.pushBack(2);
      list.pushBack(3);

      list.insert(1, 99);
      expect([...list]).toEqual([1, 99, 2, 3]);

      list.erase(1);
      expect([...list]).toEqual([1, 2, 3]);

      expect(list.front()).toBe(1);
      expect(list.back()).toBe(3);

      list.popFront();
      list.popBack();
      expect([...list]).toEqual([2]);
    });
  });

  describe('Edge cases', () => {
    test('Single element operations work correctly', () => {
      list.pushBack(42);

      expect(list.size()).toBe(1);
      expect(list.front()).toBe(42);
      expect(list.back()).toBe(42);

      list.popFront();
      expect(list.isEmpty()).toBe(true);
    });

    test('Single element with popBack() works correctly', () => {
      list.pushFront(99);

      expect(list.size()).toBe(1);
      expect(list.front()).toBe(99);
      expect(list.back()).toBe(99);

      list.popBack();
      expect(list.isEmpty()).toBe(true);
    });

    test('Alternating operations maintain integrity', () => {
      list.pushBack(1);
      list.pushFront(0);
      list.popBack();
      list.pushBack(2);
      list.popFront();

      expect(list.size()).toBe(1);
      expect(list.front()).toBe(2);
      expect(list.back()).toBe(2);
    });

    test('Multiple elements with same value', () => {
      list.pushBack(5);
      list.pushBack(5);
      list.pushFront(5);

      expect(list.size()).toBe(3);
      expect(list.front()).toBe(5);
      expect(list.back()).toBe(5);

      list.popFront();
      expect(list.size()).toBe(2);
      expect(list.front()).toBe(5);
    });

    test('insert into an empty list', () => {
      list.insert(0, 100);
      expect(list.size()).toBe(1);
      expect(list.front()).toBe(100);
      expect(list.back()).toBe(100);
    });

    test('erase the only element in the list', () => {
      list.pushBack(42);
      list.erase(0);
      expect(list.isEmpty()).toBe(true);
    });

    test('handles a larger number of elements correctly', () => {
      const count = 100;
      for (let i = 0; i < count; i++) {
        list.pushBack(i);
      }
      expect(list.size()).toBe(count);
      expect(list.front()).toBe(0);
      expect(list.back()).toBe(99);

      for (let i = 0; i < count; i++) {
        list.popFront();
      }
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('Bidirectional integrity', () => {
    test('Forward and backward links are maintained correctly', () => {
      list.pushBack(1);
      list.pushBack(2);
      list.pushBack(3);

      list.popFront();
      expect(list.front()).toBe(2);
      expect(list.back()).toBe(3);

      list.popBack();
      expect(list.front()).toBe(2);
      expect(list.back()).toBe(2);

      list.popFront();
      expect(list.isEmpty()).toBe(true);
    });

    test('reverse links are maintained correctly after operations', () => {
      list.pushBack(10);
      list.pushBack(20);
      list.insert(1, 15);
      list.pushFront(5);

      expect([...list]).toEqual([5, 10, 15, 20]);

      expect(list.toArrayReverse()).toEqual([20, 15, 10, 5]);

      list.erase(1);
      list.popBack();

      expect([...list]).toEqual([5, 15]);
      expect(list.toArrayReverse()).toEqual([15, 5]);
    });
  });
});
