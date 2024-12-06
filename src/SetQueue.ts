import { BaseQueue } from "./interface";

export class SetQueue<T = any> implements BaseQueue<T> {
  private set = new Set<T>();

  get size() {
    return this.set.size;
  }

  enqueue(item: T) {
    this.set.add(item);
  }

  dequeue() {
    const iterator = this.set.values(); // 创建迭代器
    const firstItem = iterator.next().value; // 获取第一个元素

    if (firstItem !== undefined) {
      this.set.delete(firstItem); // 删除第一个元素
    }

    return firstItem ?? null;
  }

  peek() {
    return this.set.values().next().value ?? null; // 查看第一个元素
  }

  clear() {
    this.set.clear();
  }

  isEmpty() {
    return this.set.size === 0;
  }

  [Symbol.toStringTag]() {
    return "SetQueue";
  }
}
