import * as d3 from "d3";
import { JSDOM } from "jsdom";

/**
 * 绘制分组条形图
 * @param {Array<Array<number>>} data 数据
 * @param {number} width 图表宽度
 * @param {number} height 图表高度
 * @returns {string} SVG 字符串
 */
function drawGroupedBarChart(
  data: Array<Array<number>>,
  groupLabels: Array<string>,
  categoryLabels: Array<string>,
  width: number,
  height: number,
  { chartTitle, backgroundColor = "white" }
) {
  const { document } = new JSDOM("<!DOCTYPE html><html><body></body></html>")
    .window;

  const margin = { top: 40, right: 120, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // 创建 SVG 容器
  const svg = d3
    .select(document.body)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
    .style("background-color", backgroundColor)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 设置主分组 x 轴比例尺
  const x0 = d3
    .scaleBand()
    .domain(data.map((_, i) => i)) // 每个主分组的索引
    .range([0, innerWidth])
    .padding(0.1);

  // 设置子分组比例尺
  const x1 = d3
    .scaleBand()
    .domain(d3.range(data[0].length)) // 每个子分组的索引
    .range([0, x0.bandwidth()])
    .padding(0.05);

  // 设置 y 轴比例尺
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data.flat())]) // 数据范围
    .nice()
    .range([innerHeight, 0]);

  // 颜色比例尺
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(categoryLabels);

  // 绘制条形
  const group = svg
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", (_, i) => `translate(${x0(i)},0)`); // 每个主分组的位置

  group
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (_, i) => x1(i)) // 子分组位置
    .attr("y", (d) => y(d)) // 高度
    .attr("width", x1.bandwidth()) // 子分组宽度
    .attr("height", (d) => innerHeight - y(d)) // 条形高度
    .attr("fill", (_, i) => color(categoryLabels[i])); // 颜色

  // 添加柱状标注
  // group
  //   .selectAll("text")
  //   .data((d) => d)
  //   .enter()
  //   .append("text")
  //   .text((d) => d) // 显示数值
  //   .attr("x", (_, i) => x1(i) + x1.bandwidth() / 2) // 居中对齐
  //   .attr("y", (d) => y(d) - 5) // 位于条形上方
  //   .attr("text-anchor", "middle") // 中心对齐
  //   .attr("font-size", "10px")
  //   .attr("fill", "black");

  // 添加 x 轴
  svg
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x0).tickFormat((d, i) => groupLabels[i]));

  // 添加 X轴单位
  svg
    .append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .text(`Operate on the number of existing elements`); // 显示 X轴单位

  // 添加 y 轴
  svg.append("g").call(d3.axisLeft(y));

  // 添加 Y轴单位
  svg
    .append("text")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 20)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .text(`ns/op`); // 显示 Y轴单位

  // 添加图例
  const legend = svg
    .append("g")
    .attr("transform", `translate(${innerWidth + 20}, 0)`);

  categoryLabels.forEach((label, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(label));

    legendRow
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("text-anchor", "start")
      .attr("font-size", "10px")
      .attr("fill", color(label))
      .text(label);
  });

  // 添加标题
  d3.select(document.body)
    .select("svg")
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text(chartTitle); // 设置标题

  // 副标题
  d3.select(document.body)
    .select("svg")
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("Lower is better"); // 设置副标题

  return `<?xml version="1.0" encoding="utf-8"?>` + document.body.innerHTML;
}

export { drawGroupedBarChart };
