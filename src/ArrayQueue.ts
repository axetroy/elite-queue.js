import { BaseQueue } from "./interface";

export class ArrayQueue<T = any> implements BaseQueue<T> {
  private queue: Array<T> = [];

  get size() {
    return this.queue.length;
  }

  enqueue(item: T) {
    this.queue.push(item);
  }

  dequeue() {
    const value = this.queue.shift();

    return value ?? null;
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }

    return this.queue[0];
  }

  clear() {
    this.queue = [];
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  [Symbol.toStringTag]() {
    return "ArrayQueue";
  }
}
