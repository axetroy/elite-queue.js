import { describe, beforeEach, test } from "node:test";
import assert from "node:assert";
import { SetQueue } from "../src/SetQueue";
import { ArrayQueue } from "../src/ArrayQueue";
import { DequeQueue } from "../src/DequeQueue";
import { MapQueue } from "../src/MapQueue";
import { CircularQueue } from "../src/CircularQueue";
import { LinkedListQueue } from "../src/LinkedListQueue";
import { BaseQueue } from "../src/interface";

const queueFactories = [
  SetQueue,
  MapQueue,
  ArrayQueue,
  DequeQueue,
  CircularQueue,
  LinkedListQueue,
];

for (const Factory of queueFactories) {
  describe(Factory.name, () => {
    let queue: BaseQueue<any>;

    beforeEach(() => {
      queue = new Factory(100);
    });

    test("should initialize an empty queue", () => {
      assert.deepStrictEqual(queue.size, 0);
      assert(queue.isEmpty());
    });

    test("should enqueue elements", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      assert.strictEqual(queue.size, 3);
      assert.strictEqual(queue.peek(), 1);
      assert.strictEqual(queue.isEmpty(), false);
    });

    test("should dequeue elements in FIFO order", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      assert.strictEqual(queue.dequeue(), 1);
      assert.strictEqual(queue.dequeue(), 2);
      assert.strictEqual(queue.size, 1);
      assert.strictEqual(queue.peek(), 3);
      assert.strictEqual(queue.dequeue(), 3);
      assert.strictEqual(queue.isEmpty(), true);
    });

    test("should handle dequeue on an empty queue", () => {
      assert.strictEqual(queue.dequeue(), null);
      assert.strictEqual(queue.size, 0);
      assert.strictEqual(queue.isEmpty(), true);
    });

    test("should handle peek on an empty queue", () => {
      assert.strictEqual(queue.peek(), null);
    });

    if (Factory === SetQueue) {
      test("should not allow duplicate elements (only SetQueue)", () => {
        queue.enqueue(1);
        queue.enqueue(1); // 重复元素
        queue.enqueue(2);

        assert.strictEqual(queue.size, 2); // 集合自动去重
        assert.strictEqual(queue.peek(), 1);
        assert.strictEqual(queue.dequeue(), 1);
        assert.strictEqual(queue.dequeue(), 2);
        assert.strictEqual(queue.isEmpty(), true);
      });
    }

    test("should handle a mix of enqueue and dequeue operations", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      assert.strictEqual(queue.dequeue(), 1);

      queue.enqueue(3);
      assert.strictEqual(queue.peek(), 2);

      queue.enqueue(4);
      assert.strictEqual(queue.size, 3);

      assert.strictEqual(queue.dequeue(), 2);
      assert.strictEqual(queue.dequeue(), 3);
      assert.strictEqual(queue.dequeue(), 4);
      assert.strictEqual(queue.isEmpty(), true);
    });

    test("should maintain order after many operations", () => {
      const elements = Array.from({ length: 100 }, (_, i) => i + 1);

      // 入队所有元素
      elements.forEach((el) => queue.enqueue(el));
      assert.strictEqual(queue.size, 100);

      // 按顺序出队
      elements.forEach((el) => {
        assert.strictEqual(queue.dequeue(), el);
      });

      assert.strictEqual(queue.size, 0);
      assert.strictEqual(queue.isEmpty(), true);
    });

    test("should work with different data types", () => {
      queue.enqueue(1);
      queue.enqueue("string");
      queue.enqueue({ key: "value" });

      assert.strictEqual(queue.size, 3);
      assert.strictEqual(queue.dequeue(), 1);
      assert.strictEqual(queue.dequeue(), "string");
      assert.deepStrictEqual(queue.dequeue(), { key: "value" });
      assert.strictEqual(queue.isEmpty(), true);
    });

    test("should correctly report size after enqueue and dequeue", () => {
      assert.strictEqual(queue.size, 0);
      queue.enqueue(1);
      assert.strictEqual(queue.size, 1);
      queue.enqueue(2);
      assert.strictEqual(queue.size, 2);
      queue.dequeue();
      assert.strictEqual(queue.size, 1);
      queue.dequeue();
      assert.strictEqual(queue.size, 0);
    });
  });
}
