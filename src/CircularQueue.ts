import { BaseQueue } from "./interface";

export class CircularQueue<T = any> implements BaseQueue<T> {
  private queue: Array<T>;
  private capacity: number;
  private head: number;
  private tail: number;
  private _size: number;

  constructor(capacity: number) {
    this.queue = new Array(capacity);
    this.capacity = capacity;
    this.head = 0;
    this.tail = 0;
    this._size = 0;
  }

  get size() {
    return this._size;
  }

  enqueue(item: T) {
    if (this._size === this.capacity) throw new Error("Queue is full");
    this.queue[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    this._size++;
  }

  dequeue() {
    if (this._size === 0) return null;
    const item = this.queue[this.head];
    this.head = (this.head + 1) % this.capacity;
    this._size--;
    return item;
  }

  peek() {
    if (this.head === this.tail) return null;

    return this.queue[this.head];
  }

  clear() {
    this.queue = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this._size = 0;
  }

  isEmpty() {
    return this.head === this.tail;
  }

  [Symbol.toStringTag]() {
    return "CircularQueue";
  }
}
