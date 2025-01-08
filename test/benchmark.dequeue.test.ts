import { describe, test, after } from "node:test";
import fs from "node:fs";
import { SetQueue } from "../src/SetQueue";
import { ArrayQueue } from "../src/ArrayQueue";
import { DequeQueue } from "../src/DequeQueue";
import { MapQueue } from "../src/MapQueue";
import { CircularQueue } from "../src/CircularQueue";
import { LinkedListQueue } from "../src/LinkedListQueue";
import { LinkedListQueue2 } from "../src/LinkedListQueue2";
import { WebpackQueue } from "../src/WebpackQueue";
import { WebpackQueue2 } from "../src/WebpackQueue2";
import { drawGroupedBarChart } from "./generateChart";
import YoctoQueue from "yocto-queue";

Object.defineProperty(YoctoQueue, "name", {
  value: "YoctoQueue",
});

const queueFactories = [
  SetQueue,
  MapQueue,
  ArrayQueue,
  DequeQueue,
  CircularQueue,
  LinkedListQueue,
  LinkedListQueue2,
  WebpackQueue,
  WebpackQueue2,
  YoctoQueue,
];

const resultMap = new Map<string, Array<{ name: string; avg: number }>>();

const groupLabels = ["1e1", "1e2", "1e3", "1e4", "1e5"];
const categoryLabels = queueFactories.map((v) => v.name);

after(() => {
  const output = drawGroupedBarChart(
    Array.from(resultMap).map(([iteration, result]) => {
      return result.map((v) => v.avg);
    }),
    groupLabels,
    categoryLabels,
    800,
    600,
    {
      chartTitle: "Dequeue Benchmark",
    }
  );

  fs.writeFileSync("benchmark.dequeue.svg", output);
});

for (const Factory of queueFactories) {
  describe("Benchmark: " + Factory.name, () => {
    test(`${Factory.name}#dequeue()`, () => {
      const iterations = groupLabels.map((v) => Number(v));

      for (const iteration of iterations) {
        const diffArray: number[] = [];

        // 重复 100 次取平均值
        for (let t = 0; t < 100; t++) {
          // 准备数据
          const queue =
            Factory === WebpackQueue2
              ? new Factory([])
              : // @ts-expect-error ignore
                new Factory(iteration + 1);

          // 代码预热
          queue.enqueue(0);
          queue.dequeue();

          for (let i = 0; i < iteration; i++) {
            queue.enqueue(i);
          }

          const t1 = performance.now(); // ms

          queue.dequeue();

          const t2 = performance.now(); // ms

          const diff = (t2 - t1) * 1e6; // ns

          diffArray.push(diff);
        }

        const avg = diffArray.reduce((a, b) => a + b, 0) / diffArray.length;

        const results = resultMap.get(iteration.toString());

        const data = {
          name: Factory.name,
          avg: Number(avg.toFixed(2)),
        };

        if (results) {
          results.push(data);
        } else {
          resultMap.set(iteration.toString(), [data]);
        }
      }
    });
  });
}
