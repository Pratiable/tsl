import { Vector } from '../../containers/Vector';

describe('Vector', () => {
  let vector: Vector<number>;

  beforeEach(() => {
    vector = new Vector<number>();
  });

  describe('Basic functionality', () => {
    test('Creates empty vector correctly', () => {
      expect(vector.isEmpty()).toBe(true);
      expect(vector.size()).toBe(0);
      expect(vector.capacity()).toBe(0);
    });

    test('Can add elements with pushBack()', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      vector.pushBack(3);
      expect(vector.size()).toBe(3);
      expect(vector.front()).toBe(1);
      expect(vector.back()).toBe(3);
      expect([...vector]).toEqual([1, 2, 3]);
    });

    test('Can set and get by index', () => {
      vector.pushBack(10);
      vector.pushBack(20);
      vector.set(1, 99);
      expect(vector.get(1)).toBe(99);
      expect(vector.at(1)).toBe(99);
    });

    test('Can remove last element with popBack()', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      vector.popBack();
      expect(vector.size()).toBe(1);
      expect(vector.back()).toBe(1);
    });

    test('Can clear all elements', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      const cap = vector.capacity();
      vector.clear();
      expect(vector.isEmpty()).toBe(true);
      expect(vector.size()).toBe(0);
      expect(vector.capacity()).toBe(cap);
    });

    test('toArray produces a copy', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      const arr = vector.toArray();
      expect(arr).toEqual([1, 2]);
      vector.set(0, 42);
      expect(arr).toEqual([1, 2]);
    });
  });

  describe('Capacity and resize', () => {
    test('reserve increases capacity without changing size', () => {
      vector.reserve(8);
      expect(vector.capacity()).toBeGreaterThanOrEqual(8);
      expect(vector.size()).toBe(0);
      vector.pushBack(1);
      expect(vector.capacity()).toBeGreaterThanOrEqual(8);
    });

    test('reserve smaller is no-op', () => {
      vector.reserve(8);
      const cap = vector.capacity();
      vector.reserve(4);
      expect(vector.capacity()).toBe(cap);
    });

    test('capacity grows monotonically under pushBack', () => {
      let last = vector.capacity();
      for (let i = 0; i < 64; i++) {
        vector.pushBack(i);
        expect(vector.capacity()).toBeGreaterThanOrEqual(vector.size());
        expect(vector.capacity()).toBeGreaterThanOrEqual(last);
        last = vector.capacity();
      }
      vector.shrinkToFit();
      expect(vector.capacity()).toBe(vector.size());
    });

    test('shrinkToFit reduces capacity to size', () => {
      vector.reserve(16);
      vector.pushBack(1);
      vector.pushBack(2);
      vector.shrinkToFit();
      expect(vector.capacity()).toBe(vector.size());
      expect(vector.capacity()).toBe(2);
    });

    test('resize grows and fills with given value', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      vector.resize(5, 9);
      expect(vector.size()).toBe(5);
      expect([...vector]).toEqual([1, 2, 9, 9, 9]);
    });

    test('resize shrinks and discards tail', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      vector.pushBack(3);
      vector.pushBack(4);
      vector.resize(2, 0);
      expect(vector.size()).toBe(2);
      expect([...vector]).toEqual([1, 2]);
      expect(vector.capacity()).toBeGreaterThanOrEqual(2);
    });

    test('resize to zero and same size are safe', () => {
      for (let i = 0; i < 5; i++) vector.pushBack(i);
      vector.resize(5, 7);
      expect([...vector]).toEqual([0, 1, 2, 3, 4]);
      vector.resize(0, 0);
      expect(vector.size()).toBe(0);
      expect(vector.capacity()).toBeGreaterThan(0);
    });

    test('resize to large exact value reserves correctly', () => {
      vector.resize(50, 7);
      expect(vector.size()).toBe(50);
      expect(vector.capacity()).toBeGreaterThanOrEqual(50);
      expect([...vector].slice(0, 3)).toEqual([7, 7, 7]);
    });
  });

  describe('Insert and erase', () => {
    test('Insert at beginning', () => {
      vector.pushBack(2);
      vector.pushBack(3);
      vector.insert(0, 1);
      expect([...vector]).toEqual([1, 2, 3]);
    });

    test('Insert in the middle', () => {
      vector.pushBack(1);
      vector.pushBack(3);
      vector.insert(1, 2);
      expect([...vector]).toEqual([1, 2, 3]);
    });

    test('Insert at end', () => {
      vector.pushBack(1);
      vector.insert(vector.size(), 2);
      expect([...vector]).toEqual([1, 2]);
    });

    test('Erase first element', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      vector.pushBack(3);
      vector.erase(0);
      expect([...vector]).toEqual([2, 3]);
    });

    test('Erase middle element', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      vector.pushBack(3);
      vector.erase(1);
      expect([...vector]).toEqual([1, 3]);
    });

    test('Erase last element', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      vector.erase(1);
      expect([...vector]).toEqual([1]);
    });

    test('Repeated insert at head (overlap right-shift)', () => {
      for (let i = 0; i < 200; i++) vector.insert(0, i);
      expect(vector.size()).toBe(200);
      expect(vector.front()).toBe(199);
      expect(vector.back()).toBe(0);
    });

    test('Repeated erase at head (overlap left-shift)', () => {
      for (let i = 0; i < 200; i++) vector.pushBack(i);
      for (let i = 0; i < 200; i++) vector.erase(0);
      expect(vector.size()).toBe(0);
    });

    test('Order is stable across inserts and erases', () => {
      for (let i = 0; i < 10; i++) vector.pushBack(i);
      vector.insert(5, 100);
      vector.erase(2);
      expect([...vector]).toEqual([0, 1, 3, 4, 100, 5, 6, 7, 8, 9]);
    });
  });

  describe('Iteration', () => {
    test('Iterable with for..of and spread', () => {
      for (let i = 0; i < 5; i++) vector.pushBack(i);
      const collected: number[] = [];
      for (const v of vector) collected.push(v);
      expect(collected).toEqual([0, 1, 2, 3, 4]);
      expect([...vector]).toEqual([0, 1, 2, 3, 4]);
    });

    test('Iterator sees appended elements during iteration', () => {
      vector.pushBack(1);
      vector.pushBack(2);
      const seen: number[] = [];
      for (const v of vector) {
        seen.push(v);
        if (v === 2) vector.pushBack(3);
      }
      expect(seen).toEqual([1, 2, 3]);
    });

    test('begin and end markers', () => {
      for (let i = 0; i < 3; i++) vector.pushBack(i + 1);
      expect(vector.begin()).toBe(0);
      expect(vector.end()).toBe(3);
    });
  });

  describe('Exceptions', () => {
    test('Throws when at() is out of bounds', () => {
      expect(() => vector.at(0)).toThrow('Vector: Index out of bounds');
      vector.pushBack(1);
      expect(() => vector.at(-1)).toThrow('Vector: Index out of bounds');
      expect(() => vector.at(1)).toThrow('Vector: Index out of bounds');
    });

    test('Throws when get() is out of bounds', () => {
      expect(() => vector.get(0)).toThrow();
      vector.pushBack(1);
      expect(() => vector.get(1)).toThrow();
    });

    test('Throws when set() is out of bounds', () => {
      expect(() => vector.set(0, 1)).toThrow('Vector: Index out of bounds');
    });

    test('Throws when insert() index is invalid', () => {
      expect(() => vector.insert(-1, 1)).toThrow('Vector: Index out of bounds');
      expect(() => vector.insert(1, 1)).toThrow('Vector: Index out of bounds');
    });

    test('Throws when erase() index is invalid', () => {
      expect(() => vector.erase(-1)).toThrow('Vector: Index out of bounds');
      expect(() => vector.erase(0)).toThrow('Vector: Index out of bounds');
    });

    test('Throws when front/back/popBack on empty', () => {
      expect(() => vector.front()).toThrow('Vector: Vector is empty');
      expect(() => vector.back()).toThrow('Vector: Vector is empty');
      expect(() => vector.popBack()).toThrow('Vector: Vector is empty');
    });
  });

  describe('Edge cases and validation', () => {
    test('constructor with negative, non-integer, or NaN capacity throws', () => {
      expect(() => new Vector<number>(-1)).toThrow(RangeError);
      expect(() => new Vector<number>(3.14)).toThrow(RangeError);
      expect(() => new Vector<number>(Number.NaN)).toThrow(RangeError);
    });

    test('reserve with non-integer capacity throws', () => {
      expect(() => vector.reserve(2.5)).toThrow(RangeError);
    });

    test('get on reserved but uninitialized slot throws specific message', () => {
      vector.reserve(3);
      expect(() => vector.get(2)).toThrow('Vector: Uninitialized element');
    });

    test('resize with negative size throws with message', () => {
      expect(() => vector.resize(-1, 0)).toThrow('Vector: newSize must be >= 0');
    });

    test('shrinkToFit on empty reduces capacity to 0', () => {
      vector.reserve(10);
      vector.clear();
      vector.shrinkToFit();
      expect(vector.size()).toBe(0);
      expect(vector.capacity()).toBe(0);
    });
  });

  describe('Object semantics', () => {
    test('resize with object fill reuses the same reference', () => {
      const v = new Vector<{ x: number }>();
      const obj = { x: 1 };
      v.resize(3, obj);
      const arr = [...v];
      expect(arr[0]).toBe(obj);
      expect(arr[1]).toBe(obj);
      expect(arr[2]).toBe(obj);
    });
  });

  describe('Random sequence property', () => {
    function makeRng(seed: number) {
      let x = seed >>> 0;
      return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 0x100000000);
    }

    test('Random ops match plain array semantics', () => {
      const rng = makeRng(123456);
      const ref: number[] = [];
      const ops = 800;
      for (let k = 0; k < ops; k++) {
        const r = rng();
        if (r < 0.25) {
          const x = Math.floor(rng() * 1000);
          vector.pushBack(x);
          ref.push(x);
        } else if (r < 0.5) {
          if (ref.length > 0) {
            vector.popBack();
            ref.pop();
          }
        } else if (r < 0.75) {
          const x = Math.floor(rng() * 1000);
          const idx = Math.floor(rng() * (ref.length + 1));
          vector.insert(idx, x);
          ref.splice(idx, 0, x);
        } else {
          if (ref.length > 0) {
            const idx = Math.floor(rng() * ref.length);
            vector.erase(idx);
            ref.splice(idx, 1);
          }
        }
      }
      expect([...vector]).toEqual(ref);
    });
  });
});
