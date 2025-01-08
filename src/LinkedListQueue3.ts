import { BaseQueue } from "./interface";

interface Node<T> {
  value: T;
  next?: Node<T> | null;
}

export class LinkedListQueue2<T = any> implements BaseQueue<T> {
  #head: Node<T> | null;
  #tail: Node<T> | null;
  private length: number;

  constructor() {
    this.#head = null;
    this.#tail = null;
    this.length = 0;
  }

  get size() {
    return this.length;
  }

  enqueue(item: T) {
    const newNode: Node<T> = { value: item };

    if (this.#head) {
      this.#tail!.next = newNode;
      this.#tail = newNode;
    } else {
      this.#head = newNode;
      this.#tail = newNode;
    }

    this.length++;
  }

  dequeue() {
    if (!this.#head) return null;

    const value = this.#head.value;
    this.#head = this.#head.next!;
    if (!this.#head) {
      this.#tail = null;
    }
    this.length--;

    return value;
  }

  peek() {
    return this.#head ? this.#head.value : null;
  }

  clear() {
    this.#head = null;
    this.#tail = null;
    this.length = 0;
  }

  isEmpty() {
    return this.length === 0;
  }

  [Symbol.toStringTag]() {
    return "LinkedListQueue";
  }
}
