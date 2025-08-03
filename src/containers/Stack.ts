export class Stack<T> {
  private readonly data: T[] = [];

  push(value: T): void {
    this.data.push(value);
  }

  pop(): void {
    if (this.data.length === 0) {
      throw new Error('Stack is empty');
    }

    this.data.pop();
  }

  top(): T {
    if (this.data.length === 0) {
      throw new Error('Stack is empty');
    }

    return this.data.at(-1)!;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  size(): number {
    return this.data.length;
  }

  clear(): void {
    this.data.length = 0;
  }
}
