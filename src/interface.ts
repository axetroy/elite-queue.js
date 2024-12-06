export interface BaseQueue<T> {
  readonly size: number;

  enqueue(item: T): void;
  dequeue(): T | null;
  isEmpty(): boolean;
  peek(): T | null;
  clear(): void;
}
