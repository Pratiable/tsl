const PLACEHOLDER: unique symbol = Symbol('Vector.EMPTY');

type Element<T> = T | typeof PLACEHOLDER;

export class Vector<T extends {}> {
  private data: Element<T>[];
  private _size: number;
  private _capacity: number;

  constructor(initialCapacity = 0) {
    if (!Number.isFinite(initialCapacity) || !Number.isInteger(initialCapacity) || initialCapacity < 0) {
      throw new RangeError('Vector: initialCapacity must be a non-negative integer');
    }

    this._capacity = Math.max(initialCapacity, 0);
    this._size = 0;
    this.data = new Array(initialCapacity).fill(PLACEHOLDER);
  }

  public size(): number {
    return this._size;
  }

  public capacity(): number {
    return this._capacity;
  }

  public isEmpty(): boolean {
    return this._size === 0;
  }

  public at(index: number): T {
    if (index < 0 || index >= this.size()) {
      throw new RangeError('Vector: Index out of bounds');
    }

    const element = this.data[index];

    this.assertFilled(element);

    return element;
  }

  public get(index: number): T {
    const element = this.data[index];

    this.assertFilled(element);

    return element;
  }

  public set(index: number, value: T): void {
    if (index < 0 || index >= this.size()) {
      throw new RangeError('Vector: Index out of bounds');
    }

    this.data[index] = value;
  }

  public front(): T {
    if (this.isEmpty()) {
      throw new RangeError('Vector: Vector is empty');
    }

    return this.get(0);
  }

  public back(): T {
    if (this.isEmpty()) {
      throw new RangeError('Vector: Vector is empty');
    }

    return this.get(this.size() - 1);
  }

  public reserve(n: number): void {
    if (n > this.capacity()) {
      const newData = new Array(n).fill(PLACEHOLDER);
      const s = this.size();

      for (let i = 0; i < s; i++) {
        newData[i] = this.data[i];
      }

      this.data = newData;
      this._capacity = n;
    }
  }

  public shrinkToFit(): void {
    if (this.capacity() > this.size()) {
      const newData = new Array(this.size()).fill(PLACEHOLDER);
      const s = this.size();

      for (let i = 0; i < s; i++) {
        newData[i] = this.data[i];
      }

      this.data = newData;
      this._capacity = this.size();
    }
  }

  public pushBack(value: T): void {
    if (this.size() === this.capacity()) {
      this.reserve(Math.max(1, this.capacity() * 2));
    }

    this.data[this.size()] = value;
    this._size++;
  }

  public popBack(): void {
    if (this.isEmpty()) {
      throw new RangeError('Vector: Vector is empty');
    }

    this.data[this.size() - 1] = PLACEHOLDER;
    this._size--;
  }

  public insert(index: number, value: T): void {
    if (index < 0 || index > this.size()) {
      throw new RangeError('Vector: Index out of bounds');
    }

    if (this.size() === this.capacity()) {
      this.reserve(Math.max(1, this.capacity() * 2));
    }

    this.moveRange(index + 1, index, this.size());
    this._size++;
    this.data[index] = value;
  }

  public erase(index: number): void {
    if (index < 0 || index >= this.size()) {
      throw new RangeError('Vector: Index out of bounds');
    }

    this.moveRange(index, index + 1, this.size());

    this._size--;
    this.data[this.size()] = PLACEHOLDER;
  }

  public clear(): void {
    for (let i = 0; i < this.size(); i++) {
      this.data[i] = PLACEHOLDER;
    }

    this._size = 0;
  }

  public resize(newSize: number, fillValue: T): void {
    if (newSize < 0) {
      throw new RangeError('Vector: newSize must be >= 0');
    }

    if (newSize > this.size()) {
      if (newSize > this.capacity()) {
        this.reserve(newSize);
      }

      this.data.fill(fillValue, this.size(), newSize);
      this._size = newSize;
    } else if (newSize < this.size()) {
      this.data.fill(PLACEHOLDER, newSize, this.size());
      this._size = newSize;
    }
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    let idx = 0;

    while (idx < this.size()) {
      yield this.get(idx++);
    }
  }

  public toArray(): T[] {
    const newArray: T[] = new Array(this.size());

    for (let i = 0; i < this.size(); i++) {
      newArray[i] = this.get(i);
    }

    return newArray;
  }

  public begin(): number {
    return 0;
  }

  public end(): number {
    return this.size();
  }

  // @Internal
  private assertFilled<U>(e: Element<U> | undefined): asserts e is U {
    if (e === PLACEHOLDER) {
      throw new Error('Vector: Uninitialized element');
    }

    if (e === undefined) {
      throw new Error('Vector: Internal indexing error');
    }
  }

  // @Internal
  private moveRange(dst: number, src: number, srcEnd: number): void {
    const data = this.data;
    const count = srcEnd - src;

    if (dst === src || count <= 0) return;

    if (dst > src) {
      for (let i = count - 1; i >= 0; i--) {
        data[dst + i] = data[src + i] as typeof data[number];
      }
    } else if (dst < src) {
      for (let i = 0; i < count; i++) {
        data[dst + i] = data[src + i] as typeof data[number];
      }
    }
  }
}
