export class Queue<T> {
  private readonly data: T[] = [];

  push(value: T): void {
    this.data.push(value);
  }

  pop(): void {
    if (this.data.length === 0) {
      throw new Error('Queue is empty');
    }

    this.data.shift();
  }

  front(): T {
    if (this.data.length === 0) {
      throw new Error('Queue is empty');
    }

    return this.data.at(0)!;
  }

  back(): T {
    if (this.data.length === 0) {
      throw new Error('Queue is empty');
    }

    return this.data.at(-1)!;
  }

  size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  // TODO: swap
}
