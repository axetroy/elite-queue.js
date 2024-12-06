import { BaseQueue } from "./interface";

export class DequeQueue<T = any> implements BaseQueue<T> {
  private queue: { [key: number]: T };
  private head: number;
  private tail: number;

  constructor() {
    this.queue = {};
    this.head = 0;
    this.tail = 0;
  }

  get size() {
    return this.tail - this.head;
  }

  enqueue(item: T) {
    this.queue[this.tail] = item;
    this.tail++;
  }

  dequeue() {
    if (this.head === this.tail) return null;
    const item = this.queue[this.head];
    delete this.queue[this.head];
    this.head++;
    return item;
  }

  peek() {
    if (this.head === this.tail) return null;

    return this.queue[this.head];
  }

  clear() {
    this.queue = {};
    this.head = 0;
    this.tail = 0;
  }

  isEmpty() {
    return this.head === this.tail;
  }

  [Symbol.toStringTag]() {
    return "DequeQueue";
  }
}
