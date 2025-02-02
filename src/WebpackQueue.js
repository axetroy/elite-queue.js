// https://github.com/webpack/webpack/pull/19040

/**
 * @template T
 */
class Node {
  /**
   * @param {T} value the value
   */
  constructor(value) {
    this.value = value;
    /** @type {Node<T> | undefined} */
    this.next = undefined;
  }
}

/**
 * @template T
 */
export class WebpackQueue {
  constructor() {
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
  }

  /**
@@ -35,50 +34,18 @@ class Queue {
	 * @returns {void}
	 */
  enqueue(item) {
    const node = new Node(item);

    if (this._head) {
      /** @type {Node<T>} */
      this._tail.next = node;
      this._tail = node;
    } else {
      this._head = node;
      this._tail = node;
    }

    this._size++;
  }

  /**
   * Retrieves and removes the head of this queue.
   * @returns {T | undefined} The head of the queue of `undefined` if this queue is empty.
   */
  dequeue() {
    const current = this._head;
    if (!current) {
      return null;
    }

    this._head = this._head.next;
    this._size--;
    return current.value;
  }

  /**
   * Returns the number of elements in this queue.
   * @returns {number} The number of elements in this queue.
   */
  get length() {
    return this._size;
  }

  *[Symbol.iterator]() {
    let current = this._head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
