export class List<T> {
  private head: ListNode<T> | null;
  private tail: ListNode<T> | null;
  private _size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  pushFront(value: T): void {
    const node: ListNode<T> = new ListNode(value);

    if (this._size === 0) {
      this.head = this.tail = node;
    } else {
      const temp = this.head;
      this.head = node;
      node.next = temp;
      temp!.prev = node;
    }

    this._size++;
  }

  popFront(): void {
    if (this._size === 0) {
      throw new Error('List is empty');
    } else if (this._size === 1) {
      this.head = this.tail = null;
    } else {
      const temp: ListNode<T> = this.head!;
      this.head = temp.next;
      temp.next!.prev = null;
      temp.next = null;
    }

    this._size--;
  }

  front(): T {
    if (this._size === 0) {
      throw new Error('List is empty');
    }

    return this.head!.value!;
  }

  back(): T {
    if (this._size === 0) {
      throw new Error('List is empty');
    }

    return this.tail!.value!;
  }

  pushBack(value: T): void {
    const node: ListNode<T> = new ListNode(value);
    const tmp: ListNode<T> | null = this.tail;

    this.head = this.head ?? node;
    this.tail = node;

    if (tmp) {
      node.prev = tmp;
      tmp.next = node;
    }

    this._size++;
  }

  popBack(): void {
    if (this._size === 0) {
      throw new Error('List is empty');
    } else if (this._size === 1) {
      this.head = this.tail = null;
    } else {
      const temp: ListNode<T> = this.tail!;
      this.tail = temp.prev;
      this.tail!.next = null;
      temp.prev = null;
    }

    this._size--;
  }

  insert(index: number, value: T): void {
    if (index < 0 || index > this._size) {
      throw new RangeError(`Index out of bounds`);
    }

    if (index === 0) {
      this.pushFront(value);
      return;
    }

    if (index === this._size) {
      this.pushBack(value);
      return;
    }

    const cur: ListNode<T> = this.getNode(index);
    const node: ListNode<T> = new ListNode(value);

    node.prev = cur.prev;
    node.next = cur;
    cur.prev!.next = node;
    cur.prev = node;
    this._size++;
  }

  erase(index: number): void {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`Index out of bounds`);
    }

    if (index === 0) {
      this.popFront();
      return;
    }

    if (index === this._size - 1) {
      this.popBack();
      return;
    }

    const cur: ListNode<T> = this.getNode(index);

    cur.prev!.next = cur.next;
    cur.next!.prev = cur.prev;
    cur.prev = cur.next = null;
    this._size--;
  }

  size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  clear(): void {
    let cur: ListNode<T> | null = this.head;

    while (true) {
      if (cur === null) break;
      const temp = cur.next;
      cur.next = null;
      cur.prev = null;
      cur = temp;
    }

    this.head = this.tail = null;
    this._size = 0;
  }

  private getNode(index: number): ListNode<T> {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`Index out of bounds`);
    }

    if (index <= (this._size >> 1)) {
      let node = this.head!;

      for (let i = 0; i < index; i++) node = node.next!;

      return node;
    } else {
      let node = this.tail!;

      for (let i = this._size - 1; i > index; i--) node = node.prev!;

      return node;
    }
  }

  at(index: number): T {
    return this.getNode(index).value;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    let cur = this.head;
    while (cur) {
      yield cur.value;
      cur = cur.next;
    }
  }

  forward(): IterableIterator<T> {
    return this[Symbol.iterator]();
  }

  *reverse(): IterableIterator<T> {
    let cur = this.tail;
    while (cur) {
      yield cur.value;
      cur = cur.prev;
    }
  }
}

class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  prev: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}
