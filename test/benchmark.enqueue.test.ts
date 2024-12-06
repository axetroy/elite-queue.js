import { describe, beforeEach, test, after } from "node:test";
import fs from "node:fs";
import { SetQueue } from "../src/SetQueue";
import { ArrayQueue } from "../src/ArrayQueue";
import { DequeQueue } from "../src/DequeQueue";
import { MapQueue } from "../src/MapQueue";
import { CircularQueue } from "../src/CircularQueue";
import { LinkedListQueue } from "../src/LinkedListQueue";
import { drawGroupedBarChart } from "./generateChart";

const queueFactories = [
  SetQueue,
  MapQueue,
  ArrayQueue,
  DequeQueue,
  CircularQueue,
  LinkedListQueue,
];

const resultMap = new Map<string, Array<{ name: string; avg: number }>>();

const groupLabels = ["1e1", "1e2", "1e3", "1e4", "1e5", "1e6"];
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
      chartTitle: "Enqueue Benchmark",
    }
  );

  fs.writeFileSync("benchmark.enqueue.svg", output);
});

for (const Factory of queueFactories) {
  describe("Benchmark: " + Factory.name, () => {
    test(`${Factory.name}#enqueue()`, () => {
      const iterations = groupLabels.map((v) => Number(v));

      for (const iteration of iterations) {
        const diffArray: number[] = [];

        // 重复 100 次取平均值
        for (let t = 0; t < 100; t++) {
          // 准备数据
          const queue = new Factory(iteration + 1);
          for (let i = 0; i < iteration; i++) {
            queue.enqueue(i);
          }

          const t1 = performance.now(); // ms

          queue.enqueue(0);

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
