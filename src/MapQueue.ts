import { BaseQueue } from "./interface";

export class MapQueue<T = any> implements BaseQueue<T> {
  private map = new Map<number, T>();
  private head: number = 0; // 头指针，指向队列头部
  private tail: number = 0; // 尾指针，指向队列尾部

  get size() {
    return this.tail - this.head; // 队列的大小
  }

  enqueue(item: T) {
    this.map.set(this.tail, item); // 将元素存入尾部
    this.tail++; // 尾部指针后移
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const item = this.map.get(this.head); // 取出头部元素
    this.map.delete(this.head); // 删除头部元素
    this.head++; // 头部指针后移
    return item ?? null;
  }

  peek() {
    return this.isEmpty() ? null : this.map.get(this.head) ?? null; // 查看队头
  }

  clear() {
    this.map.clear();
    this.head = 0;
    this.tail = 0;
  }

  isEmpty() {
    return this.size === 0;
  }

  [Symbol.toStringTag]() {
    return "MapQueue";
  }
}
